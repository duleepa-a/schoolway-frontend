import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; sessionId: string } }
) {
  try {
    const { sessionId } = params;

    // fetch session details from TransportSession
    const session = await prisma.transportSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const sessionStudents = await prisma.sessionStudent.findMany({
      where: {
        sessionId: sessionId,
      },
      include: {
        child: {
          include: {
            School: true,
          },
        },
      },
      orderBy: {
        pickupOrder: "asc",
      },
    });

    // Format the students response
    const formattedStudents = sessionStudents.map((student) => ({
      id: student.id,
      name: student.child?.name ?? null,
      age: student.child?.age ?? null,
      grade: student.child?.grade ?? "N/A",
      school: student.child?.School?.schoolName ?? "N/A",
      pickupStatus: student.pickupStatus,
      pickedUpAt: student.pickedUpAt ? student.pickedUpAt.toISOString() : null,
      droppedOffAt: student.droppedOffAt
        ? student.droppedOffAt.toISOString()
        : null,
      estimatedPickup: student.estimatedPickup
        ? student.estimatedPickup.toISOString()
        : null,
    }));

    // Format the session (convert date fields to ISO)
    const formattedSession = {
      id: session.id,
      vanId: session.vanId,
      driverId: session.driverId,
      routeType: session.routeType,
      sessionDate: session.sessionDate ? session.sessionDate.toISOString() : null,
      startedAt: session.startedAt ? session.startedAt.toISOString() : null,
      endedAt: session.endedAt ? session.endedAt.toISOString() : null,
      status: session.status,
      totalDistance: session.totalDistance ?? null,
      totalDuration: session.totalDuration ?? null,
      firebaseSessionId: session.firebaseSessionId ?? null,
      createdAt: session.createdAt ? session.createdAt.toISOString() : null,
      updatedAt: session.updatedAt ? session.updatedAt.toISOString() : null,
    };

    return NextResponse.json({ session: formattedSession, students: formattedStudents });
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
