import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payrollId } = body;
    if (!payrollId)
      return NextResponse.json(
        { error: "payrollId required" },
        { status: 400 }
      );

    // Find the payroll and include the related Payment to get the month
    const payrollRecord = await prisma.payroll.findUnique({
      where: { id: Number(payrollId) },
      include: { Payment: true },
    });

    if (!payrollRecord)
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });

    const recipientId = payrollRecord.recipientId;
    const paymentMonth = payrollRecord.Payment?.month;

    // If we have the payment month, update ALL payrolls for this recipient for that month
    if (recipientId && paymentMonth) {
      const updatedMany = await prisma.payroll.updateMany({
        where: {
          recipientId: recipientId,
          Payment: { is: { month: paymentMonth } },
        },
        data: { payrollStatus: "COMPLETED" },
      });

      return NextResponse.json({ success: true, updatedCount: updatedMany.count });
    }

    // Fallback: update the single payroll if month/recipient info is missing
    const updated = await prisma.payroll.update({
      where: { id: Number(payrollId) },
      data: { payrollStatus: "COMPLETED" },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Settle payroll error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
