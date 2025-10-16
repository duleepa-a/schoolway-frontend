// File: src/app/api/driver/session/[id]/route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  id: string[];
}

export async function GET(req: NextRequest, { params }: { params: Params }) { 

  console.log('GET request received for active session');

  const driverId = params.id?.[0];
  if (!driverId) {
    return NextResponse.json({ error: 'Invalid or missing driver ID' }, { status: 400 });
  }

  console.log(`Fetching active session for driver ID: ${driverId}`);

  try {
    // Find the active session for the driver
    const session = await prisma.transportSession.findFirst({
      where: {
        driverId,
        status: {
            in: ['PENDING', 'ACTIVE']
        }
        , 
      },
      include: {
        sessionStudents: {
          include: {
            child: {
              include: {
                UserProfile: true,
                School: true,
              },
            },
          },
          orderBy: { pickupOrder: 'asc' },
        },
      },
    });

    console.log('Active session found:', session);

    if (!session) {
      return NextResponse.json({
        success: false,
        message: 'No active session found for this driver.',
      }, { status: 404 });
    }

    // Format students for frontend
    const formattedStudents = session.sessionStudents.map(ss => ({
      id: ss.child.id,
      name: ss.child.name,
      pickupLocation: {
        latitude: Number(ss.child.pickupLat),
        longitude: Number(ss.child.pickupLng),
        address: ss.child.pickupAddress || 'Not Specified',
      },
      pickupTime: ss.estimatedPickup ? new Date(ss.estimatedPickup).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      DropoffLocation: ss.child.School?.address || '',
      parentContact: ss.child.UserProfile?.mobile || '',
      profileImage: ss.child.profilePicture || '',
      pickupStatus: ss.pickupStatus,
      estimatedPickup: ss.estimatedPickup,
    }));

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        vanId: session.vanId,
        routeType: session.routeType,
        status: session.status,
        startedAt: session.startedAt,
        students: formattedStudents,
      },
    });

  } catch (error) {
    console.error('Error fetching driver session:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
