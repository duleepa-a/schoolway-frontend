import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function monthNameToIndex(name: string) {
  if (!name) return null;
  const map: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  return map[name.toLowerCase()] ?? null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipientId = searchParams.get("recipientId");
    const recipientRole = searchParams.get("recipientRole");
    const monthName = searchParams.get("month"); // e.g., "October"
    const yearStr = searchParams.get("year"); // e.g., "2025"

    if (!recipientId || !recipientRole || !monthName || !yearStr) {
      return NextResponse.json({ error: "missing params" }, { status: 400 });
    }

    const monthIndex = monthNameToIndex(monthName);
    const year = Number(yearStr);
    if (monthIndex === null || Number.isNaN(year)) {
      return NextResponse.json(
        { error: "invalid month/year" },
        { status: 400 }
      );
    }

    const start = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0));

    // Build where clause depending on role
    const baseWhere: Record<string, unknown> = {
      createdAt: { gte: start, lt: end },
    };

    if (recipientRole.toUpperCase() === "DRIVER") {
      baseWhere.driverId = recipientId;
    } else if (recipientRole.toUpperCase() === "SERVICE") {
      baseWhere.vanServiceId = recipientId;
    } else {
      return NextResponse.json(
        { error: "unsupported recipientRole" },
        { status: 400 }
      );
    }

    // Fetch payments for that period and recipient
    const payments = await prisma.payment.findMany({
      where: baseWhere,
      include: { Child: true },
    });

    // Group by child and compute sums: total amount, total systemFee, total driverShare, total ownerShare
    const grouped: Record<
      string,
      {
        childId: number;
        name: string;
        amountPaid: number;
        totalSystemFee: number;
        totalDriverShare: number;
        totalOwnerShare: number;
        payments: {
          id: number;
          amount: number;
          systemFee: number;
          salaryPercentageForDriver: number | null;
          driverShare: number;
          ownerShare: number;
          parentId: string;
        }[];
      }
    > = {};

    for (const p of payments) {
      const childId = p.childId;
      const name = p.Child?.name || String(childId);

      // numeric guards
      const amount = Number(p.amount ?? 0);
      const systemFee = Number(p.systemFee ?? 0);
      const salaryPct = Number(p.salaryPercentageForDriver ?? 0);

      // driver share is percentage of amount (salaryPercentageForDriver is stored as 0-100)
      const driverShare = Number(((amount - systemFee) * salaryPct) / 100) || 0;
      // owner/service share is what's left after driver share and system fee
      const ownerShare = Number(amount - driverShare - systemFee) || 0;

      if (!grouped[childId]) {
        grouped[childId] = {
          childId,
          name,
          amountPaid: 0,
          totalSystemFee: 0,
          totalDriverShare: 0,
          totalOwnerShare: 0,
          payments: [],
        };
      }

      grouped[childId].amountPaid += amount;
      grouped[childId].totalSystemFee += systemFee;
      grouped[childId].totalDriverShare += driverShare;
      grouped[childId].totalOwnerShare += ownerShare;

      grouped[childId].payments.push({
        id: p.id,
        amount,
        systemFee,
        salaryPercentageForDriver: p.salaryPercentageForDriver ?? null,
        driverShare,
        ownerShare,
        parentId: p.parentId,
      });
    }

    // Prepare students array; include the allocation amount relevant to the requested recipientRole
    const students = Object.values(grouped).map((s) => ({
      childId: s.childId,
      name: s.name,
      amountPaid: s.amountPaid,
      totalSystemFee: s.totalSystemFee,
      totalDriverShare: s.totalDriverShare,
      totalOwnerShare: s.totalOwnerShare,
      // allocation for the payroll recipient: if recipientRole is DRIVER => driver share, if SERVICE => owner share
      allocatedToRecipient:
        recipientRole.toUpperCase() === "DRIVER"
          ? s.totalDriverShare
          : s.totalOwnerShare,
      payments: s.payments,
    }));

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Error fetching child info:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
