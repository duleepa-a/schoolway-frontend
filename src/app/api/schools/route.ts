import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      select: { id: true, schoolName: true, email: true }
    });
    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
