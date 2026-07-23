import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Format orders for the frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      billingId: order.billingId,
      trackingId: order.trackingId,
      orderName: order.orderName,
      mobile: order.mobile,
      orderEmail: order.orderEmail,
      description: order.description,
      status: order.status,
      // Pass dates as strings to match frontend expectations
      createdAt: order.createdAt.toLocaleDateString(),
      updatedAt: order.updatedAt.toLocaleDateString()
    }));
    
    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders from DB:', error);
    return NextResponse.json({ error: 'Failed to read orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Note: The frontend sends the ENTIRE array of orders here currently.
    // We should either sync it all, or accept individual saves. 
    // Since it sends the full array, let's sync it.
    const frontendOrders = await request.json();
    
    // Simplest approach: Delete all and insert many to keep it perfectly in sync with the frontend state.
    // Or just create new ones based on billing ID.
    // Let's do an upsert for each to be safe and avoid wiping.
    
    await prisma.$transaction(
      frontendOrders.map(order => 
        prisma.order.upsert({
          where: { billingId: order.billingId },
          update: {
            trackingId: order.trackingId || null,
            orderName: order.orderName || "",
            mobile: order.mobile || null,
            orderEmail: order.orderEmail || null,
            description: order.description || null,
            status: order.status || "Pending",
          },
          create: {
            billingId: order.billingId,
            trackingId: order.trackingId || null,
            orderName: order.orderName || "",
            mobile: order.mobile || null,
            orderEmail: order.orderEmail || null,
            description: order.description || null,
            status: order.status || "Pending",
          }
        })
      )
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving orders to DB:', error);
    return NextResponse.json({ error: 'Failed to save orders' }, { status: 500 });
  }
}
