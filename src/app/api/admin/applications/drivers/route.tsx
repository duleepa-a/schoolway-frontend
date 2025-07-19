// GET all driver applications from UserProfile + DriverProfile
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.userProfile.findMany({
      where: {
        role: 'DRIVER', // only driver applications
        // driverProfile: {
        //   // optionally filter incomplete profiles if needed
        // },
      },
      include: {
        driverProfile: true,
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Error fetching applications' }, { status: 500 });
  }
}
