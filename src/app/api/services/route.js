import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper to slugify a string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Helper to validate and save uploaded image
async function saveImage(file) {
  if (!file || typeof file === 'string' || file.size === 0) return null;
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const ext = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error('Only jpg, jpeg, png, and webp images are allowed.');
  }
  
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be under 5MB.');
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  
  return `/uploads/${filename}`;
}

// GET: Fetch list of services (public)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const statusParam = searchParams.get('status'); // 'active', 'draft', or null (all)
    
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
        { description: { contains: search } }
      ];
    }
    
    if (statusParam === 'active') {
      where.status = true;
    } else if (statusParam === 'draft') {
      where.status = false;
    }

    const [services, totalCount] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      services,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('GET services error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST: Create a new service (Admin only)
export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const shortDescription = formData.get('shortDescription');
    const description = formData.get('description');
    const statusVal = formData.get('status') === 'true';
    const imageFile = formData.get('image');

    if (!title || !shortDescription || !description) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Process image file
    let imageUrl = '';
    try {
      if (imageFile) {
        const savedUrl = await saveImage(imageFile);
        if (savedUrl) imageUrl = savedUrl;
      }
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check slug collision
    while (await prisma.service.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newService = await prisma.service.create({
      data: {
        title,
        slug: finalSlug,
        shortDescription,
        description,
        image: imageUrl || null,
        status: statusVal,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      service: newService
    }, { status: 201 });

  } catch (error) {
    console.error('POST service error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
