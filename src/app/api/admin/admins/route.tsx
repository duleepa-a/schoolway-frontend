import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as bcryptjs from "bcryptjs";

interface AdminRequestBody {
  firstname: string;
  lastname: string;
  email: string;
  contact?: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AdminRequestBody = await req.json();
    const { firstname, lastname, email, contact, password } = body;
    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if admin already exists in UserProfile
    const existingAdmin = await prisma.userProfile.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash("admin", 10);

    // Create admin in UserProfile
    const newAdmin = await prisma.userProfile.create({
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
        role: "ADMIN",
        mobile: contact,
      },
    });

    // Return created admin (omit password)
    const { password: _pw, ...adminData } = newAdmin;
    return NextResponse.json(adminData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create admin", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admins = await prisma.userProfile.findMany({
      where: { role: "ADMIN" },
      select: {
        email: true,
        firstname: true,
        lastname: true,
        activeStatus: true,
      },
    });
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admins", details: error?.message },
      { status: 500 }
    );
  }
}
