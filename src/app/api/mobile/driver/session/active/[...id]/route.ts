import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Droplet } from 'lucide-react';

interface Params {
  id: string[];
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const driverId = params.id?.[0];
  if (!driverId) {
    return NextResponse.json({ error: 'Invalid or missing driver ID' }, { status: 400 });
  }

  try {
   const session = await prisma.transportSession.findFirst({
    where: {
        driverId,
        status: 'PENDING',
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

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No active session found for this driver.' },
        { status: 404 }
      );
    }

    const formattedStudents = session.sessionStudents.map(ss => ({
      id: ss.child.id,
      name: ss.child.name,
      pickupLocation: ss.child.pickupAddress,
      pickupTime: ss.estimatedPickup ? new Date(ss.estimatedPickup).toLocaleTimeString() : '',
      DropoffLocation: ss.child.School?.address || '',
      parentId: ss.child.UserProfile?.id || '',
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
    console.error(error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
