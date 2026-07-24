import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper to validate and save uploaded image or video
async function saveMedia(file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'ogg', 'mov'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error('Only images (jpg, jpeg, png, webp) and videos (mp4, webm, ogg, mov) are allowed.');
  }
  
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('File size must be under 50MB.');
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  
  return `/uploads/${filename}`;
}

// GET: Fetch list of hero slides
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
        { title: { contains: search } },
        { location: { contains: search } },
        { feature: { contains: search } }
      ];
    }

    if (all) {
      const slides = await prisma.heroSlide.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ success: true, slides });
    }

    const [slides, totalCount] = await Promise.all([
      prisma.heroSlide.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.heroSlide.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      slides,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('GET hero slides error:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

// POST: Create a new hero slide (Admin only)
export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') || null;
    const location = formData.get('location') || null;
    const statsValue = formData.get('statsValue') || null;
    const statsLabel = formData.get('statsLabel') || null;
    const feature = formData.get('feature') || null;
    const mediaFile = formData.get('image'); // matches typical media input name in frontend

    if (!mediaFile) {
      return NextResponse.json({ error: 'A media file (image or video) is required' }, { status: 400 });
    }

    // Process media file
    let mediaUrl = '';
    try {
      if (mediaFile && typeof mediaFile !== 'string' && mediaFile.size > 0) {
        const savedUrl = await saveMedia(mediaFile);
        if (savedUrl) mediaUrl = savedUrl;
      } else if (typeof mediaFile === 'string' && mediaFile) {
        mediaUrl = mediaFile;
      }
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (!mediaUrl) {
      return NextResponse.json({ error: 'Failed to save media file' }, { status: 400 });
    }

    const newSlide = await prisma.heroSlide.create({
      data: {
        url: mediaUrl,
        title,
        location,
        statsValue,
        statsLabel,
        feature
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Hero slide created successfully',
      slide: newSlide
    }, { status: 201 });

  } catch (error) {
    console.error('POST hero slide error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
