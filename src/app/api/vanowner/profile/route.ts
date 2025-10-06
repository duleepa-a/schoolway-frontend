// app/api/profile/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.userProfile.findUnique({
    where: { id: session.user.id },
    include: { vanService: true },
  });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();

  try {
    const user = await prisma.userProfile.update({
      where: { id: session.user.id },
      data: {
        mobile: data.contactNo,
        firstname: data.firstname,
        lastname: data.lastname,
        dp: data.dp,
        vanService: {
          update: {
            serviceName: data.serviceName,
            contactNo: data.contactNo,
            serviceRegNumber: data.serviceRegNumber,
          },
        },
      },
      include: { 
        vanService: true   
      }
    });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: 'Update failed', detail: err }, { status: 500 });
  }
}