import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const faqId = parseInt(id);

    if (isNaN(faqId)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: faqId }
    });

    if (!existingFAQ) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    const body = await req.json();
    const { question, answer } = body;

    const updateData = {};
    if (question !== undefined) updateData.question = question;
    if (answer !== undefined) updateData.answer = answer;

    const updatedFAQ = await prisma.fAQ.update({
      where: { id: faqId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ updated successfully',
      faq: updatedFAQ
    });

  } catch (error) {
    console.error('PUT FAQ error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const faqId = parseInt(id);

    if (isNaN(faqId)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }

    const existingFAQ = await prisma.fAQ.findUnique({
      where: { id: faqId }
    });

    if (!existingFAQ) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    await prisma.fAQ.delete({
      where: { id: faqId }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully'
    });

  } catch (error) {
    console.error('DELETE FAQ error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
