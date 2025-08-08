import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export async function POST( req: NextRequest,
  { params }: { params: { id: string[] } } 
) 
{
  const id = params.id?.[0]; 
  if (!id) {
    return NextResponse.json({ error: 'Invalid or missing ID' }, { status: 400 });
  }

  const { currentPassword, newPassword } = await req.json();

  const user = await prisma.userProfile.findUnique({
    where: { id: id },
  });

  if (!user || !user.password || !(await bcrypt.compare(currentPassword, user.password))) {
    return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.userProfile.update({
    where: { id: id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
}
