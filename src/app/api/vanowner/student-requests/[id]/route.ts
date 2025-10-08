import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

async function getUserIdFromReq(req: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const ownerId = await getUserIdFromReq(req);
  if (!ownerId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const { action } = body as { action?: 'accept' | 'reject' };

  if (!action || !['accept', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const newStatus = action === 'accept' ? 'ACCEPTED' : 'REJECTED';

  try {
    const found = await prisma.vanRequest.findUnique({
      where: { id },
      include: { van: true },
    });

    if (!found) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (found.van.ownerId !== ownerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedRequest = await prisma.vanRequest.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });

    if (action === 'accept') {
      await prisma.child.update({
        where: { id: found.childId },
        data: {
          status: 'AT_HOME',
          vanID: found.van.id,
          feeAmount: found.estimatedFare,
        },
      });
    }

    return NextResponse.json({
      id: updatedRequest.id,
      status: updatedRequest.status,
      updatedAt: updatedRequest.updatedAt,
    });
  } catch (err) {
    console.error('Error updating van request:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
