import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, renderPayrollSettlementEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payrollId, month: monthParam, recipientId: recipientIdParam } = body;
    if (!payrollId)
      return NextResponse.json({ error: "payrollId required" }, { status: 400 });

    // Find the payroll and include the related Payment to get the month
    const payrollRecord = await prisma.payroll.findUnique({
      where: { id: Number(payrollId) },
      include: { Payment: true },
    });

    if (!payrollRecord)
      return NextResponse.json({ error: "Payroll not found" }, { status: 404 });

  const recipientId = recipientIdParam || payrollRecord.recipientId;
  const paymentMonth = monthParam || payrollRecord.Payment?.month;

    // If we have the payment month, update ALL payrolls for this recipient for that month
    // compute start/end for month range from paymentMonth (expected like 'October')
    let start: Date | null = null;
    let end: Date | null = null;
    if (paymentMonth) {
      try {
        const [monthName, yearStr] = String(paymentMonth).split(" ");
        const monthIdx = new Date(`${monthName} 1, ${yearStr}`).getMonth();
        const year = Number(yearStr);
        if (!Number.isNaN(monthIdx) && !Number.isNaN(year)) {
          start = new Date(Date.UTC(year, monthIdx, 1, 0, 0, 0));
          end = new Date(Date.UTC(year, monthIdx + 1, 1, 0, 0, 0));
        }
      } catch {
        // ignore invalid month parsing
      }
    }

    if (recipientId && start && end) {
      const updatedMany = await prisma.payroll.updateMany({
        where: {
          recipientId: recipientId,
          Payment: { is: { createdAt: { gte: start, lt: end } } },
        },
        data: { payrollStatus: "COMPLETED" },
      });

      // After marking payrolls complete, compose and send email with breakdown
      try {
        // Fetch payments for the period and recipient
  const baseWhere: Record<string, unknown> = { createdAt: { gte: start, lt: end } };
        // Determine recipient role from payrollRecord if present
        const recipientRole = String(payrollRecord.recipientRole || "");

        if (recipientRole.toUpperCase() === "DRIVER") {
          baseWhere.driverId = recipientId;
        } else if (recipientRole.toUpperCase() === "SERVICE") {
          baseWhere.vanServiceId = recipientId;
        }

        const payments = await prisma.payment.findMany({
          where: baseWhere,
          include: { Child: true },
        });

        // Build per-van and per-student breakdown
        type StudentBreakdown = {
          childId: string;
          name: string;
          amountPaid: number;
          systemFee: number;
          driverShare: number;
          ownerShare: number;
        };

        const vans: Record<number, { vanId: number; totalAmount: number; totalSystemFee: number; totalDriverShare: number; totalOwnerShare: number; students: Record<string, StudentBreakdown> }> = {};

        for (const p of payments) {
          const vanId = p.vanId;
          const childId = String(p.childId);
          const amount = Number(p.amount ?? 0);
          const systemFee = Number(p.systemFee ?? 0);
          const salaryPct = Number(p.salaryPercentageForDriver ?? 0);
          const driverShare = Number(((amount - systemFee) * salaryPct) / 100) || 0;
          const ownerShare = Number(amount - driverShare - systemFee) || 0;

          if (!vans[vanId]) {
            vans[vanId] = {
              vanId,
              totalAmount: 0,
              totalSystemFee: 0,
              totalDriverShare: 0,
              totalOwnerShare: 0,
              students: {},
            };
          }

          vans[vanId].totalAmount += amount;
          vans[vanId].totalSystemFee += systemFee;
          vans[vanId].totalDriverShare += driverShare;
          vans[vanId].totalOwnerShare += ownerShare;

          if (!vans[vanId].students[childId]) {
            vans[vanId].students[childId] = {
              childId,
              name: p.Child?.name || String(childId),
              amountPaid: 0,
              systemFee: 0,
              driverShare: 0,
              ownerShare: 0,
            };
          }

          vans[vanId].students[childId].amountPaid += amount;
          vans[vanId].students[childId].systemFee += systemFee;
          vans[vanId].students[childId].driverShare += driverShare;
          vans[vanId].students[childId].ownerShare += ownerShare;
        }

        // Resolve recipient contact info
        let toEmail = null;
        let recipientName = null;
        if (String(payrollRecord.recipientRole || "").toUpperCase() === "DRIVER") {
          const user = await prisma.userProfile.findUnique({ where: { id: recipientId } });
          toEmail = user?.email ?? null;
          recipientName = user ? [user.firstname, user.lastname].filter(Boolean).join(" ") : null;
        } else if (String(payrollRecord.recipientRole || "").toUpperCase() === "SERVICE") {
          const vs = await prisma.vanService.findUnique({ where: { id: recipientId } , include: { UserProfile: true } });
          toEmail = vs?.UserProfile?.email ?? null;
          recipientName = vs?.serviceName || vs?.UserProfile ? [vs?.UserProfile?.firstname, vs?.UserProfile?.lastname].filter(Boolean).join(" ") : null;
        }

        // Compose email HTML
        const perVanArray = Object.values(vans).map((v) => ({
          vanId: v.vanId,
          totalAmount: v.totalAmount,
          totalSystemFee: v.totalSystemFee,
          totalDriverShare: v.totalDriverShare,
          totalOwnerShare: v.totalOwnerShare,
          students: Object.values(v.students),
        }));

        const totalAcrossVans = perVanArray.reduce(
          (acc, v) => {
            acc.totalAmount += v.totalAmount;
            acc.totalSystemFee += v.totalSystemFee;
            acc.totalDriverShare += v.totalDriverShare;
            acc.totalOwnerShare += v.totalOwnerShare;
            return acc;
          },
          { totalAmount: 0, totalSystemFee: 0, totalDriverShare: 0, totalOwnerShare: 0 }
        );

        if (toEmail) {
          const monthLabel = paymentMonth || "";
          const html = renderPayrollSettlementEmail(
            recipientName || "",
            String(payrollRecord.recipientRole || ""),
            monthLabel,
            totalAcrossVans,
            perVanArray
          );

          await sendEmail({ to: toEmail, subject: `Payroll settled for ${monthLabel}`, html });
        }
      } catch (emailErr) {
        console.error("Failed to compute/send payroll email:", emailErr);
      }

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
