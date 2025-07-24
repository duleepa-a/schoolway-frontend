// GET all driver applications from UserProfile + DriverProfile
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const applications = await prisma.userProfile.findMany({
      where: {
        role: 'DRIVER', 
      },
      include: {
        driverProfile: true,
      },
    });

    return NextResponse.json(applications); 
  } catch (error) {
    console.error('Error fetching applications:', error);

    return NextResponse.json([], { status: 500 });
  }
}
