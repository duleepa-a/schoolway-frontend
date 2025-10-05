import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: { schoolId: string } }
) {
  try {
    const { schoolId } = context.params;

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
    }

    const guardians = await prisma.schoolGuardian.findMany({
      where: { schoolId: Number(schoolId) },
      select: {
        guardianId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return NextResponse.json({ guardians });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch guardians', details: String(error) },
      { status: 500 }
    );
  }
}
