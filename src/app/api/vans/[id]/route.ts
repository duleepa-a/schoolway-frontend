import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/vans/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const van = await prisma.van.findUnique({
      where: { id },
      include: {
        Assistant: true,
        DriverVanJobRequest: {
          where: { status: 'ACCEPTED' },
          include: {
            UserProfile_DriverVanJobRequest_driverIdToUserProfile: true,
          },
        },
      },
    });

    if (!van) {
      return NextResponse.json({ error: 'Van not found' }, { status: 404 });
    }

    const driverRequest = van.DriverVanJobRequest[0];
    const driver = driverRequest?.UserProfile_DriverVanJobRequest_driverIdToUserProfile;

    const transformedVan = {
      ...van,
      driver,
      hasRoute: !!van.Path,
      routeAssigned: !!van.pathId && !!van.Path,
    };

    return NextResponse.json(transformedVan);
  } catch (error) {
    console.error('Error fetching van:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/vans/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
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
