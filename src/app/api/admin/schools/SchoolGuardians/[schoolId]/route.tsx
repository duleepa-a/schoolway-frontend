import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ schoolId: string }> }) {
  try {
    const { schoolId } = await params;
    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
    }

    const guardians = await prisma.schoolGuardian.findMany({
      where: { schoolId: Number(schoolId) },
      include: {
        UserProfile: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
            mobile: true
          }
        }
      }
    });

    // Format the response to match the expected structure
    const formattedGuardians = guardians.map(guardian => ({
      id: guardian.id,
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      email: guardian.email,
      phone: guardian.phone || guardian.UserProfile?.mobile || null,
      schoolId: guardian.schoolId
    }));

    return NextResponse.json(formattedGuardians);
  } catch (error) {
    console.error('Error fetching guardians:', error);
    return NextResponse.json({ error: 'Failed to fetch guardians', details: String(error) }, { status: 500 });
  }
}
