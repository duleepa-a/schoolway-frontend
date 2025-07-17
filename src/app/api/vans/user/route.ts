import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  const offset = (page - 1) * limit;

  const vans = await prisma.van.findMany({
    where: {
      OR: [
        { registrationNumber: { contains: search, mode: 'insensitive' } },
        { licensePlateNumber: { contains: search, mode: 'insensitive' } },
        { makeAndModel: { contains: search, mode: 'insensitive' } }
      ]
    },
    skip: offset,
    take: limit
  });

  const totalCount = await prisma.van.count({
    where: {
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
}

