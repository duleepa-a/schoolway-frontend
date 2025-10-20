import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

// GET /api/vanowner/transport-sessions?ownerId=xyz
export async function GET(req: NextRequest) {
  try {
    
    const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    
        const ownerId = session?.user?.id;
    if (!ownerId) {
      return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
    }

    // Fetch all vans owned by this owner
    const vans = await prisma.van.findMany({
      where: { ownerId },
      select: { id: true },
    });

    const vanIds = vans.map((v) => v.id);

    if (vanIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all transport sessions for these vans
    const sessions = await prisma.transportSession.findMany({
      where: {
        vanId: { in: vanIds },
      },
      include: {
        van: true,
        driver: true,
      },
      orderBy: {
        sessionDate: "desc",
      },
    });

    return NextResponse.json(sessions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
