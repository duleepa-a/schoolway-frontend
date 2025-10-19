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

    // 🚐 Get driver's active EVENING_DROPOFF session
    const sessionData = await prisma.transportSession.findFirst({
      where: {
        driverId: params.driverId,
        routeType: "EVENING_DROPOFF",
        status: { in: ["ACTIVE", "PENDING"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        sessionStudents: {
          include: {
            child: {
              include: {
                School: { select: { id: true, schoolName: true } },
                Gate: true,
              },
            },
          },
        },
        van: {
          select: {
            registrationNumber: true,
            makeAndModel: true,
            photoUrl: true,
          },
        },
        driver: {
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
    const filteredStudents = sessionData.sessionStudents
      .filter((ss) => ss.child.schoolID === guardian.schoolId)
      .map((ss) => ({
        id: ss.child.id,
        name: ss.child.name,
        grade: ss.child.grade,
        gate: ss.child.Gate?.gateName || "N/A",
        pickupAddress: ss.child.pickupAddress,
        profilePicture: ss.child.profilePicture,
      }));

    return NextResponse.json({
      success: true,
      driver: sessionData.driver,
      van: sessionData.van,
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
