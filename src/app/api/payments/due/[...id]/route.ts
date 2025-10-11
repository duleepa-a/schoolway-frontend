import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { parentId: string } }
) {
  const { parentId } = params;

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch all pending payments (regardless of month)
    const pendingPayments = await prisma.payment.findMany({
      where: {
        parentId,
        status: "PENDING",
      },
      include: {
        child: {
          select: { name: true, grade: true, feeAmount: true },
        },
        van: {
          select: { makeAndModel: true, registrationNumber: true },
        },
      },
      orderBy: { createdAt: "asc" }, // oldest pending first
    });

    // Fetch all payments in the current month (regardless of status)
    const currentMonthPayments = await prisma.payment.findMany({
      where: {
        parentId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        child: {
          select: { name: true, grade: true, feeAmount: true },
        },
        van: {
          select: { makeAndModel: true, registrationNumber: true },
        },
      },
      orderBy: { createdAt: "desc" }, // latest first
    });

    // Merge arrays and remove duplicates (in case a payment is both pending and this month)
    const mergedPaymentsMap = new Map<string, typeof pendingPayments[0]>();
    [...pendingPayments, ...currentMonthPayments].forEach(payment => {
      mergedPaymentsMap.set(payment.id.toString(), payment);
    });

    const mergedPayments = Array.from(mergedPaymentsMap.values());

    return NextResponse.json(mergedPayments);
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
