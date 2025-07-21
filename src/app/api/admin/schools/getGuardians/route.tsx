import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const guardians = await prisma.schoolGuardian.findMany({
      include: {
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
          },
        },
        School: {
          select: {
            id: true,
            schoolName: true,
            contact: true,
          },
        },
      },
    });

    const formattedGuardians = guardians.map((guardian) => ({
      guardianId: guardian.UserProfile.id,
      firstname: guardian.UserProfile.firstname,
      lastname: guardian.UserProfile.lastname,
      email: guardian.UserProfile.email,
      contact: guardian.School.contact,
      schoolName: guardian.School.schoolName,
      schoolId: guardian.School.id,
    }));

    return NextResponse.json(formattedGuardians);
  } catch (error) {
    console.error("Error fetching guardians:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch guardians",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
