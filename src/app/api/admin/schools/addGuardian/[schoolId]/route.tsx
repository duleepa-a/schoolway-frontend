import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as bcryptjs from "bcryptjs";

interface GuardianRequestBody {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  password: string;
}

export async function POST(req: NextRequest, 
  { params }: { params: Promise<{ schoolId: string }> }) {
  try {
    const resolvedParams = await params;
    const schoolId = parseInt(resolvedParams.schoolId);
    const body = await req.json();
    const { firstname, lastname, email, phone, password } = body as GuardianRequestBody;

    // Validate required fields
    if (!email || !firstname || !lastname || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUser = await prisma.userProfile.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Get school by ID from URL parameter
    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!school) {
      return NextResponse.json(
        { message: "School not found with the given ID" },
        { status: 404 }
      );
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash('guardian', 10);

    // Create user with Guardian role
    const newUser = await prisma.userProfile.create({
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
        // Use a valid role that's closest to GUARDIAN since it's not in schema yet
        role: "TEACHER", // Using PARENT as the closest role until GUARDIAN is added to schema
        mobile: phone || null,
      },
    });

    // Create relationship between guardian and school
    await prisma.schoolGuardian.create({
      data: {
        schoolId: schoolId,
        guardianId: newUser.id,
        email: email,
        firstName: firstname,
        lastName: lastname,
        phone: phone || null,
      },
    });

    // Return success response with created guardian data
    return NextResponse.json({
      message: "Guardian created successfully",
      guardian: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        schoolName: school.schoolName,
        phone: newUser.mobile,
        activeStatus: newUser.activeStatus,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating guardian:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

