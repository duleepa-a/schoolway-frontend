import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { Decimal } from 'decimal.js';

export async function POST(req: Request) {
  try {
    console.log('in post');
    console.log(Object.keys(prisma));
    const formData = await req.formData();

    const name = formData.get('name') as string;
    const age = parseInt(formData.get('age') as string);
    const grade = parseInt(formData.get('grade') as string);
    const schoolID = parseInt(formData.get('schoolID') as string);
    const schoolStartTime = formData.get('schoolStartTime') as string;
    const schoolEndTime = formData.get('schoolEndTime') as string;
    const pickupLat = parseFloat(formData.get('pickupLat') as string);
    const pickupLng = parseFloat(formData.get('pickupLng') as string);
    const specialNotes = formData.get('specialNotes') as string;
    const file = formData.get('profilePicture') as File;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No valid image file' }, { status: 400 });
    }

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

    const imageUrl = (uploadResult as any).secure_url;

    console.log('in post');
    console.log(typeof prisma.child);
    const newChild = await prisma.child.create({
      data: {
        name,
        age,
        grade,
        schoolID,
        schoolStartTime,
        schoolEndTime,
        qrCode: generateQRCode(),
        profilePicture: imageUrl,
        pickupLat: new Decimal(pickupLat),
        pickupLng: new Decimal(pickupLng),
      },
    });

    return NextResponse.json(newChild, { status: 201 });

  } catch (error) {
    console.error('Error creating child:', error);
    return NextResponse.json({ error: 'Failed to create child' }, { status: 500 });
  }
}

// Generate unique QR code
function generateQRCode() {
  return 'QR-' + Math.random().toString(36).substring(2, 10);
}
