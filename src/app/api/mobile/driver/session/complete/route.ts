// src/pages/api/mobile/driver/session/complete.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { deleteFirebaseSession } from '@/lib/firebase-admin';

interface Params {
  id: string[]; // optional if you want to get sessionId from route params
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  try {
    const body = await req.json();
    const { sessionId, status } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    const updatedSession = await prisma.transportSession.update({
      where: { id: sessionId },
      data: {
        status: status,
        endedAt: new Date(),
      },
    });

    try {
      await deleteFirebaseSession(sessionId);
      console.log(`Firebase session ${sessionId} deleted successfully`);
    } catch (firebaseErr) {
      console.error('Error deleting Firebase session:', firebaseErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Session completed and Firebase session removed',
        session: updatedSession,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error completing session:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
