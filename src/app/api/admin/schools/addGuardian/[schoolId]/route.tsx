import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as bcryptjs from "bcryptjs";

interface GuardianRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  nic: string;
  password: string;
}

export async function POST(req: NextRequest, 
  { params }: { params: Promise<{ schoolId: string }> }) {
  try {
    const resolvedParams = await params;
    const schoolId = parseInt(resolvedParams.schoolId);
    const body = await req.json();
    console.log('Received guardian data:', body);
    console.log('School ID:', schoolId);
    const { firstName, lastName, email, phone, nic, password } = body as GuardianRequestBody;

    // Validate required fields
    if (!email || !firstName || !lastName || !password || !nic) {
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
      // If email exists, generate an alternative with a number
      let counter = 1;
      let newEmail = email;
      let emailExists = true;
      
      while (emailExists) {
        const baseEmail = email.replace('@', `${counter}@`);
        const existingUserCheck = await prisma.userProfile.findUnique({
          where: { email: baseEmail },
        });
        
        if (!existingUserCheck) {
          newEmail = baseEmail;
          emailExists = false;
        } else {
          counter++;
        }
      }
      
      return NextResponse.json(
        { 
          message: "User with this email already exists",
          suggestedEmail: newEmail,
          error: "EMAIL_EXISTS"
        },
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

    // Hash the password using consistent salt rounds (12) as used in other parts of the application
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user with TEACHER role
    const newUser = await prisma.userProfile.create({
      data: {
        id: `guardian_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        firstname: firstName,
        lastname: lastName,
        password: hashedPassword,
        role: "TEACHER",
        mobile: phone || null,
        nic: nic,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Create relationship between guardian and school
    await prisma.schoolGuardian.create({
      data: {
        schoolId: schoolId,
        guardianId: newUser.id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone || null,
        updatedAt: new Date(),
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
        nic: newUser.nic,
        role: newUser.role,
        activeStatus: newUser.activeStatus,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating guardian:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

