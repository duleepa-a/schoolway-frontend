import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

<<<<<<< HEAD
export async function GET(req: Request, { params }: { params: { schoolId: string } }) {
  try {
    const schoolId = params.schoolId;
=======
export async function GET(req: Request, { params }: { params: Promise<{ schoolId: string }> }) {
  try {
    const { schoolId } = await params;
>>>>>>> Dev_Stage
    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
    }

    const guardians = await prisma.schoolGuardian.findMany({
      where: { schoolId: Number(schoolId) },
<<<<<<< HEAD
      select: {
        guardianId: true,
        firstName: true,
        lastName: true,
        email: true,
        },
    });

    return NextResponse.json({ guardians });
  } catch (error) {
=======
      include: {
        userProfile: {
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
      phone: guardian.phone || guardian.userProfile?.mobile || null,
      schoolId: guardian.schoolId
    }));

    return NextResponse.json(formattedGuardians);
  } catch (error) {
    console.error('Error fetching guardians:', error);
>>>>>>> Dev_Stage
    return NextResponse.json({ error: 'Failed to fetch guardians', details: String(error) }, { status: 500 });
  }
}
