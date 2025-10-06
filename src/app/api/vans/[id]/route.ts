import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idString } = await params;
  const id = parseInt(idString);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const van = await prisma.van.findUnique({
    where: { id },
    include: {
      assistant: true,
      DriverVanJobRequest: {
        where: {
          status: 'ACCEPTED',
        },
        include: {
          UserProfile_DriverVanJobRequest_driverIdToUserProfile: true,
        },
      },
    },
  });

  if (!van) {
    return NextResponse.json({ error: 'Van not found' }, { status: 404 });
  }

  // Extract driver info from the first accepted request
  const driverRequest = van.DriverVanJobRequest[0]; // assuming only one accepted at a time

  const driver = driverRequest?.UserProfile_DriverVanJobRequest_driverIdToUserProfile;

  return NextResponse.json({
    ...van,
    driver, 
  });
}


export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idString } = await params;
    const id = Number(idString);
    const data = await req.json();

    const updatedVan = await prisma.van.update({
      where: { id },
      data: {
        makeAndModel: data.makeAndModel,
        seatingCapacity: data.seatingCapacity,
        studentRating: data.studentRating,
        privateRating: data.privateRating,
        salaryPercentage: data.salaryPercentage,
      },
    });

    return NextResponse.json(updatedVan, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
