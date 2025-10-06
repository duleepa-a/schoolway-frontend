import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Parse FormData directly from NextRequest
    const formData = await req.formData();
    
    // Await params before using
    const { id } = await params;

    const name = formData.get('name') as string;
    const nic = formData.get('nic') as string;
    const contactNo = formData.get('contactNo') as string;
    const vanId = parseInt(id);
    const profilePicture = formData.get('profilePicture') as File;

    let uploadedImageUrl = '';

    // Handle file upload if present
    if (profilePicture && profilePicture.size > 0) {
      // Convert File to buffer
      const bytes = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'van-assistants',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;

      uploadedImageUrl = result.secure_url;
    }

    // Insert into DB
    const assistant = await prisma.assistant.create({
      data: {
        name,
        nic,
        contact: contactNo,
        vanId,
        profilePic: uploadedImageUrl,
      },
    });

    // Mark van as having assistant
    await prisma.van.update({
      where: { id: vanId },
      data: { hasAssistant: true },
    });

    return NextResponse.json({
      message: 'Assistant assigned successfully',
      assistant,
    });
  } catch (err) {
    console.error('Upload/DB error:', err);
    return NextResponse.json({ error: 'Failed to assign assistant' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const formData = await req.formData();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const name = formData.get('name') as string;
    const nic = formData.get('nic') as string;
    const contactNo = formData.get('contactNo') as string;
    const profilePicture = formData.get('profilePicture') as File;

    let uploadedImageUrl = '';

    if (profilePicture && profilePicture.size > 0) {
      const bytes = await profilePicture.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'van-assistants',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;

      uploadedImageUrl = result.secure_url;
    }

    const updatedAssistant = await prisma.assistant.update({
      where: { vanId: parseInt(id) },
      data: {
        name,
        nic,
        contact: contactNo,
        ...(uploadedImageUrl && { profilePic: uploadedImageUrl }),
      },
    });

    return NextResponse.json({
      message: 'Assistant updated successfully',
      updatedAssistant,
    });
  } catch (err) {
    console.error('Upload/DB error (PUT):', err);
    return NextResponse.json({ error: 'Failed to update assistant' }, { status: 500 });
  }
}