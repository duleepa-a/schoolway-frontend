import { NextResponse } from 'next/server';
import  prisma  from '@/lib/prisma';

export async function GET() {
  try {
    const vans = await prisma.van.findMany({
        include: {
          UserProfile: { select: { firstname: true, lastname: true } },
          Path: true,
        },
      });
    
    return NextResponse.json(vans, { status: 200 });
  } catch (error) {
    console.error('Error fetching vans', error);
    return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 });
  }
}
