import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database
    const existingUser = await prisma.userProfile.findUnique({
      where: { email: email }
    });

    console.log("Mobile login attempt for:", email);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const pwmatch = await compare(password, existingUser.password);
    console.log("Password match:", pwmatch);

    if (!pwmatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    var approvalstatus = null;
    if (existingUser.activeStatus != true) {
      return NextResponse.json(
        { success: false, error: 'User account is deactivated' },
        { status: 403 }
      );
    }else if (existingUser.role == 'DRIVER') {
      console.log("User is a driver, fetching driver profile...");
      
      const driverData = await prisma.driverProfile.findUnique({
        where: { userId: existingUser.id },
        include: { 
          // status: true,
        }
      });

      if (!driverData) {
        return NextResponse.json(
          { success: false, error: 'Driver profile not found' },
          { status: 404 }
        );
      }
      approvalstatus = driverData.status;
    }
    // Create session data (matching your NextAuth structure)
    const sessionData = {
      user: {
        id: `${existingUser.id}`,
        email: existingUser.email,
        name: existingUser.firstname,
        role: `${existingUser.role}`,
        approvalstatus: approvalstatus,
        // Add any other fields you need from your userProfile
      },
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    console.log("Mobile login successful for:", email);

    return NextResponse.json({
      success: true,
      session: sessionData,
      user: sessionData.user,
    });

  } catch (error) {
    console.error('Mobile sign-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}