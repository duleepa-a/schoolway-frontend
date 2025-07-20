import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {

     const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;

    console.log('Incoming request with search:', search);

    const vans = await prisma.van.findMany({
      where: {
        ownerId: userId,
        OR: [
          { registrationNumber: { contains: search, mode: 'insensitive' } },
          { licensePlateNumber: { contains: search, mode: 'insensitive' } },
          { makeAndModel: { contains: search, mode: 'insensitive' } }
        ]
      },
      skip: offset,
      take: limit
    });

    console.log('Found vans:', vans.length);

    const totalCount = await prisma.van.count({
      where: {
        ownerId: userId,
        OR: [
          { registrationNumber: { contains: search, mode: 'insensitive' } },
          { licensePlateNumber: { contains: search, mode: 'insensitive' } },
          { makeAndModel: { contains: search, mode: 'insensitive' } }
        ]
      }
    });

    return NextResponse.json({
      vans,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('🔥 API error in /api/vans/user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
