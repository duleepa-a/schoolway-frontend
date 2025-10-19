import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!updateData.Name && !updateData.Email) {
      return NextResponse.json(
        { success: false, error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    // Parse the name into firstname and lastname
    let firstname = '';
    let lastname = '';
    if (updateData.Name) {
      const nameParts = updateData.Name.trim().split(' ');
      firstname = nameParts[0] || '';
      lastname = nameParts.slice(1).join(' ') || '';
    }

    // Prepare the update data for the database
    const dbUpdateData: any = {
      updatedAt: new Date()
    };

    if (updateData.Name) {
      dbUpdateData.firstname = firstname;
      dbUpdateData.lastname = lastname;
    }

    if (updateData.Email) {
      dbUpdateData.email = updateData.Email;
    }

    if (updateData.Mobile) {
      dbUpdateData.mobile = updateData.Mobile;
    }

    if (updateData.Address) {
      dbUpdateData.address = updateData.Address;
    }

    if (updateData.District) {
      dbUpdateData.district = updateData.District;
    }

    // Update the user
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: dbUpdateData,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
        activeStatus: true,
        mobile: true,
        address: true,
        district: true,
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
      Mobile: updatedUser.mobile || '',
      Address: updatedUser.address || '',
      District: updatedUser.district || '',
      UpdatedAt: updatedUser.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email already exists',
            details: 'A user with this email address already exists'
          },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Record to update not found')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'User not found',
            details: 'The user you are trying to update does not exist'
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}