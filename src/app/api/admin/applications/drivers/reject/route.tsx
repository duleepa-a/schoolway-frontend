import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const updated = await prisma.driverProfile.update({
      where: { userId: userId },
      data: {
        status: 0,
      },
    });

    return NextResponse.json({ message: 'Driver marked as inactive (rejected)', user: updated });
  } catch (error) {
    console.error('Error rejecting driver:', error);
    return NextResponse.json({ error: 'Error rejecting driver' }, { status: 500 });
  }
}
