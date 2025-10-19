import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface Params {
  id: string[];
}

type RouteType = "MORNING_PICKUP" | "EVENING_DROPOFF";

export async function GET(req: NextRequest, { params }: { params: Params }) {
 
  const driverId = params.id?.[0];

  console.log("Dashboard API called for driver ID:", driverId);

  if (!driverId) {
    return NextResponse.json(
      { success: false, message: "Missing driver ID" },
      { status: 400 }
    );
  }

  try {


     const driver = await prisma.userProfile.findUnique({
      where: { id: driverId },
      include: {
        Van_Van_assignedDriverIdToUserProfile: true,
      },
    });
    console.log("Driver fetched for dashboard:", driverId);

    if (!driver) {
      return NextResponse.json(
        { success: false, error: 'Driver not found' },
        { status: 404 }
      );
    }

    const vanList = driver.Van_Van_assignedDriverIdToUserProfile ?? [];

    if (vanList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Driver has no assigned van' },
        { status: 404 }
      );
    }

    const van = vanList[0];

    const now = new Date();
    const currentHour = now.getHours();
    const routeType: RouteType = currentHour < 10 ? 'MORNING_PICKUP' : 'EVENING_DROPOFF';

    // Check if session already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayDate = today.toISOString().split('T')[0];

    const children = await prisma.child.findMany({
      where: {
        vanID: van.id,
        status: {
          in: ['ON_VAN', 'AT_HOME', 'AT_SCHOOL']
        },
        NOT: {
          attendance : {
            some: {
              absenceDate: new Date(todayDate),
              routeType: {
                in: [routeType, 'BOTH'],
              },
            },
          },
        },
      },
    });

    // --- 3️⃣ Vehicle info ---
    const vehicle = {
      model: van?.makeAndModel || "Unknown vehicle",
      license: van?.licensePlateNumber || "N/A",
      status: van?.status === 1 ? "ACTIVE" : van?.status === 0 ? "PENDING" : "UNKNOWN",
    };

    const plan = {
      route: "Kalutara - Colombo 13", // You can compute dynamically if you have path data
      pickupCount: children.length,
    };

    // --- 4️⃣ Recent activity (mock or from completed sessions) ---
    const recentSessions = await prisma.transportSession.findMany({
      where: {
        driverId,
        status: "COMPLETED",
      },
      orderBy: { endedAt: "desc" },
      take: 3,
    });

    let hasSessionDue = true;

    const createdAt = new Date(recentSessions[0].createdAt);

    if (
      recentSessions[0].routeType === routeType &&
      recentSessions[0].status === "COMPLETED" &&
      createdAt.getDate() === now.getDate() &&
      createdAt.getMonth() === now.getMonth() &&
      createdAt.getFullYear() === now.getFullYear()
    ) {
      console.log("now date", now.getDate());
      console.log("recent date", createdAt.getDate());
      hasSessionDue = false;
    }

    const recentActivity = recentSessions.map((s) => ({
      time: s.endedAt ?? s.startedAt ?? s.createdAt,
      description:
        s.routeType === "MORNING_PICKUP"
          ? "Morning pickup completed"
          : s.routeType === "EVENING_DROPOFF"
          ? "Evening drop-off completed"
          : "Trip completed",
    }));

    // Add a sample if none exist
    if (recentActivity.length === 0) {
      recentActivity.push(
        {
          time: new Date(),
          description: "School drop-off completed",
        },
        {
          time: new Date(Date.now() - 45 * 60 * 1000),
          description: "Started morning route",
        },
        {
          time: new Date(Date.now() - 24 * 60 * 60 * 1000),
          description: "Evening drop-off completed",
        }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
      vehicle,
      recentActivity,
      hasSessionDue,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
