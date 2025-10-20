// app/api/parent/children-sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getFirebaseSession } from '@/lib/firebase-admin';
import { chown } from 'fs';

// Utility function to calculate distance using Haversine formula
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (val: number) => (val * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // distance in km
}

const ETA_THRESHOLD_MINUTES = 25; // Trigger alert when ETA < 5 minutes
const NOTIFICATION_COOLDOWN_MINUTES = 5;

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

    const childIds = children.map((c) => c.id);

    // 2️⃣ Fetch active sessions for these children
    const sessions = await prisma.transportSession.findMany({
      where: {
        sessionStudents: { some: { childId: { in: childIds } } },
        status: { in: ['PENDING', 'ACTIVE'] },
      },
      include: {
        sessionStudents: {
          where: { childId: { in: childIds } },
          select: { childId: true, pickupStatus: true },
        },
        van: { select: { id: true, registrationNumber: true } },
        driver: true,
      },
    });

    // 3️⃣ Enrich sessions with Firebase data & calculate ETA
    const enrichedSessions = await Promise.all(
      sessions.map(async (session) => {
        let firebaseData = null;
        const etaMap: Record<string, number> = {};

        if (session.firebaseSessionId) {
          firebaseData = await getFirebaseSession(session.firebaseSessionId);
        }

        if (firebaseData?.currentLocation && firebaseData?.students) {
          const vanLat = firebaseData.currentLocation.latitude;
          const vanLng = firebaseData.currentLocation.longitude;

          for (const [childId, student] of Object.entries(firebaseData.students)) {
            const id = parseInt(childId);
            const child = children.find((c) => c.id === id);
            if (!child) continue;

            let targetLat: number | null = null;
            let targetLng: number | null = null;

            // MORNING_PICKUP → only AT_HOME
            if (session.routeType === 'MORNING_PICKUP' && child.status === 'AT_HOME') {
              targetLat = child.Gate?.latitude ?? null;
              targetLng = child.Gate?.longitude ?? null;
            }

            // EVENING_DROPOFF → only ON_VAN
            if (session.routeType === 'EVENING_DROPOFF' && child.status === 'ON_VAN') {
              targetLat = child.pickupLat != null ? parseFloat(child.pickupLat.toString()) : null;
              targetLng = child.pickupLng != null ? parseFloat(child.pickupLng.toString()) : null;
            }

            // Calculate ETA if target coordinates exist
            if (targetLat && targetLng) {
              const distance = haversineDistance(vanLat, vanLng, targetLat, targetLng);
              const VAN_SPEED_KMH = 30; // average speed
              const VAN_SPEED_KMPM = VAN_SPEED_KMH / 60; // km per minute
              const etaMinutes = distance / VAN_SPEED_KMPM;
              etaMap[childId] = Math.round(etaMinutes);

              if (etaMap[childId] <= ETA_THRESHOLD_MINUTES) {
                const title = `Van for ${child.name} is almost there!`;
                const message = `ETA: ${Math.round(etaMap[childId])} minutes`;

                // Check for recent notifications to avoid spam
                const recentNotif = await prisma.notification.findFirst({
                  where: {
                    targetUserId: parentId,
                    type: "ALERT",
                    title: { contains: `Van for ${child.name}` },
                    createdAt: {
                      gte: new Date(
                        Date.now() - NOTIFICATION_COOLDOWN_MINUTES * 60 * 1000
                      ),
                    },
                  },
                });

                if (!recentNotif) {
                  await prisma.notification.create({
                    data: {
                      targetUserId: parentId,
                      title,
                      message,
                      type: "REMINDER",
                      createdAt : new Date()
                    },
                  });
                  console.log(`🔔 Alert created for ${child.name}`);
                } else {
                  console.log(`⏱️ Alert skipped for ${child.name} (recently notified)`);
                }
              }
            }
          }
        }

        return {
          ...session,
          firebaseData,
          etaMap, // minutes per student
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
