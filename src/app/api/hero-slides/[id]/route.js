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

export async function PUT(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const slideId = parseInt(id);

    if (isNaN(slideId)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: slideId }
    });

    if (!existingSlide) {
      return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const location = formData.get('location');
    const statsValue = formData.get('statsValue');
    const statsLabel = formData.get('statsLabel');
    const feature = formData.get('feature');
    const mediaFile = formData.get('image');

    const updateData = {};
    if (title !== null) updateData.title = title || null;
    if (location !== null) updateData.location = location || null;
    if (statsValue !== null) updateData.statsValue = statsValue || null;
    if (statsLabel !== null) updateData.statsLabel = statsLabel || null;
    if (feature !== null) updateData.feature = feature || null;

    // Process media file if provided
    if (mediaFile && typeof mediaFile !== 'string' && mediaFile.size > 0) {
      try {
        const savedUrl = await saveMedia(mediaFile);
        if (savedUrl) updateData.url = savedUrl;
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    } else if (typeof mediaFile === 'string' && mediaFile) {
      updateData.url = mediaFile;
    }

    const updatedSlide = await prisma.heroSlide.update({
      where: { id: slideId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Hero slide updated successfully',
      slide: updatedSlide
    });

  } catch (error) {
    console.error('PUT hero slide error:', error);
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
    const slideId = parseInt(id);

    if (isNaN(slideId)) {
      return NextResponse.json({ error: 'Invalid slide ID' }, { status: 400 });
    }

    const existingSlide = await prisma.heroSlide.findUnique({
      where: { id: slideId }
    });

    if (!existingSlide) {
      return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
    }

    await prisma.heroSlide.delete({
      where: { id: slideId }
    });

    return NextResponse.json({
      success: true,
      message: 'Hero slide deleted successfully'
    });

  } catch (error) {
    console.error('DELETE hero slide error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
