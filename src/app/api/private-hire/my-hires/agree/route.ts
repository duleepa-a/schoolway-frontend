import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const { id, userAccepted } = await req.json();
    if (!id || typeof userAccepted !== 'boolean') {
      return NextResponse.json({ error: 'Missing id or userAccepted' }, { status: 400 });
    }
    const updatedHire = await prisma.privateHire.update({
      where: { id },
      data: { userAccepted },
    });
    return NextResponse.json({ success: true, hire: updatedHire });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update userAccepted' }, { status: 500 });
  }
}
