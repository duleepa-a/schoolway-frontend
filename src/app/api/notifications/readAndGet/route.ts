import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // your Prisma client

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Fetch notifications
    const notifications = await prisma.notification.findMany({
      where: {
        targetUserId: userId,
        read: unreadOnly === "true" ? false : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mark fetched notifications as read
    await prisma.notification.updateMany({
      where: {
        targetUserId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}