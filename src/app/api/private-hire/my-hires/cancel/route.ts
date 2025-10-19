import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Missing trip id' }, { status: 400 });
    }
    const updated = await prisma.privateHire.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    return NextResponse.json({ success: true, trip: updated }, { status: 200 });
  } catch (error) {
    console.error('Cancel trip error:', error);
    return NextResponse.json({ error: 'Failed to cancel trip' }, { status: 500 });
  }
}
