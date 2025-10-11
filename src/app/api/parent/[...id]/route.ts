import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string[] } } 
) 
{
  const id = params.id?.[0]; 
  if (!id) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  try {
    const user = await prisma.userProfile.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id?.[0];
  const body = await req.json();

  try {
    const updatedUser = await prisma.userProfile.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
