import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { vanID } = await req.json();

    const updated = await prisma.van.update({
      where: { id: vanID },
      data: {
        status: 1, // Assuming 1 represents approval
      },
    });

    const user = await prisma.van.findUnique({
      where: { id: vanID },
      select: {
        UserProfile: {
          select: {
            email: true,
            firstname: true,
          },
        },
      },
    });

    // Send approval email
    await sendEmail({
      to: user.UserProfile.email,
      subject: "Van Application Approved",
      html: `<p>Dear ${user.UserProfile.firstname || "Applicant"},</p>
             <p>Congratulations! Your van application has been approved.</p>
             <p>Thank you,</p>
             <p>SchoolWay Team</p>`,
    });

    return NextResponse.json({ message: "Van approved", van: updated });
  } catch (error) {
    console.error("Error approving van:", error);
    return NextResponse.json({ error: "Error approving van" }, { status: 500 });
  }
}
