import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserIdFromReq(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserIdFromReq();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const body = await req.json().catch(() => ({}));
  const { action } = body as { action?: 'inactive' | 'remove' };

  if (!action || !['inactive', 'remove'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  try {
    const child = await prisma.child.findUnique({ where: { id: Number(id) } });
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    let updatedChild;

    if (action === 'inactive') {
      updatedChild = await prisma.child.update({
        where: { id: Number(id) },
        data: { status: 'INACTIVE' },
      });
    } else if (action === 'remove') {
      updatedChild = await prisma.child.update({
        where: { id: Number(id) },
        data: { status: 'NOT_ASSIGNED', vanID: null },
      });
    }

    return NextResponse.json({
      message: 'Child updated successfully',
      child: updatedChild,
    });
  } catch (err) {
    console.error('Error updating child:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
