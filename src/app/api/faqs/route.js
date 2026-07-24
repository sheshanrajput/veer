import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

// GET: Fetch list of FAQs
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const all = searchParams.get('all') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { question: { contains: search } },
        { answer: { contains: search } }
      ];
    }

    if (all) {
      const faqs = await prisma.fAQ.findMany({
        where,
        orderBy: { createdAt: 'asc' } // FAQ order (oldest first or standard sequential order)
      });
      return NextResponse.json({ success: true, faqs });
    }

    const [faqs, totalCount] = await Promise.all([
      prisma.fAQ.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      prisma.fAQ.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      faqs,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('GET FAQs error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

// POST: Create a new FAQ (Admin only)
export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const newFAQ = await prisma.fAQ.create({
      data: {
        question,
        answer,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'FAQ created successfully',
      faq: newFAQ
    }, { status: 201 });

  } catch (error) {
    console.error('POST FAQ error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
