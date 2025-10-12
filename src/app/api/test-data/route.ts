import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get sample data for testing
    const children = await prisma.child.findMany({
      select: { 
        id: true, 
        name: true, 
        parentId: true,
        vanID: true,
        status: true
      },
      take: 10
    });

    const vans = await prisma.van.findMany({
      select: { 
        id: true, 
        registrationNumber: true, 
        makeAndModel: true,
        ownerId: true,
        assignedDriverId: true
      },
      take: 10
    });

    const drivers = await prisma.userProfile.findMany({
      where: { 
        driverProfile: { isNot: null } 
      },
      select: { 
        id: true, 
        firstname: true, 
        lastname: true,
        email: true
      },
      take: 10
    });

    const vanServices = await prisma.vanService.findMany({
      select: { 
        id: true, 
        serviceName: true, 
        userId: true 
      },
      take: 10
    });

    return NextResponse.json({
      message: 'Test data for mobile app',
      children,
      vans,
      drivers,
      vanServices,
      sampleReviewData: {
        // Use the first available child
        childId: children[0]?.id || null,
        // Use the first available van
        vanId: vans[0]?.id || null,
        // Use the first available driver
        driverTargetId: drivers[0]?.id || null,
        // Use the first available van service
        vanServiceTargetId: vanServices[0]?.id || null,
        // Use the parent of the first child
        reviewerId: children[0]?.parentId || null
      }
    });

  } catch (error) {
    console.error('Error fetching test data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
