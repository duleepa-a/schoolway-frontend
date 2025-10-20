import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        UserProfile: true,
        Child: true,
        Van: true,
      },
    });

    // Map to frontend-friendly shape
    const data = payments.map((p) => ({
      PaymentID: p.id.toString(),
      ParentID: p.parentId,
      FullName: p.UserProfile ? `${p.UserProfile.firstname || ""} ${p.UserProfile.lastname || ""}`.trim() : "",
      VanID: p.vanId?.toString() ?? "",
      Date: p.createdAt ? p.createdAt.toISOString() : null,
      Status: p.status,
      Amount: p.amount,
      Month: p.month,
      PaidAt: p.paidAt ? p.paidAt.toISOString() : null,
      PaymentType: p.paymentType,
      ChildId: p.childId,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching paymentdata:", error);

    return NextResponse.json([], { status: 500 });
  }
}
