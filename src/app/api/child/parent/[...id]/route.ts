import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string[] }> } 
) 
{
  const resolvedParams = await params;
  const id = resolvedParams.id?.[0]; 
  if (!id) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const children = await prisma.child.findMany({
      where: {
        parentId: id
      },
      include: {
        Van: {
          select: { id: true, makeAndModel: true }
        },
      },
    });

    return NextResponse.json(children, { status: 200 });
  }
  catch (error) {
    console.error('Error fetching children:', error);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}