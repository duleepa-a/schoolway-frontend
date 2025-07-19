import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const paras = await params;
  const id = parseInt(paras.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const van = await prisma.van.findUnique({
    where: { id },
  });

  if (!van) {
    return NextResponse.json({ error: 'Van not found' }, { status: 404 });
  }

  return NextResponse.json(van);
}
