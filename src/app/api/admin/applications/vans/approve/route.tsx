import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { vanID } = await req.json();

    const updated = await prisma.van.update({
      where: { id: vanID },
      data: {
        status: 1, // 1 = approved 
      },
    });

    return NextResponse.json({ message: 'Van approved', van: updated });
  } catch (error) {
    console.error('Error approving van:', error);
    return NextResponse.json({ error: 'Error approving van' }, { status: 500 });
  }
}
