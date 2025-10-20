import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.userProfile.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        activeStatus: true,
        firstname: true,
        lastname: true
      }
    });

    if (!user) {
      // User doesn't exist - return generic response to not reveal user existence
      return NextResponse.json(
        { isActive: true, exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      isActive: user.activeStatus,
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }
    });

  } catch (error) {
    console.error('User status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



