import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const parentId = searchParams.get('parentId');

    if (!childId && !parentId) {
      return NextResponse.json(
        { error: 'Either childId or parentId is required' },
        { status: 400 }
      );
    }

    let whereClause: any = {};
    
    if (childId) {
      whereClause.id = parseInt(childId);
    }
    
    if (parentId) {
      whereClause.parentId = parentId;
    }

    const children = await prisma.child.findMany({
      where: whereClause,
      include: {
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            dp: true
          }
        },
        School: {
          select: {
            id: true,
            schoolName: true,
            address: true,
            contact: true
          }
        },
        Van: {
          select: {
            id: true,
            registrationNumber: true,
            licensePlateNumber: true,
            makeAndModel: true,
            seatingCapacity: true,
            acCondition: true,
            photoUrl: true,
            ownerId: true,
            assignedDriverId: true,
            UserProfile: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                mobile: true,
                dp: true,
                vanService: {
                  select: {
                    id: true,
                    serviceName: true,
                    contactNo: true,
                    serviceRegNumber: true,
                    averageRating: true,
                    totalReviews: true
                  }
                }
              }
            },
            UserProfile_assignedDriverIdToUserProfile: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                mobile: true,
                dp: true,
                driverProfile: {
                  select: {
                    id: true,
                    licenseId: true,
                    licenseExpiry: true,
                    startedDriving: true,
                    bio: true,
                    languages: true,
                    licenseType: true,
                    averageRating: true,
                    totalReviews: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Transform the data to make it more mobile-friendly
    const transformedChildren = children.map(child => ({
      id: child.id,
      name: child.name,
      age: child.age,
      grade: child.grade,
      profilePicture: child.profilePicture,
      schoolStartTime: child.schoolStartTime,
      schoolEndTime: child.schoolEndTime,
      pickupAddress: child.pickupAddress,
      specialNotes: child.specialNotes,
      status: child.status,
      feeAmount: child.feeAmount,
      parent: child.UserProfile,
      school: child.School,
      van: child.Van ? {
        id: child.Van.id,
        registrationNumber: child.Van.registrationNumber,
        licensePlateNumber: child.Van.licensePlateNumber,
        makeAndModel: child.Van.makeAndModel,
        seatingCapacity: child.Van.seatingCapacity,
        acCondition: child.Van.acCondition,
        photoUrl: child.Van.photoUrl,
        vanService: child.Van.UserProfile?.vanService ? {
          id: child.Van.UserProfile.vanService.id,
          serviceName: child.Van.UserProfile.vanService.serviceName,
          contactNo: child.Van.UserProfile.vanService.contactNo,
          serviceRegNumber: child.Van.UserProfile.vanService.serviceRegNumber,
          averageRating: child.Van.UserProfile.vanService.averageRating,
          totalReviews: child.Van.UserProfile.vanService.totalReviews,
          owner: {
            id: child.Van.UserProfile.id,
            firstname: child.Van.UserProfile.firstname,
            lastname: child.Van.UserProfile.lastname,
            email: child.Van.UserProfile.email,
            mobile: child.Van.UserProfile.mobile,
            profilePicture: child.Van.UserProfile.dp
          }
        } : null,
        driver: child.Van.UserProfile_assignedDriverIdToUserProfile ? {
          id: child.Van.UserProfile_assignedDriverIdToUserProfile.id,
          firstname: child.Van.UserProfile_assignedDriverIdToUserProfile.firstname,
          lastname: child.Van.UserProfile_assignedDriverIdToUserProfile.lastname,
          email: child.Van.UserProfile_assignedDriverIdToUserProfile.email,
          mobile: child.Van.UserProfile_assignedDriverIdToUserProfile.mobile,
          profilePicture: child.Van.UserProfile_assignedDriverIdToUserProfile.dp,
          driverProfile: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile ? {
            id: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.id,
            licenseId: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.licenseId,
            licenseExpiry: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.licenseExpiry,
            startedDriving: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.startedDriving,
            bio: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.bio,
            languages: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.languages,
            licenseType: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.licenseType,
            averageRating: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.averageRating,
            totalReviews: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.totalReviews,
            experience: child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.startedDriving 
              ? `${new Date().getFullYear() - new Date(child.Van.UserProfile_assignedDriverIdToUserProfile.driverProfile.startedDriving).getFullYear()} years`
              : 'Not specified'
          } : null
        } : null
      } : null
    }));

    return NextResponse.json({
      children: transformedChildren,
      count: transformedChildren.length
    });

  } catch (error) {
    console.error('Error fetching child details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}








