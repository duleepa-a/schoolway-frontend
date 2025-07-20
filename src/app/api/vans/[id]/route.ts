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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = await req.json();

    const updatedVan = await prisma.van.update({
      where: { id },
      data: {
        makeAndModel: data.makeAndModel,
        seatingCapacity: data.seatingCapacity,
        studentRating: data.studentRating,
        privateRating: data.privateRating,
        salaryPercentage: data.salaryPercentage,
      },
    });

    return NextResponse.json(updatedVan, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
