import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      registrationNumber,
      licensePlateNumber,
      makeAndModel,
      seatingCapacity,
      acCondition,
      routeStart,
      routeEnd,
      rBookBase64,
      revenueLicenseBase64,
      fitnessCertificateBase64,
      insuranceCertificateBase64,
      photoBase64,
      ownerId,
    } = body;

    if (
      !registrationNumber || !licensePlateNumber || !makeAndModel ||
      seatingCapacity === undefined || acCondition === undefined ||
      !rBookBase64 || !revenueLicenseBase64 || !fitnessCertificateBase64 ||
      !insuranceCertificateBase64 || !photoBase64
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uploads = await Promise.all([
      cloudinary.uploader.upload(rBookBase64, { folder: 'vans/rbook' }),
      cloudinary.uploader.upload(revenueLicenseBase64, { folder: 'vans/revenue' }),
      cloudinary.uploader.upload(fitnessCertificateBase64, { folder: 'vans/fitness' }),
      cloudinary.uploader.upload(insuranceCertificateBase64, { folder: 'vans/insurance' }),
      cloudinary.uploader.upload(photoBase64, { folder: 'vans/photo' }),
    ]);

    const newVan = await prisma.van.create({
      data: {
        registrationNumber : registrationNumber,
        licensePlateNumber : licensePlateNumber,
        makeAndModel : makeAndModel,
        seatingCapacity: parseInt(seatingCapacity),
        acCondition: Boolean(acCondition),
        routeStart: routeStart || null,
        routeEnd: routeEnd || null,
        rBookUrl: uploads[0].secure_url,
        revenueLicenseUrl: uploads[1].secure_url,
        fitnessCertificateUrl: uploads[2].secure_url,
        insuranceCertificateUrl: uploads[3].secure_url,
        photoUrl: uploads[4].secure_url,
        ownerId: ownerId
      },
    });

    return NextResponse.json(newVan, { status: 201 });
  } catch (error) {
    console.error('[CREATE VAN ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
