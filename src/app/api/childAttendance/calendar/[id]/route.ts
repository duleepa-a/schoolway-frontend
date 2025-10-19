import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type RouteType = 'MORNING_PICKUP' | 'EVENING_DROPOFF' | 'BOTH';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid child ID' }, { status: 400 });
  }

  try {
    const attendance = await prisma.childAttendance.findMany({
      where: { childId: id },
      select: {
        absenceDate: true,
        routeType: true,
      },
      orderBy: { absenceDate: 'desc' },
    });

    const formatted = attendance.map((item) => {
      // Convert to local time (Sri Lanka = UTC+5:30)
      const localDate = new Date(item.absenceDate);
      const dateString = localDate.toLocaleDateString('en-CA', {
        timeZone: 'Asia/Colombo', // ensures local conversion
      });

      return {
        date: dateString,
        status: 'absent',
        routeType: item.routeType as RouteType,
      };
    });

    console.log(formatted);

    return NextResponse.json({ attendance: formatted });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch attendance' },
      { status: 500 }
    );
  }
}
