import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Attendance ID is required' }, { status: 400 });
    }

    // Delete the attendance record
    await prisma.childAttendance.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Attendance unmarked successfully' });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
