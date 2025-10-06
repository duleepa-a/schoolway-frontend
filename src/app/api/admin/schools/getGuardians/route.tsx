import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const guardians = await prisma.schoolGuardian.findMany({
      include: {
        school: {
          select: {
            id: true,
            schoolName: true,
            contact: true,
          },
        },
        userProfile: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
            activeStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedGuardians = guardians.map((guardian) => ({
      id: guardian.id,
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      email: guardian.email,
      phone: guardian.phone,
      schoolName: guardian.school.schoolName,
      schoolId: guardian.school.id,
      createdAt: guardian.createdAt,
      updatedAt: guardian.updatedAt,
    }));

    return NextResponse.json(formattedGuardians);
  } catch (error) {
    console.error("Error fetching guardians:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch guardians",
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
