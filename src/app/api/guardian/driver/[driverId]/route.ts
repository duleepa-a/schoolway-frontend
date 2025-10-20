import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path as needed

export async function GET(req: Request, { params }: { params: { driverId: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const guardianId = session.user.id;
    const guardian = await prisma.schoolGuardian.findUnique({
      where: { guardianId },
      select: { schoolId: true },
    });

    if (!guardian) {
      return NextResponse.json({ success: false, message: "Guardian not found" }, { status: 404 });
    }

    // 🚐 Get driver's active EVENING_DROPOFF session : for demo lehan put all route types
    const sessionData = await prisma.transportSession.findFirst({
      where: {
        driverId: params.driverId,
        routeType: { in: ["MORNING_PICKUP", "EVENING_DROPOFF", "BOTH"] },
        status: { in: ["ACTIVE", "PENDING"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        SessionStudent: {
          include: {
            Child: {
              include: {
                School: {
                  select: {
                    id: true,
                    schoolName: true,
                  },
                },
                Gate: true,
              },
            },
          },
        },
        Van: {
          select: {
            registrationNumber: true,
            makeAndModel: true,
            photoUrl: true,
          },
        },
        UserProfile: {
          select: {
            firstname: true,
            lastname: true,
            dp: true,
          },
        },
      },
    });

    if (!sessionData) {
      return NextResponse.json({
        success: true,
        message: "No active evening session found for this driver.",
        students: [],
      });
    }

    // 🎯 Filter children belonging to guardian's school
    const filteredStudents = sessionData.SessionStudent.filter(
      (ss) => ss.Child.schoolID === guardian.schoolId
    ).map((ss) => ({
      id: ss.Child.id,
      name: ss.Child.name,
      grade: ss.Child.grade,
      gate: ss.Child.Gate?.gateName || "N/A",
      pickupAddress: ss.Child.pickupAddress,
      profilePicture: ss.Child.profilePicture,
    }));
    console.log("✅ Fetched driver info successfully.", sessionData);
    return NextResponse.json({
      success: true,
      driver: sessionData.UserProfile,
      van: sessionData.Van,
      students: filteredStudents,
    });
  } catch (error) {
    console.error("❌ Error fetching driver info:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
