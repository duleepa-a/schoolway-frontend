import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activeStatus } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (typeof activeStatus !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Active status must be a boolean value' },
        { status: 400 }
      );
    }

    // Update the user's active status
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: { 
        activeStatus: activeStatus,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        activeStatus: true,
        updatedAt: true
      }
    });

    // Transform the response to match frontend expectations
    const transformedUser = {
      id: updatedUser.id,
      Name: `${updatedUser.firstname || ''} ${updatedUser.lastname || ''}`.trim() || 'No Name',
      User_ID: updatedUser.id,
      Email: updatedUser.email,
      Status: updatedUser.activeStatus ? 'Active' : 'Inactive',
      Role: updatedUser.role?.toLowerCase().replace('_', ' ') || 'unknown',
      UpdatedAt: updatedUser.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: `User ${activeStatus ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          details: 'The user you are trying to update does not exist'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}