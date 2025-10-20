import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
	try {
		const [driversCount, vanOwnersCount, parentsCount, childrenCount] = await Promise.all([
			prisma.userProfile.count({ where: { role: "DRIVER" } }),
			prisma.userProfile.count({ where: { role: "SERVICE" } }),
			prisma.userProfile.count({ where: { role: "PARENT" } }),
			prisma.child.count(),
		]);

		// Total revenue (sum of systemFee across all payments)
		const totalRevenueAgg = await prisma.payment.aggregate({ _sum: { systemFee: true } });
		const totalRevenue = Number(totalRevenueAgg._sum.systemFee ?? 0);

		// Monthly revenue grouped by Payment.month
		const grouped = await prisma.payment.groupBy({
			by: ["month"],
			_sum: { systemFee: true },
		});

		const chartData = grouped
			.map((g) => ({ month: g.month ?? "", earnings: Number(g._sum.systemFee ?? 0) }))
			.sort((a, b) => new Date(a.month + " 1").getTime() - new Date(b.month + " 1").getTime());

		return NextResponse.json({
			driversCount,
			vanOwnersCount,
			parentsCount,
			childrenCount,
			totalRevenue,
			chartData,
		});
	} catch (error) {
		console.error("Error in dashboard route:", error);
		return NextResponse.json({ error: String(error) }, { status: 500 });
	}
}
