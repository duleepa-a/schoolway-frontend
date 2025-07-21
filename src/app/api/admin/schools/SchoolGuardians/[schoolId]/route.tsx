import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(req: Request, { params }: { params: { schoolId: string } }) {
  try {
    const schoolId = params.schoolId;
    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
    }

    const guardians = await prisma.guardian.findMany({
      where: { schoolId: Number(schoolId) },
      select: {
        guardianId: true,
        firstname: true,
        lastname: true,
        email: true,
        contact: true,
      },
    });

    return NextResponse.json({ guardians });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch guardians', details: String(error) }, { status: 500 });
  }
}
