import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Aggregate driver application statistics
    const driverTotal = await prisma.driverProfile.count();
    const driverPending = await prisma.driverProfile.count({ where: { status: 2 } });
    const driverApproved = await prisma.driverProfile.count({ where: { status: 1 } });
    const driverRejected = await prisma.driverProfile.count({ where: { status: { notIn: [1, 2] } } });

    // Aggregate van application statistics
    const vanTotal = await prisma.van.count();
    const vanPending = await prisma.van.count({ where: { status: 2 } });
    const vanApproved = await prisma.van.count({ where: { status: 1 } });
    const vanRejected = await prisma.van.count({ where: { status: { notIn: [1, 2] } } });

    // NOTE: The schema doesn't include an explicit 'resubmitted' flag or per-model updatedAt
    // fields that reliably indicate a resubmission. To avoid guessing, we return 0 for
    // resubmitted counts. If you want resubmitted counts, add an "updatedAt" to DriverProfile
    // and Van and/or a boolean like `isResubmitted`, then we can compute it here.
    const stats = {
      drivers: {
        total: driverTotal,
        pending: driverPending,
        approved: driverApproved,
        rejected: driverRejected,
        resubmitted: 0,
      },
      vans: {
        total: vanTotal,
        pending: vanPending,
        approved: vanApproved,
        rejected: vanRejected,
        resubmitted: 0,
      },
      // Driver overview - has vehicle vs no vehicle
      driverOverview: [
        { name: "Has vehicle", value: await prisma.driverProfile.count({ where: { hasVan: { gt: 0 } } }), color: "#FbbF24" },
        { name: "No Vehicle", value: await prisma.driverProfile.count({ where: { hasVan: 0 } }), color: "#1e3a8a" },
      ],
      // Rating distribution for drivers (from Review where reviewType = DRIVER)
      ratingDistribution: await (async () => {
        const rows = await prisma.review.groupBy({
          by: ["rating"],
          where: { reviewType: "DRIVER" },
          _count: { rating: true },
        });

        // build full distribution 1..5
        const dist = [5, 4, 3, 2, 1].map((r) => {
          const found = rows.find((row) => row.rating === r);
          return { rating: `${r} Stars`, count: found?._count?.rating ?? 0 };
        });
        return dist;
      })(),
      // Recent activity (combine recent driver apps, vans, and driver reviews)
      activityFeed: await (async () => {
        // latest driver applications
        const driverApps = await prisma.userProfile.findMany({
          where: { role: "DRIVER" },
          select: { id: true, firstname: true, lastname: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        const vanAdds = await prisma.van.findMany({
          select: { id: true, makeAndModel: true, createdAt: true, ownerId: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        const reviews = await prisma.review.findMany({
          where: { reviewType: "DRIVER" },
          select: { id: true, rating: true, comment: true, createdAt: true, targetId: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        type ActivityItem = {
          id: string;
          type: string;
          title: string;
          description: string;
          userName: string;
          userId: string;
          timestamp: string;
          status?: string;
        };

        const activities: ActivityItem[] = [];

        driverApps.forEach((d) => {
          activities.push({
            id: `driver-${d.id}`,
            type: "submitted",
            title: "New Driver Application",
            description: `${d.firstname || ""} ${d.lastname || ""} submitted a driver application`,
            userName: `${d.firstname || ""} ${d.lastname || ""}`.trim(),
            userId: d.id,
            timestamp: d.createdAt.toISOString(),
            status: "pending",
          });
        });

        vanAdds.forEach((v) => {
          activities.push({
            id: `van-${v.id}`,
            type: "vehicle",
            title: "Vehicle Registration Added",
            description: `${v.makeAndModel} was registered by owner ${v.ownerId}`,
            userName: v.ownerId,
            userId: v.ownerId,
            timestamp: v.createdAt.toISOString(),
            status: "review",
          });
        });

        reviews.forEach((r) => {
          activities.push({
            id: `review-${r.id}`,
            type: "accepted",
            title: "New Driver Review",
            description: r.comment || `Rated ${r.rating} stars`,
            userName: r.targetId,
            userId: r.targetId,
            timestamp: r.createdAt.toISOString(),
            status: "approved",
          });
        });

        // sort by timestamp desc and take top 8
        activities.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
        return activities.slice(0, 8);
      })(),
    };

    console.log("Fetched stats:", stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);

    return NextResponse.json([], { status: 500 });
  }
}
