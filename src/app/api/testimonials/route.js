import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

// GET: Fetch list of testimonials
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
        { name: { contains: search } },
        { role: { contains: search } },
        { quote: { contains: search } }
      ];
    }

    if (all) {
      const testimonials = await prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ success: true, testimonials });
    }

    const [testimonials, totalCount] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      testimonials,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('GET testimonials error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST: Create a new testimonial (Admin only)
export async function POST(req) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const role = formData.get('role');
    const quote = formData.get('quote');
    const ratingVal = formData.get('rating');
    const rating = ratingVal ? parseInt(ratingVal) : 5;
    const imageFile = formData.get('image');

    if (!name || !role || !quote) {
      return NextResponse.json({ error: 'Name, role, and quote are required' }, { status: 400 });
    }

    // Process image file
    let imageUrl = '/images/user-avatar.svg'; // default avatar
    try {
      if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
        const savedUrl = await saveImage(imageFile);
        if (savedUrl) imageUrl = savedUrl;
      } else if (typeof imageFile === 'string' && imageFile) {
        imageUrl = imageFile;
      }
    } catch (err) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        quote,
        rating,
        image: imageUrl,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial: newTestimonial
    }, { status: 201 });

  } catch (error) {
    console.error('POST testimonial error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
