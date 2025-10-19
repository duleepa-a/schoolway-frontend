import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/routes/vans
// Returns a list of vans with owner info and the owner's van service.
export async function GET() {
  try {
    const vans = await prisma.van.findMany({
      include: {
        UserProfile: {
          include: { VanService: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(
      "Fetched vans:------------------------------------------------",
      vans
    );
    return NextResponse.json(vans);
  } catch (error) {
    console.error("Error fetching vans:", error);
    return NextResponse.json(
      { error: "Failed to fetch vans" },
      { status: 500 }
    );
  }
}
