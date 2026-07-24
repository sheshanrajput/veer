import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Helper to save image
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

export async function PUT(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const testimonialId = parseInt(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid Testimonial ID' }, { status: 400 });
    }

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId }
    });

    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const role = formData.get('role');
    const quote = formData.get('quote');
    const ratingVal = formData.get('rating');
    const imageFile = formData.get('image');

    const updateData = {};
    
    if (name !== null) updateData.name = name;
    if (role !== null) updateData.role = role;
    if (quote !== null) updateData.quote = quote;
    
    if (ratingVal !== null) {
      updateData.rating = parseInt(ratingVal);
    }

    // Process image file if sent
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      try {
        const savedUrl = await saveImage(imageFile);
        if (savedUrl) updateData.image = savedUrl;
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    } else if (typeof imageFile === 'string' && imageFile) {
      updateData.image = imageFile;
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial
    });

  } catch (error) {
    console.error('PUT testimonial error:', error);
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
    const testimonialId = parseInt(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid Testimonial ID' }, { status: 400 });
    }

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId }
    });

    if (!existingTestimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    await prisma.testimonial.delete({
      where: { id: testimonialId }
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('DELETE testimonial error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
