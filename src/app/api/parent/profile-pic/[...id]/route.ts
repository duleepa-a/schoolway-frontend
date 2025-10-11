import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { NextRequest, NextResponse } from 'next/server';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  profileImage?: string; // base64 encoded string from mobile
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {

    console.log('Received parent profile update request');
    const id = params.id?.[0]; 
    if (!id) {
        return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
    }
    const data = (await req.json()) as FormData;

    let profileImageUrl: string | undefined = undefined;

    if (data.profileImage) {
      console.log('Uploading parent profile image...');
      const uploadResult = await cloudinary.uploader.upload(data.profileImage, {
        folder: 'SchoolWay/profile_images',
        resource_type: 'image',
        transformation: [{ quality: 'auto:good' }],
      });

      profileImageUrl = uploadResult.secure_url;
      console.log('Parent profile image uploaded:', uploadResult.secure_url);
    }

    // Update user profile in Prisma
    const updatedUser = await prisma.userProfile.update({
      where: { id },
      data: {
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        mobile: data.phone,
        address: data.address,
        dp: profileImageUrl ?? undefined, 
      },
    });

    return NextResponse.json({
      message: 'Parent profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Parent update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile', error: (error as Error).message },
      { status: 500 }
    );
  }
}
