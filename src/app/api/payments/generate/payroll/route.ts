import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SYSTEM_FEE_PERCENT = 5;

export async function POST() {
  try {
    const payments = await prisma.payment.findMany({
      where: { month: new Date().toLocaleString("default", { month: "long", year: "numeric" }) },
      include: {
        child: true,
      },
    });

    const payrolls: Array<{
      paymentId: number;
      recipientId: string;
      recipientRole: 'DRIVER' | 'SERVICE';
      amount: number;
    }> = [];

    for (const payment of payments) {
      if (payment.status !== "PAID") {
        await prisma.child.update({
          where: { id: payment.childId },
          data: { status: "INACTIVE" },
        });
        continue; // skip payroll creation for unpaid
      }

      // 3. Paid payments -> calculate payrolls
      const systemFee = (SYSTEM_FEE_PERCENT / 100) * payment.amount;
      const remaining = payment.amount - systemFee;

      // Driver share
      const driverShare = (payment.salaryPercentageForDriver / 100) * remaining;
      const ownerShare = remaining - driverShare;

      // 4. Create Payroll records
      if (payment.driverId) {
        payrolls.push({
          paymentId: payment.id,
          recipientId: payment.driverId,
          recipientRole: 'DRIVER',
          amount: driverShare,
        });
      }

      if (payment.vanServiceId) {
        payrolls.push({
          paymentId: payment.id,
          recipientId: payment.vanServiceId,
          recipientRole: 'SERVICE',
          amount: ownerShare,
        });
      }
      }

      await prisma.payroll.createMany({
        data: payrolls,
      });

    return NextResponse.json({ message: "✅ Monthly payment processing completed." });
  } catch (error) {
    console.error("Error processing monthly payments:", error);
    return NextResponse.json({ error: "Failed to process payments" }, { status: 500 });
  }
}
