import { NextResponse,NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {

    console.log('Received parent profile update request');
    const parentId = params.id?.[0]; 

    if (!parentId) {
        return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }
    const formData = await req.formData();
    const file = formData.get('profileImage') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Check if parent exists
    const existingParent = await prisma.userProfile.findUnique({
      where: { id: parentId },
    });

    if (!existingParent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    // Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'parent_profiles' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const imageUrl = (uploadResult as any).secure_url;

    // Update parent profile with new image URL
    const updatedParent = await prisma.userProfile.update({
      where: { id: parentId },
      data: {
        dp: imageUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Profile picture updated successfully',
      user: updatedParent 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return NextResponse.json({ error: 'Failed to update profile picture' }, { status: 500 });
  }
}