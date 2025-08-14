import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('🚀 Starting /api/vans/user request');

    const session = await getServerSession(authOptions);
    console.log('📝 Session check:', !!session, !!session?.user, !!session?.user?.id);

    if (!session || !session.user || !session.user.id) {
      console.log('❌ Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;

    console.log('📊 Request params:', { userId, search, page, limit, offset });

    // Test database connection first
    console.log('🔍 Testing database connection...');
    const testConnection = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection test:', testConnection);

    console.log('🚐 Fetching vans...');
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

    console.log('✅ Found vans:', vans.length);

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

    console.log('📊 Total count:', totalCount);

    return NextResponse.json({
      vans,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('🔥 API error in /api/vans/user:', error);
    console.error('🔥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('🔥 Error message:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
