import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper to validate and save uploaded media (image/video)
async function saveMedia(file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'webm', 'ogg', 'mov'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error('Only images (jpg, jpeg, png, webp) and videos (mp4, webm, ogg, mov) are allowed.');
  }
  
  const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(ext);
  const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image

  if (file.size > maxSize) {
    throw new Error(`File size must be under ${isVideo ? '50MB' : '5MB'}.`);
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  
  return `/uploads/${filename}`;
}

// GET: Fetch gallery list (public)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.title = { contains: search };
    }
    if (category) {
      where.category = category;
    }

    const [images, totalCount] = await Promise.all([
      prisma.gallery.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.gallery.count({ where }),
    ]);

    // Get list of unique categories in gallery for search filter options
    const categoriesRaw = await prisma.gallery.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    const categories = categoriesRaw.map(c => c.category).filter(Boolean);

    return NextResponse.json({
      success: true,
      images,
      categories,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('GET gallery error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

// POST: Upload gallery image (Admin only)
export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const category = formData.get('category') || 'General';
    const imageFile = formData.get('image');

    if (!title || !imageFile) {
      return NextResponse.json({ error: 'Title and image file are required' }, { status: 400 });
    }

    let imageUrl = '';
    try {
      const savedUrl = await saveMedia(imageFile);
      if (savedUrl) imageUrl = savedUrl;
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const newImage = await prisma.gallery.create({
      data: {
        title,
        image: imageUrl,
        category,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery image uploaded successfully',
      image: newImage
    }, { status: 201 });

  } catch (error) {
    console.error('POST gallery error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
