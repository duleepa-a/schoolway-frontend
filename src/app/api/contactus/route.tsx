import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    if (session) {
      // Logged-in user - only need Type, subject, message
      const { Type, subject, message } = body;

      if (!Type || !subject || !message) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const newContactUs = await prisma.contactUs.create({
        data: {
          name: session.user.name || "",
          email: session.user.email || "",
          subject,
          message,
          userType: session.user.role
            ? session.user.role.charAt(0).toUpperCase() +
              session.user.role.slice(1).toLowerCase()
            : "User",
          Type,
          userId: session.user.id,
          status: "Pending",
        },
      });

      return NextResponse.json(
        { message: "Inquiry submitted", contactMessage: newContactUs },
        { status: 201 }
      );
    } else {
      // Non-logged-in user - need all fields
      const { name, email, subject, message, userType, Type } = body;

      if (!name || !email || !subject || !message || !userType || !Type) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const newContactUs = await prisma.contactUs.create({
        data: {
          name,
          email,
          subject,
          message,
          userType,
          Type,
          userId: null, // Empty for non-logged-in users
          status: "Pending",
        },
      });

      return NextResponse.json(
        { message: "Inquiry submitted", contactMessage: newContactUs },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[CONTACT_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
