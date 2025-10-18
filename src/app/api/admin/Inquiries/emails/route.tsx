import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { resolveMetadata } from "next/dist/lib/metadata/resolve-metadata";

export async function POST(req: NextRequest) {
  try {
    const { InquiryID, subject, body } = await req.json();

    if (!InquiryID || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // find the inquiry
    const inquiry = await prisma.contactUs.findUnique({
      where: { id: Number(InquiryID) },
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // send email
    await sendEmail({
      to: inquiry.email,
      subject,
      html: `<div>${body.replaceAll("\n", "<br/>")}</div>`,
    });

    // update status
    const updated = await prisma.contactUs.update({
      where: { id: Number(InquiryID) },
      data: { status: "Reviewed" },
    });

    return NextResponse.json({ message: "Inquiry resolved", inquiry: updated });
  } catch (error) {
    console.error("Error approving inquiry:", error);
    return NextResponse.json(
      { error: "Error approving inquiry" },
      { status: 500 }
    );
  }
}
