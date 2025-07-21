import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;

    // Validate that driver ID is provided
    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID is required' }, 
        { status: 400 }
      );
    }

    // Verify that the user is a driver and exists
    const driver = await prisma.userProfile.findFirst({
      where: {
        id: driverId,
        role: 'DRIVER',
        driverProfile: {
          isNot: null
        }
      }
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver profile not found' }, 
        { status: 404 }
      );
    }

    // Fetch job requests for the driver with van details
    const jobOffers = await prisma.driverVanJobRequest.findMany({
      where: {
        driverId,
        status: 'PENDING'
      },
      select: {
        id: true,
        createdAt: true,
        message: true,
        proposedSalary: true,
        turn: true,
        status: true,
        expiresAt: true,
        Van: {
          select: {
            id: true,
            makeAndModel: true,
            routeStart: true,
            routeEnd: true,
            photoUrl: true,
            salaryPercentage: true,
            shiftDetails: true,
            endTime: true,
            startTime: true,
            seatingCapacity: true,
            acCondition: true,
            studentRating: true,
          }
        },
        UserProfile_DriverVanJobRequest_vanOwnerIdToUserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            mobile: true,
            dp: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      jobOffers,
      driverId
    });

  } catch (error) {
    console.error('Error fetching driver job offers:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}


export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: driverId } = await params;
    const body = await req.json();
    const { jobRequestId, accepted, message } = body;
    console.log('Received body:', body);

    // Validate required fields
    if (!driverId || !jobRequestId ) {
      
        console.log('Missing required fields');
      return NextResponse.json(
      { error: 'Driver ID, job request ID, and acceptance status (boolean) are required' }, 
      { status: 400 }
      );
    }
    // Validate action type
    // if (!['accept', 'reject'].includes(action.toLowerCase())) {
    //   return NextResponse.json(
    //     { error: 'Action must be either "accept" or "reject"' }, 
    //     { status: 400 }
    //   );
    // }

    // Verify that the driver exists
    const driver = await prisma.userProfile.findFirst({
      where: {
        id: driverId,
        role: 'DRIVER',
        driverProfile: {
          isNot: null
        }
      }
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver profile not found' }, 
        { status: 404 }
      );
    }

    // Find the job request and verify it belongs to this driver
    const jobRequest = await prisma.driverVanJobRequest.findFirst({
      where: {
        id: jobRequestId,
        driverId: driverId,
        status: 'PENDING'
      },
      include: {
        Van: true
      }
    });

    if (!jobRequest) {
      return NextResponse.json(
        { error: 'Job request not found or not pending' }, 
        { status: 404 }
      );
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      if (accepted) {
        // Accept the job offer
        const updatedJobRequest = await tx.driverVanJobRequest.update({
          where: { id: jobRequestId },
          data: {
            status: 'ACCEPTED',
            respondedAt: new Date(),
            responseMessage: message || 'Job offer accepted'
          }
        });

        // Update the van to assign the driver
        await tx.van.update({
          where: { id: jobRequest.vanId },
          data: {
            hasDriver: true,
            assignedDriverId: driverId
          }
        });

        // Update driver profile status (assuming status 1 means employed)
        await tx.driverProfile.update({
          where: { userId: driverId },
          data: {
            hasVan: 1 // Employed/Assigned
          }
        });

        // Reject all other pending requests for this driver
        await tx.driverVanJobRequest.updateMany({
          where: {
            driverId: driverId,
            status: 'PENDING',
            id: { not: jobRequestId }
          },
          data: {
            status: 'REJECTED',
            respondedAt: new Date(),
            responseMessage: 'Automatically rejected - driver accepted another offer'
          }
        });

        return {
          action: 'accepted',
          jobRequest: updatedJobRequest,
          message: 'Job offer accepted successfully'
        };

      } else {
        // Reject the job offer
        const updatedJobRequest = await tx.driverVanJobRequest.update({
          where: { id: jobRequestId },
          data: {
            status: 'REJECTED',
            respondedAt: new Date(),
            responseMessage: message || 'Job offer rejected'
          }
        });

        return {
          action: 'rejected',
          jobRequest: updatedJobRequest,
          message: 'Job offer rejected successfully'
        };
      }
    });

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error handling job offer response:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}