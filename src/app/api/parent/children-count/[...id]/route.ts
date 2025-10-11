import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  const parentId = params.id?.[0];

  console.log('Fetching children count for parentId:', parentId);

  if (!parentId) {
    return NextResponse.json({ error: 'Parent ID is required' }, { status: 400 });
  }

  try {
    const count = await prisma.child.count({
      where: { parentId },
    });

    return NextResponse.json({ parentId, childrenCount: count });
  } catch (error) {
    console.error('Error fetching children count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
