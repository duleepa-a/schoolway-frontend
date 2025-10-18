import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
        Path: {
          include: {
            WayPoint: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        Assistant: true,
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

    const driverRequest = van.DriverVanJobRequest[0];
    const driver = driverRequest?.UserProfile_DriverVanJobRequest_driverIdToUserProfile;

    // Add hasRoute flag based on Path existence
    const transformedVan = {
      ...van,
      driver,
      hasRoute: !!van.Path,  // Convert to boolean
      routeAssigned: !!van.pathId && !!van.Path // Check both pathId and Path existence
    };

    console.log('Transformed Van:', transformedVan);
    return NextResponse.json(transformedVan);
  } catch (error) {
    console.error('Error fetching van:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: idString } = params;
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
