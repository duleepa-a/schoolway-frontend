import { NextRequest, NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma'; // adjust to your prisma import path

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { childId, date, attendanceType } = body;

    if (!childId || !date || !attendanceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const attendance = await prisma.childAttendance.create({
      data: {
        childId: parseInt(childId, 10),
        absenceDate: new Date(date),
        routeType: attendanceType.toUpperCase(), // "MORNING", "EVENING", "BOTH"
      },
    });

    return NextResponse.json({ attendance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}
