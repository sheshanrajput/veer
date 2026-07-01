import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Server-side basic validation simulation
    const { sender, receiver, shipment } = body;
    
    if (!sender?.name || !sender?.email || !sender?.phone || !sender?.country) {
      return NextResponse.json({ error: "Sender details are incomplete" }, { status: 400 });
    }
    
    if (!receiver?.name || !receiver?.email || !receiver?.phone || !receiver?.country) {
      return NextResponse.json({ error: "Receiver details are incomplete" }, { status: 400 });
    }
    
    if (!shipment?.weight || !shipment?.parcelType || !shipment?.pickupDate) {
      return NextResponse.json({ error: "Shipment parameters are incomplete" }, { status: 400 });
    }

    // Generate a new reference number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const referenceNumber = `VR${randomSuffix}IN`;

    return NextResponse.json({
      success: true,
      message: "Inquiry submitted successfully. Our team will contact you shortly.",
      referenceNumber,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process inquiry request" }, { status: 500 });
  }
}
