import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Build the where clause
    let whereClause: any = {};

    // Filter by role if provided
    if (role && role !== 'all') {
      // Map frontend role names to database enum values
      const roleMapping: { [key: string]: string } = {
        'driver': 'DRIVER',
        'parent': 'PARENT',
        'van owner': 'SERVICE',
        'admin': 'ADMIN'
      };
      
      whereClause.role = roleMapping[role] || role.toUpperCase();
    }

    // Add search functionality
    if (search) {
      whereClause.OR = [
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by status if provided
    if (status && status !== 'all') {
      if (status === 'Active') {
        whereClause.activeStatus = true;
      } else if (status === 'Inactive') {
        whereClause.activeStatus = false;
      }
      // For 'Pending', we might need additional logic based on your business rules
    }

    // Fetch users with related data
    const users = await prisma.userProfile.findMany({
      where: whereClause,
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
        createdAt: true,
        updatedAt: true,
        driverProfile: {
          select: {
            licenseId: true,
            licenseExpiry: true,
            status: true,
            averageRating: true,
            totalReviews: true
          }
        },
        vanService: {
          select: {
            serviceName: true,
            contactNo: true,
            averageRating: true,
            totalReviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match frontend expectations
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      Name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'No Name',
      User_ID: user.id,
      Email: user.email,
      Status: user.activeStatus ? 'Active' : 'Inactive',
      Role: user.role?.toLowerCase().replace('_', ' ') || 'unknown',
      Mobile: user.mobile || '',
      Address: user.address || '',
      District: user.district || '',
      CreatedAt: user.createdAt,
      UpdatedAt: user.updatedAt,
      // Additional role-specific data
      ...(user.driverProfile && {
        LicenseId: user.driverProfile.licenseId,
        LicenseExpiry: user.driverProfile.licenseExpiry,
        DriverStatus: user.driverProfile.status,
        DriverRating: user.driverProfile.averageRating,
        DriverReviews: user.driverProfile.totalReviews
      }),
      ...(user.vanService && {
        ServiceName: user.vanService.serviceName,
        ServiceContact: user.vanService.contactNo,
        ServiceRating: user.vanService.averageRating,
        ServiceReviews: user.vanService.totalReviews
      })
    }));

    return NextResponse.json({
      success: true,
      data: transformedUsers,
      count: transformedUsers.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}