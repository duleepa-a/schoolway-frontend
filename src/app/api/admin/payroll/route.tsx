// /app/api/admin/payroll/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type GroupedPayroll = {
  id: number | string;
  monthYear: string;
  date: string;
  fullname?: string | null;
  role?: string | null;
  vanServiceName?: string | null;
  accountNo?: string | null;
  bank?: string | null;
  branch?: string | null;
  status?: string | null;
  totalAmount: number;
  recipientId: string;
  recipientRole: string;
  payrollCount: number; // Track how many payroll entries were summed
};

export async function GET() {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        Payment: true,
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });

    // console.log(`Total payroll records fetched: ${payrolls.length}`);

    const detailedRecords = await Promise.all(
      payrolls.map(async (p) => {
        const user = p.UserProfile;

        let accountNo = null;
        let bank = null;
        let branch = null;
        let vanServiceName = null;

        if (p.recipientRole === "SERVICE") {
          const van = await prisma.vanService.findUnique({
            where: { userId: p.recipientId },
            select: {
              serviceName: true,
              accountNo: true,
              bank: true,
              branch: true,
            },
          });
          if (van) {
            vanServiceName = van.serviceName;
            accountNo = van.accountNo;
            bank = van.bank;
            branch = van.branch;
          }
        }

        if (p.recipientRole === "DRIVER") {
          const driver = await prisma.driverProfile.findUnique({
            where: { userId: p.recipientId },
            select: {
              accountNo: true,
              bank: true,
              branch: true,
            },
          });
          const vanServiceUserId = p.Payment?.vanServiceId;
          let vanService = null;
          if (vanServiceUserId) {
            vanService = await prisma.vanService.findUnique({
              where: { userId: vanServiceUserId },
              select: {
                serviceName: true,
                accountNo: true,
                bank: true,
                branch: true,
              },
            });
          }
          if (driver) {
            accountNo = driver.accountNo;
            bank = driver.bank;
            branch = driver.branch;
          }

          if (vanService) {
            if (vanService.serviceName) vanServiceName = vanService.serviceName;
            accountNo = accountNo ?? vanService.accountNo ?? null;
            bank = bank ?? vanService.bank ?? null;
            branch = branch ?? vanService.branch ?? null;
          }
        }

        const createdDate = new Date(p.createdAt);
        const monthYear = createdDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });

        const payrollAmount = p.amount || 0;

        // console.log(
        //   `Payroll ID: ${p.id} | Recipient: ${p.recipientId} | RecipientRole: ${p.recipientRole} | Month: ${monthYear} | Amount: ${payrollAmount}`
        // );

        return {
          id: p.id,
          monthYear,
          date: p.createdAt.toISOString(),
          amount: payrollAmount,
          firstname: user?.firstname || null,
          lastname: user?.lastname || null,
          role: user?.role || null,
          vanServiceName,
          accountNo,
          bank,
          branch,
          status: p.payrollStatus || "PENDING",
          recipientId: p.recipientId,
          recipientRole: p.recipientRole,
        };
      })
    );

    // Group by month and recipient - sum all payments for each person/service per month
    const groupedData = Object.values(
      detailedRecords.reduce((acc, record) => {
        // Create unique key: "January 2024_user123"
        const key = `${record.monthYear}_${record.recipientId}`;

        if (!acc[key]) {
          // First payroll entry for this driver/service owner in this month
          // console.log(
          //   `\n[NEW] Creating entry for key: ${key} | Initial amount: ${record.amount}`
          // );
          acc[key] = {
            id: record.id,
            monthYear: record.monthYear,
            date: record.date,
            fullname: `${record.firstname || ""} ${
              record.lastname || ""
            }`.trim(),
            role: record.role,
            vanServiceName: record.vanServiceName,
            accountNo: record.accountNo,
            bank: record.bank,
            branch: record.branch,
            status: record.status,
            totalAmount: Number(record.amount.toFixed(2)), // Start with first payment
            recipientId: record.recipientId,
            recipientRole: record.recipientRole,
            payrollCount: 1, // First payroll entry
          };
        } else {
          // Additional payroll entry for same person in same month
          acc[key].totalAmount += record.amount;
          acc[key].payrollCount += 1;

          // console.log(
          //   `[ADD] Key: ${key} | Name: ${
          //     acc[key].fullname || acc[key].vanServiceName
          //   }`
          // );
          // console.log(
          //   `      Previous total: ${oldTotal} + New amount: ${record.amount} = New total: ${acc[key].totalAmount}`
          // );
          // console.log(`      Total payroll entries: ${acc[key].payrollCount}`);
        }

        return acc;
      }, {} as Record<string, GroupedPayroll>)
    );

    // groupedData.forEach((entry) => {
    //   console.log(
    //     `${entry.fullname || entry.vanServiceName} (${entry.recipientRole}) - ${
    //       entry.monthYear
    //     }: Rs. ${entry.totalAmount} (${entry.payrollCount} entries)`
    //   );
    // });
    console.log(`Total grouped payroll records: ${groupedData}`);
    return NextResponse.json(groupedData);
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    return NextResponse.json(
      { error: "Failed to fetch payroll data" },
      { status: 500 }
    );
  }
}
