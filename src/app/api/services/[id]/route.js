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
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid Service ID' }, { status: 400 });
    }

    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const title = formData.get('title');
    const shortDescription = formData.get('shortDescription');
    const description = formData.get('description');
    const statusVal = formData.get('status');
    const imageFile = formData.get('image');

    const updateData = {};
    
    if (title !== null) {
      updateData.title = title;
      if (title !== existingService.title) {
        let baseSlug = slugify(title);
        let finalSlug = baseSlug;
        let counter = 1;
        while (await prisma.service.findUnique({ where: { slug: finalSlug, NOT: { id: serviceId } } })) {
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        updateData.slug = finalSlug;
      }
    }
    
    if (shortDescription !== null) updateData.shortDescription = shortDescription;
    if (description !== null) updateData.description = description;
    
    if (statusVal !== null) {
      updateData.status = statusVal === 'true';
    }

    // Process image file if sent
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      try {
        const savedUrl = await saveImage(imageFile);
        if (savedUrl) updateData.image = savedUrl;
      } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    console.error('PUT service error:', error);
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
    const serviceId = parseInt(id);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: 'Invalid Service ID' }, { status: 400 });
    }

    const existingService = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('DELETE service error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
