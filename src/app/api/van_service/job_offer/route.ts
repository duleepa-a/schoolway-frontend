import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Get the session to retrieve the van owner ID
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vanOwnerId = session.user.id;
    
    // Parse request body
    const body = await req.json();
    const { driverId, vanId, message, proposedSalary, turn } = body;

    // Validate required fields
    if (!driverId || !vanId) {
      return NextResponse.json(
        { error: 'Driver ID and Van ID are required' }, 
        { status: 400 }
      );
    }

    // Check if the van belongs to the authenticated user
    const van = await prisma.van.findFirst({
      where: {
        id: parseInt(vanId),
        ownerId: vanOwnerId
      }
    });

    if (!van) {
      return NextResponse.json(
        { error: 'Van not found or you do not have permission to access it' }, 
        { status: 404 }
      );
    }

    // Check if the driver exists and has a driver profile
    const driver = await prisma.userProfile.findFirst({
      where: {
        id: driverId,
        role: 'DRIVER',
        DriverProfile: {
          isNot: null
        }
      },
      include: {
        DriverProfile: true
      }
    });

    if (!driver || !driver.DriverProfile) {
      return NextResponse.json(
        { error: 'Driver not found or invalid driver profile' }, 
        { status: 404 }
      );
    }

    // Check if there's already an active job request for this combination
    const existingRequest = await prisma.driverVanJobRequest.findFirst({
      where: {
        driverId,
        vanId: parseInt(vanId),
        vanOwnerId,
        status: {
          in: ['PENDING', 'ACCEPTED']
        }
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A job request already exists for this driver and van' }, 
        { status: 409 }
      );
    }

    // Create the job request
    const jobRequest = await prisma.driverVanJobRequest.create({
      data: {
        id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
        driverId,
        vanId: parseInt(vanId),
        vanOwnerId,
        message: message || null,
        proposedSalary: proposedSalary ? parseFloat(proposedSalary) : null,
        turn: turn || null,
        status: 'PENDING'
      },
      include: {
        UserProfile_DriverVanJobRequest_driverIdToUserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true
          }
        },
        Van: {
          select: {
            id: true,
            makeAndModel: true,
            licensePlateNumber: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Job offer sent successfully',
      jobRequest
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating job request:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
// GET endpoint to fetch job requests for a van owner
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vanOwnerId = session.user.id;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const vanId = searchParams.get('vanId');
    const driverId = searchParams.get('driverId');

    // If checking for existing request between specific driver and van
    if (driverId && vanId) {
      const existingRequest = await prisma.driverVanJobRequest.findFirst({
        where: {
          driverId,
          vanId: parseInt(vanId),
          vanOwnerId,
          status: {
            in: ['PENDING', 'ACCEPTED']
          }
        },
        include: {
          UserProfile_DriverVanJobRequest_driverIdToUserProfile: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true
              }
          },
          Van: {
            select: {
              id: true,
              makeAndModel: true,
              licensePlateNumber: true
            }
          }
        }
      });

      return NextResponse.json({
        success: true,
        hasExistingRequest: !!existingRequest,
        existingRequest
      });
    }

    let whereClause: any = {
      vanOwnerId
    };

    if (status) {
      whereClause.status = status;
    }

    if (vanId) {
      whereClause.vanId = parseInt(vanId);
    }

    console.log('Fetching job requests with where clause:', searchParams.toString());

    const jobRequests = await prisma.driverVanJobRequest.findMany({
      where: whereClause,
      include: {
        UserProfile_DriverVanJobRequest_driverIdToUserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true
          }
        },
        Van: {
          select: {
            id: true,
            makeAndModel: true,
            licensePlateNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      jobRequests
    });

  } catch (error) {
    console.error('Error fetching job requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}