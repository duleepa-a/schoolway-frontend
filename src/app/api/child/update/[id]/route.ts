import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { Decimal } from 'decimal.js';
import QRCode from 'qrcode';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const childId = parseInt(params.id);
    const formData = await req.formData();

    console.log(childId)
    console.log(formData)

    const name = formData.get('name') as string;
    const age = parseInt(formData.get('age') as string);
    const grade = parseInt(formData.get('grade') as string);
    const schoolID = parseInt(formData.get('schoolID') as string);
    const gateID = parseInt(formData.get('gateID') as string);
    const schoolStartTime = formData.get('schoolStartTime') as string;
    const schoolEndTime = formData.get('schoolEndTime') as string;
    const pickupLat = parseFloat(formData.get('pickupLat') as string);
    const pickupLng = parseFloat(formData.get('pickupLng') as string);
    const pickupAddress = formData.get('pickupLocation') as string;
    const specialNotes = formData.get('specialNotes') as string;
    const file = formData.get('profilePicture') as File | null;

    // Check if child exists
    const existingChild = await prisma.child.findUnique({
      where: { id: childId },
    });
    if (!existingChild) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    let imageUrl = existingChild.profilePicture;

    // If new file uploaded → replace old one
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'children_profiles' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
      imageUrl = (uploadResult as any).secure_url;
    }

    // Update child record
    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        name,
        age,
        grade,
        schoolID,
        gateID,
        schoolStartTime,
        schoolEndTime,
        pickupLat: new Decimal(pickupLat),
        pickupLng: new Decimal(pickupLng),
        pickupAddress,
        specialNotes,
        profilePicture: imageUrl,
        updatedAt: new Date(),
      },
    });

    // Re-generate QR code (optional, but keeps consistency)
    const qrImageDataUrl = await QRCode.toDataURL(
      `http://localhost:3000/childInfo/${updatedChild.id}`
    );

    const finalChild = await prisma.child.update({
      where: { id: updatedChild.id },
      data: { qrCode: qrImageDataUrl },
    });

    return NextResponse.json(finalChild, { status: 200 });
  } catch (error) {
    console.error('Error updating child:', error);
    return NextResponse.json({ error: 'Failed to update child' }, { status: 500 });
  }
}
