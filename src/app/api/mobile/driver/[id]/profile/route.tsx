// app/api/mobile/driver/[id]/profile/route.ts
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

async function saveFile(file: File | null): Promise<string | null> {
  if (!file) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${ext}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      include: { driverProfile: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    const formData = await req.formData();

    const fields: any = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        try {
          fields[key] = JSON.parse(value);
        } catch {
          fields[key] = value;
        }
      }
    }

    // Upload files
    const dp = await saveFile(formData.get('profileImage') as File);
    const licenseFront = await saveFile(formData.get('licenseFront') as File);
    const licenseBack = await saveFile(formData.get('licenseBack') as File);
    const policeReport = await saveFile(formData.get('policeReport') as File);
    const medicalReport = await saveFile(formData.get('medicalReport') as File);

    // Update UserProfile
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: {
        firstname: fields.firstName,
        lastname: fields.lastName,
        email: fields.email,
        mobile: fields.phone,
        address: fields.address,
        district: fields.address?.split(',')[1]?.trim() ?? null,
        birthDate: fields.birthDate ? new Date(fields.birthDate) : undefined,
        nic: fields.nic,
        nic_pic: fields.nicPic ?? undefined,
        dp: dp || undefined,
      },
    });

    // Upsert DriverProfile
    const updatedDriver = await prisma.driverProfile.upsert({
      where: { userId },
      update: {
        licenseId: fields.licenseId,
        licenseExpiry: new Date(fields.licenseExpiry),
        licenseType: Array.isArray(fields.licenseType)
          ? fields.licenseType
          : [fields.licenseType],
        relocate: fields.relocate === 'true',
        startedDriving: fields.startedDriving
          ? new Date(fields.startedDriving)
          : undefined,
        languages: Array.isArray(fields.languages)
          ? fields.languages
          : [fields.languages],
        licenseFront: licenseFront || undefined,
        licenseBack: licenseBack || undefined,
        policeReport: policeReport || undefined,
        medicalReport: medicalReport || undefined,
        bio: fields.bio ?? '',
      },
      create: {
        userId,
        licenseId: fields.licenseId,
        licenseExpiry: new Date(fields.licenseExpiry),
        licenseType: Array.isArray(fields.licenseType)
          ? fields.licenseType
          : [fields.licenseType],
        relocate: fields.relocate === 'true',
        startedDriving: fields.startedDriving
          ? new Date(fields.startedDriving)
          : undefined,
        languages: Array.isArray(fields.languages)
          ? fields.languages
          : [fields.languages],
        licenseFront: licenseFront || undefined,
        licenseBack: licenseBack || undefined,
        policeReport: policeReport || undefined,
        medicalReport: medicalReport || undefined,
        bio: fields.bio ?? '',
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      driver: updatedDriver,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
