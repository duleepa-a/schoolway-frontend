import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const vans = await prisma.van.findMany({
      include: {
        UserProfile: {
          include: {
            vanService: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(vans);
    return NextResponse.json(vans);
  } catch (error) {
    console.error("Error fetching vans:", error);
    return NextResponse.json([], { status: 500 });
  }
}
