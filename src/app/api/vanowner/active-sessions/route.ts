// app/api/van-owner/active-sessions/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 
import { getFirebaseDatabase } from "@/lib/firebase-admin";
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ownerId = session?.user?.id;
    // Get all vans owned by this user with ACTIVE sessions
    const activeSessions = await prisma.transportSession.findMany({
      where: {
        status: {
            in : [ "ACTIVE", "PENDING" ]
        }
        ,
        van: {
          ownerId,
        },
      },
      include: {
        van: true,
        driver: true,
      },
    });

    return NextResponse.json(activeSessions);
  } catch (error) {
    console.error("Error fetching active sessions:", error);
    return NextResponse.json({ error: "Failed to fetch active sessions" }, { status: 500 });
  }
}
