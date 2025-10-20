import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const unreadCount = await prisma.notification.count({
    where: {
      targetUserId : userId,
      read: false,
    },
  });

  return NextResponse.json({ unreadCount });
}
