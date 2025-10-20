import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type Body = {
  userId: string; // id of the user (UserProfile.id or VanService.userId)
  role: string; // expected values: 'DRIVER' | 'SERVICE' (from UserRole enum)
  accountNo?: string | null;
  bank?: string | null;
  branch?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;

    if (!body || !body.userId || !body.role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { userId, role, accountNo = null, bank = null, branch = null } = body;

    // Determine target table based on role
    // DRIVER -> DriverProfile (userId maps to UserProfile.id)
    // SERVICE -> VanService (userId maps to VanService.userId)

    let updated: unknown = null;

    if (role.toUpperCase() === "DRIVER") {
      // Update DriverProfile for this user
      updated = await prisma.driverProfile.update({
        where: { userId },
        data: {
          accountNo,
          bank,
          branch,
        },
      });
    } else if (role.toUpperCase() === "SERVICE") {
      // Update VanService for this user
      updated = await prisma.vanService.update({
        where: { userId },
        data: {
          accountNo,
          bank,
          branch,
        },
      });
    } else {
      return NextResponse.json({ error: "Unsupported role" }, { status: 400 });
    }

    return NextResponse.json({
      message: "Bank Details updated",
      data: updated,
    });
  } catch (err) {
    const error = err as { code?: string; message?: string } | Error;
    console.error("Error updating bank details:", error);

    // Prisma "record not found" error code is P2025
    const errObj = error as Record<string, unknown>;
    if (typeof errObj.code === "string" && errObj.code === "P2025") {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Error updating bank details" },
      { status: 500 }
    );
  }
}
