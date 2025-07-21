import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { vanID } = await req.json();

    const updated = await prisma.van.update({
      where: { id: vanID },
      data: {
        isApproved: false,
      },
    });

    return NextResponse.json({ message: 'Van  marked as inactive (rejected)', user: updated });
  } catch (error) {
    console.error('Error rejecting van:', error);
    return NextResponse.json({ error: 'Error rejecting van' }, { status: 500 });
  }
}
