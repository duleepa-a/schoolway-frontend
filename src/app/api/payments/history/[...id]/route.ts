import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { parentId: string } }
) {
  const { parentId } = params;

  try {
    const history = await prisma.payment.findMany({
      where: { parentId },
      orderBy: { createdAt: "desc" },
      include: {
        Child: { select: { name: true } },
        Van: { select: { makeAndModel: true } },
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 });
  }
}
