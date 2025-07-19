import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const updated = await prisma.driverProfile.update({
      where: { userId: userId },
      data: {
        status: 1, // mark as approved/active
      },
    });

    return NextResponse.json({ message: 'Driver approved', user: updated });
  } catch (error) {
    console.error('Error approving driver:', error);
    return NextResponse.json({ error: 'Error approving driver' }, { status: 500 });
  }
}
