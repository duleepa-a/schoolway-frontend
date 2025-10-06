import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface GuardianRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  schoolId: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Guardian creation request body:', body);
    const { firstName, lastName, email, phone, schoolId } = body as GuardianRequestBody;

    // Validate required fields
    if (!firstName || !lastName || !email || !schoolId) {
      console.log('Validation failed - missing required fields:', { firstName, lastName, email, schoolId });
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email, and schoolId are required" },
        { status: 400 }
      );
    }

    // Check if guardian with email already exists
    const existingGuardian = await prisma.schoolGuardian.findUnique({
      where: {
        email,
      },
    });

    if (existingGuardian) {
      return NextResponse.json(
        { error: "Guardian with this email already exists" },
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
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Verify school exists
    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found with the given ID" },
        { status: 404 }
      );
    }

    // Create user profile first
    console.log('Creating user profile with data:', { firstName, lastName, email, phone });
    const newUser = await prisma.userProfile.create({
      data: {
        email,
        firstname: firstName,
        lastname: lastName,
        password: 'guardian123', // Default password - should be hashed in production
        role: 'PARENT', // Using PARENT as the closest role for guardians
        mobile: phone || null,
        activeStatus: true,
      },
    });
    console.log('User profile created successfully:', newUser);

    // Create guardian record linked to user profile
    console.log('Creating guardian with data:', { firstName, lastName, email, phone, schoolId, guardianId: newUser.id });
    const newGuardian = await prisma.schoolGuardian.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        schoolId,
        guardianId: newUser.id,
      },
      include: {
        school: {
          select: {
            id: true,
            schoolName: true,
          },
        },
        userProfile: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
            activeStatus: true,
          },
        },
      },
    });
    console.log('Guardian created successfully:', newGuardian);

    // Return success response with created guardian data
    return NextResponse.json({
      message: "Guardian created successfully",
      guardian: {
        id: newGuardian.id,
        firstName: newGuardian.firstName,
        lastName: newGuardian.lastName,
        email: newGuardian.email,
        phone: newGuardian.phone,
        schoolId: newGuardian.schoolId,
        schoolName: newGuardian.school.schoolName,
        createdAt: newGuardian.createdAt,
        updatedAt: newGuardian.updatedAt,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating guardian:", error);
    return NextResponse.json(
      { 
        error: "Failed to create guardian",
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const schoolId = searchParams.get('schoolId');

    let whereClause = {};
    if (schoolId) {
      whereClause = { schoolId: parseInt(schoolId) };
    }

    const guardians = await prisma.schoolGuardian.findMany({
      where: whereClause,
      include: {
        school: {
          select: {
            id: true,
            schoolName: true,
          },
        },
        userProfile: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
            activeStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedGuardians = guardians.map((guardian) => ({
      id: guardian.id,
      firstName: guardian.firstName,
      lastName: guardian.lastName,
      email: guardian.email,
      phone: guardian.phone,
      schoolId: guardian.schoolId,
      schoolName: guardian.school.schoolName,
      createdAt: guardian.createdAt,
      updatedAt: guardian.updatedAt,
    }));

    return NextResponse.json(formattedGuardians);
  } catch (error) {
    console.error("Error fetching guardians:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch guardians",
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, firstName, lastName, email, phone, schoolId } = body;

    // Validate required fields
    if (!id || !firstName || !lastName || !email || !schoolId) {
      return NextResponse.json(
        { error: "Missing required fields: id, firstName, lastName, email, and schoolId are required" },
        { status: 400 }
      );
    }

    // Check if guardian exists
    const existingGuardian = await prisma.schoolGuardian.findUnique({
      where: { id: parseInt(id) },
      include: { userProfile: true }
    });

    if (!existingGuardian) {
      return NextResponse.json(
        { error: "Guardian not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if new email already exists
    if (email !== existingGuardian.email) {
      const emailExists = await prisma.schoolGuardian.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Guardian with this email already exists" },
          { status: 400 }
        );
      }
    }

    // Verify school exists
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!school) {
      return NextResponse.json(
        { error: "School not found with the given ID" },
        { status: 404 }
      );
    }

    // Update guardian record
    const updatedGuardian = await prisma.schoolGuardian.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        schoolId,
        updatedAt: new Date(),
      },
      include: {
        school: {
          select: {
            id: true,
            schoolName: true,
          },
        },
        userProfile: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
            activeStatus: true,
          },
        },
      },
    });

    // Update associated user profile
    if (existingGuardian.userProfile) {
      await prisma.userProfile.update({
        where: { id: existingGuardian.userProfile.id },
        data: {
          email,
          firstname: firstName,
          lastname: lastName,
          mobile: phone || null,
        },
      });
    }

    return NextResponse.json({
      message: "Guardian updated successfully",
      guardian: {
        id: updatedGuardian.id,
        firstName: updatedGuardian.firstName,
        lastName: updatedGuardian.lastName,
        email: updatedGuardian.email,
        phone: updatedGuardian.phone,
        schoolId: updatedGuardian.schoolId,
        schoolName: updatedGuardian.school.schoolName,
        createdAt: updatedGuardian.createdAt,
        updatedAt: updatedGuardian.updatedAt,
      }
    });

  } catch (error) {
    console.error("Error updating guardian:", error);
    return NextResponse.json(
      { 
        error: "Failed to update guardian",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const guardianId = searchParams.get('id');

    if (!guardianId) {
      return NextResponse.json(
        { error: "Guardian ID is required" },
        { status: 400 }
      );
    }

    // Find the guardian to get the user profile ID
    const guardian = await prisma.schoolGuardian.findUnique({
      where: { id: parseInt(guardianId) },
      include: { userProfile: true }
    });

    if (!guardian) {
      return NextResponse.json(
        { error: "Guardian not found" },
        { status: 404 }
      );
    }

    // Delete the guardian record first
    await prisma.schoolGuardian.delete({
      where: { id: parseInt(guardianId) }
    });

    // Delete the associated user profile
    if (guardian.userProfile) {
      await prisma.userProfile.delete({
        where: { id: guardian.userProfile.id }
      });
    }

    return NextResponse.json({
      message: "Guardian deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting guardian:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete guardian",
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
