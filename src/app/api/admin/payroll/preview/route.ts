import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { renderPayrollSettlementEmail } from "@/lib/email";

function parseMonthYear(input?: string | null) {
  if (!input) return null;
  const parts = String(input).split(" ");
  if (parts.length < 2) return null;
  const [monthName, yearStr] = parts;
  const monthIdx = new Date(`${monthName} 1, ${yearStr}`).getMonth();
  const year = Number(yearStr);
  if (Number.isNaN(monthIdx) || Number.isNaN(year)) return null;
  const start = new Date(Date.UTC(year, monthIdx, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, monthIdx + 1, 1, 0, 0, 0));
  return { start, end, monthLabel: `${monthName} ${yearStr}` };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payrollId, month: monthParam, recipientId: recipientIdParam } = body;
    if (!payrollId) return NextResponse.json({ error: "payrollId required" }, { status: 400 });

    const payrollRecord = await prisma.payroll.findUnique({ where: { id: Number(payrollId) }, include: { Payment: true } });
    if (!payrollRecord) return NextResponse.json({ error: "Payroll not found" }, { status: 404 });

    const recipientId = recipientIdParam || payrollRecord.recipientId;
    const paymentMonth = monthParam || payrollRecord.Payment?.month;

    const parsed = parseMonthYear(paymentMonth);
    if (!recipientId || !parsed) return NextResponse.json({ error: "missing month/recipient info" }, { status: 400 });

    const { start, end, monthLabel } = parsed;

  const baseWhere: Record<string, unknown> = { createdAt: { gte: start, lt: end } };
    const recipientRole = String(payrollRecord.recipientRole || "");
    if (recipientRole.toUpperCase() === "DRIVER") baseWhere.driverId = recipientId;
    else if (recipientRole.toUpperCase() === "SERVICE") baseWhere.vanServiceId = recipientId;

    const payments = await prisma.payment.findMany({ where: baseWhere, include: { Child: true } });

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
        vans[vanId] = { vanId, totalAmount: 0, totalSystemFee: 0, totalDriverShare: 0, totalOwnerShare: 0, students: {} };
      }

      vans[vanId].totalAmount += amount;
      vans[vanId].totalSystemFee += systemFee;
      vans[vanId].totalDriverShare += driverShare;
      vans[vanId].totalOwnerShare += ownerShare;

      if (!vans[vanId].students[childId]) {
        vans[vanId].students[childId] = { childId, name: p.Child?.name || String(childId), amountPaid: 0, systemFee: 0, driverShare: 0, ownerShare: 0 };
      }

      vans[vanId].students[childId].amountPaid += amount;
      vans[vanId].students[childId].systemFee += systemFee;
      vans[vanId].students[childId].driverShare += driverShare;
      vans[vanId].students[childId].ownerShare += ownerShare;
    }

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

    // Resolve recipient name
    let recipientName = "";
    if (recipientRole.toUpperCase() === "DRIVER") {
      const user = await prisma.userProfile.findUnique({ where: { id: recipientId } });
      recipientName = user ? [user.firstname, user.lastname].filter(Boolean).join(" ") : "";
    } else if (recipientRole.toUpperCase() === "SERVICE") {
      const vs = await prisma.vanService.findUnique({ where: { id: recipientId }, include: { UserProfile: true } });
      recipientName = vs?.serviceName || vs?.UserProfile ? [vs?.UserProfile?.firstname, vs?.UserProfile?.lastname].filter(Boolean).join(" ") : "";
    }

    const html = renderPayrollSettlementEmail(recipientName || "", String(payrollRecord.recipientRole || ""), monthLabel, totalAcrossVans, perVanArray);

    return NextResponse.json({ html });
  } catch (error) {
    console.error("Payroll preview error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
