import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { renderDriverRejectionEmail, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { userId, reason } = await req.json();

    const updated = await prisma.driverProfile.update({
      where: { userId: userId },
      data: {
        status: 0,
      },
    });

    // Fetch user profile to get email and first name
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      select: { email: true, firstname: true },
    });

    if (user?.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: "Update on your driver application",
          html: renderDriverRejectionEmail(user.firstname ?? "there", reason),
        });
      } catch (emailErr) {
        console.error("Failed to send rejection email:", emailErr);
        // Do not fail the API because of email issues
      }
    }

    return NextResponse.json({
      message: "Driver marked as inactive (rejected)",
      user: updated,
    });
  } catch (error) {
    console.error("Error rejecting driver:", error);
    return NextResponse.json(
      { error: "Error rejecting driver" },
      { status: 500 }
    );
  }
}
