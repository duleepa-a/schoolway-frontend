import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    return NextResponse.json(childInfo);
  } catch (error) {
    console.error("Error fetching child info:", error);

    return NextResponse.json([], { status: 500 });
  }
}
