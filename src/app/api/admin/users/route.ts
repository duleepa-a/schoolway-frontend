import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const roleFilter = searchParams.get('roleFilter') || '';

    // Build the where clause
    let whereClause: any = {};

    // Filter by role if provided (for specific role tabs)
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

    // Additional role filter for All Users tab
    if (roleFilter && role === 'all') {
      const roleMapping: { [key: string]: string } = {
        'admin': 'ADMIN',
        'driver': 'DRIVER',
        'parent': 'PARENT',
        'van owner': 'SERVICE',
        'teacher': 'TEACHER'
      };
      
      whereClause.role = roleMapping[roleFilter] || roleFilter.toUpperCase();
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
        nic: true,
        dp: true,
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
        Van_Van_assignedDriverIdToUserProfile: {
          select: {
            id: true,
            registrationNumber: true,
            makeAndModel: true,
            licensePlateNumber: true
          }
        },
        vanService: {
          select: {
            serviceName: true,
            contactNo: true,
            averageRating: true,
            totalReviews: true
          }
        },
        Van: {
          select: {
            id: true,
            makeAndModel: true,
            licensePlateNumber: true,
            registrationNumber: true,
            seatingCapacity: true,
            status: true,
            photoUrl: true,
            assignedDriverId: true,
            UserProfile_Van_assignedDriverIdToUserProfile: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                mobile: true
              }
            }
          }
        },
        Child: {
          select: {
            id: true,
            name: true,
            age: true,
            grade: true,
            schoolStartTime: true,
            schoolEndTime: true,
            pickupAddress: true,
            status: true,
            School: {
              select: {
                schoolName: true,
                address: true
              }
            },
            Van: {
              select: {
                makeAndModel: true,
                licensePlateNumber: true,
                registrationNumber: true,
                assignedDriverId: true,
                UserProfile_Van_assignedDriverIdToUserProfile: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    mobile: true
                  }
                }
              }
            },
            Gate: {
              select: {
                gateName: true,
                address: true
              }
            }
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
      NIC: user.nic || '',
      ProfilePicture: user.dp || '/Images/male_pro_pic_placeholder.png',
      CreatedAt: user.createdAt,
      UpdatedAt: user.updatedAt,
      // Additional role-specific data
      LicenseNumber: user.driverProfile?.licenseId || '',
      ...(user.driverProfile && {
        LicenseId: user.driverProfile.licenseId,
        LicenseExpiry: user.driverProfile.licenseExpiry,
        DriverStatus: user.driverProfile.status,
        DriverRating: user.driverProfile.averageRating,
        DriverReviews: user.driverProfile.totalReviews
      }),
      AssignedVan: user.Van_Van_assignedDriverIdToUserProfile && user.Van_Van_assignedDriverIdToUserProfile.length > 0 
        ? `${user.Van_Van_assignedDriverIdToUserProfile[0].makeAndModel} (${user.Van_Van_assignedDriverIdToUserProfile[0].licensePlateNumber})`
        : 'Not Assigned',
      ...(user.vanService && {
        ServiceName: user.vanService.serviceName,
        ServiceContact: user.vanService.contactNo,
        ServiceRating: user.vanService.averageRating,
        ServiceReviews: user.vanService.totalReviews
      }),
      ...(user.Van && user.Van.length > 0 && {
        Vans: user.Van.map((van: any) => ({
          id: van.id,
          makeAndModel: van.makeAndModel,
          licensePlateNumber: van.licensePlateNumber,
          registrationNumber: van.registrationNumber,
          seatingCapacity: van.seatingCapacity,
          status: van.status,
          photoUrl: van.photoUrl,
          assignedDriverId: van.assignedDriverId,
          assignedDriver: van.UserProfile_Van_assignedDriverIdToUserProfile ? {
            id: van.UserProfile_Van_assignedDriverIdToUserProfile.id,
            name: `${van.UserProfile_Van_assignedDriverIdToUserProfile.firstname || ''} ${van.UserProfile_Van_assignedDriverIdToUserProfile.lastname || ''}`.trim() || 'No Name',
            mobile: van.UserProfile_Van_assignedDriverIdToUserProfile.mobile || ''
          } : null
        }))
      }),
      ...(user.Child && user.Child.length > 0 && {
        Children: user.Child.map((child: any) => ({
          id: child.id,
          name: child.name,
          age: child.age,
          grade: child.grade,
          schoolStartTime: child.schoolStartTime,
          schoolEndTime: child.schoolEndTime,
          pickupAddress: child.pickupAddress,
          status: child.status,
          school: child.School ? {
            name: child.School.schoolName,
            address: child.School.address
          } : null,
          van: child.Van ? {
            makeAndModel: child.Van.makeAndModel,
            licensePlate: child.Van.licensePlateNumber,
            registrationNumber: child.Van.registrationNumber,
            assignedDriverId: child.Van.assignedDriverId,
            assignedDriver: child.Van.UserProfile_Van_assignedDriverIdToUserProfile ? {
              id: child.Van.UserProfile_Van_assignedDriverIdToUserProfile.id,
              name: `${child.Van.UserProfile_Van_assignedDriverIdToUserProfile.firstname || ''} ${child.Van.UserProfile_Van_assignedDriverIdToUserProfile.lastname || ''}`.trim() || 'No Name',
              mobile: child.Van.UserProfile_Van_assignedDriverIdToUserProfile.mobile || ''
            } : null
          } : null,
          gate: child.Gate ? {
            name: child.Gate.gateName,
            address: child.Gate.address
          } : null
        }))
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