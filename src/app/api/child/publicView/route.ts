import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const child = await prisma.child.findUnique({
      where: { id: parseInt(resolvedParams.id) },
      select: {
        id: true,
        name: true,
        age: true,
        grade: true,
        profilePicture: true,
        schoolStartTime: true,
        schoolEndTime: true,
        pickupAddress: true,
        specialNotes: true,
        School: {
          select: { schoolName: true },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    return NextResponse.json(child);
  } catch (error) {
    console.error("Error fetching child:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
