// app/api/parent/children-sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getFirebaseSession } from '@/lib/firebase-admin'; // import your helper

export async function GET(req: NextRequest) {
  try {
    const parentId = req.nextUrl.searchParams.get('parentId');
    if (!parentId) {
      return NextResponse.json({ success: false, message: 'parentId is required' }, { status: 400 });
    }

    // 1️⃣ Fetch all children for this parent
    const children = await prisma.child.findMany({
      where: { parentId },
      select: {
        id: true,
        name: true,
        pickupLat: true,
        pickupLng: true,
        status: true,
        Gate: true,
      },
    });

    if (children.length === 0) {
      return NextResponse.json({ success: true, children: [], sessions: [] });
    }

    const childIds = children.map(c => c.id);

    // 2️⃣ Fetch active sessions for these children
    const sessions = await prisma.transportSession.findMany({
      where: {
        SessionStudent: {
          some: { childId: { in: childIds } },
        },
        status: { in: ['PENDING', 'ACTIVE'] },
      },
      include: {
        SessionStudent: {
          where: { childId: { in: childIds } },
          select: { childId: true, pickupStatus: true },
        },
        Van: { select: { id: true, registrationNumber: true } },
        UserProfile: true,
      },
    });

    // 3️⃣ Enrich sessions with Firebase real-time data
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        let firebaseData = null;
        if (session.firebaseSessionId) {
          firebaseData = await getFirebaseSession(session.firebaseSessionId);
        }
        return {
          ...session,
          firebaseData,
        };
      })
    );

    return NextResponse.json({
      success: true,
      children,
      sessions: enrichedSessions,
    });

  } catch (err) {
    console.error('Failed to fetch children sessions:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
