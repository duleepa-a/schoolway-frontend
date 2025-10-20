import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/routes/vans/:id/sessions?date=YYYY-MM-DD
// Returns TransportSession records for the provided van id and date (if given).
// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   const { id } = params;
export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  const { id } = await params; // ✅ correct
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");

    const where: any = { vanId: Number(id) };

    if (dateParam) {
      // match sessionDate within the day (UTC). Adjust if you want local timezone.
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        const start = new Date(parsed);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(parsed);
        end.setUTCHours(23, 59, 59, 999);
        where.sessionDate = { gte: start, lte: end };
      }
    }

    const sessions = await prisma.transportSession.findMany({
      where,
      include: {
        sessionStudents: { include: { child: true } },
        driver: true,
      },
      orderBy: { startedAt: "asc" },
    });

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions for van", id, error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}
