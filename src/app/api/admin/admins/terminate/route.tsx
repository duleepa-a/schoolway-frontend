import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const user = await prisma.userProfile.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updated = await prisma.userProfile.update({
      where: { email },
      data: { activeStatus: false },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("terminate admin error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
