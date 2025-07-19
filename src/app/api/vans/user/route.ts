import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  console.log('Fetching vans for owner:', session.user.id);
  try {
    const vans = await prisma.van.findMany({
      where: {
        ownerId: session.user.id,
      },
    });

    console.log('Vans fetched for owner:', session.user.id, vans);
    return NextResponse.json(vans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
