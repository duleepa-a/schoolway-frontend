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

    // // Mark fetched notifications as read
    // await prisma.notification.updateMany({
    //   where: {
    //     targetUserId: userId,
    //     read: false,
    //   },
    //   data: {
    //     read: true,
    //   },
    // });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, message, type, targetUserId } = body;

    if (!title || !message || !type) {
      return NextResponse.json(
        { error: "Title, message, and type are required." },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        targetUserId: targetUserId || null,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
