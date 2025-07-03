import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db"; // adjust the import path if needed

export async function GET(request: NextRequest) {
    try {
        const users = await sql`SELECT * FROM van_services`;
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}