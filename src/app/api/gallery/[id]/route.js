import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const galleryId = parseInt(id);

    if (isNaN(galleryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const existingImage = await prisma.gallery.findUnique({
      where: { id: galleryId }
    });

    if (!existingImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    await prisma.gallery.delete({
      where: { id: galleryId }
    });

    return NextResponse.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });

  } catch (error) {
    console.error('DELETE gallery error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
