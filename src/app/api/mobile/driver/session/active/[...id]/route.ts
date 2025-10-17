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
        SessionStudent: {
        include: {
            Child: {
            include: {
                UserProfile: true, 
                School: true, // Include parent here
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

    const formattedStudents = session.SessionStudent.map(ss => ({
      id: ss.Child.id,
      name: ss.Child.name,
      pickupLocation: ss.Child.pickupAddress,
      pickupTime: ss.estimatedPickup ? new Date(ss.estimatedPickup).toLocaleTimeString() : '',
      DropoffLocation: ss.Child.School?.address || '',
      parentContact: ss.Child.UserProfile?.mobile || '',
      profileImage: ss.Child.profilePicture || '',
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
