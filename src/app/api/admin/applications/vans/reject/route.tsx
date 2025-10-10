import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { vanID, reason } = await req.json();
    console.log(
      "vanID:ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp",
      vanID
    );

    const updated = await prisma.van.update({
      where: { id: vanID },
      data: {
        status: 0, // Assuming 0 represents rejection
      },
    });
    console.log(
      "updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed",
      updated
    );
    // Fetch user profile to get email and first name
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
    console.log(
      "userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",
      user
    );

    // Send rejection email
    await sendEmail({
      to: user.UserProfile.email,
      subject: "Van Application Rejected",
      html: `<p>Dear ${user.UserProfile.firstname || "Applicant"},</p>
             <p>Your van application has been rejected.</p>
             ${reason ? `<p>Reason: ${reason}</p>` : ""}
             <p>Thank you,</p>
             <p>SchoolWay Team</p>`,
    });

    return NextResponse.json({
      message: "Van marked as inactive (rejected)",
      user: updated,
    });
  } catch (error) {
    console.error("Error rejecting van:", error);
    return NextResponse.json({ error: "Error rejecting van" }, { status: 500 });
  }
}
