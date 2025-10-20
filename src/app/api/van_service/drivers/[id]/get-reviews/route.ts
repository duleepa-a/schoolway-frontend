import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log("Searching for driver profile with ID:", id);
    
    // First check if the user exists
    const user = await prisma.userProfile.findUnique({
      where: { id },
      include: {
        DriverProfile: true
      }
    });
    
    if (!user) {
      console.log("User not found with ID:", id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.DriverProfile) {
      console.log("User exists but has no driver profile:", id);
      
      // Let's check if driver profile exists with userId field
      const driverProfileByUserId = await prisma.driverProfile.findUnique({
        where: { userId: id }
      });
      
      if (!driverProfileByUserId) {
        console.log("No driver profile found with userId:", id);
        return NextResponse.json(
          { error: 'Driver profile not found for this user' },
          { status: 404 }
        );
      }
      
      console.log("Found driver profile by userId:", driverProfileByUserId.id);
      
      // Get all reviews for this driver (using the user ID as targetId)
      const reviews = await prisma.review.findMany({
  where: {
    reviewType: { equals: 'DRIVER' },
    targetId: id
  },
  include: {
    Child: {
      select: {
        id: true,
        name: true,
        UserProfile: {
          select: {
            firstname: true,
            lastname: true
          }
        }
      }
    },
    Van: {
      select: {
        id: true,
        makeAndModel: true,
        licensePlateNumber: true,
      }
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
      
      return NextResponse.json({
        averageRating: driverProfileByUserId.averageRating,
        totalReviews: driverProfileByUserId.totalReviews,
        reviews,
      });
    }
    
    // If we got here, it means we have a user with a driver profile
    const driverProfile = user.DriverProfile;
    
    // Get all reviews for this driver
    const reviews = await prisma.review.findMany({
      where: {
        reviewType: { equals: 'DRIVER' }, // Make sure this matches your ReviewType enum in schema
        targetId: id
      },
      include: {
        Child: {
          select: {
            id: true,
            name: true,
          }
        },
        Van: {
          select: {
            id: true,
            makeAndModel: true,
            licensePlateNumber: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      averageRating: driverProfile.averageRating,
      totalReviews: driverProfile.totalReviews,
      reviews,
    });
    
  } catch (error) {
    console.error('Error fetching driver reviews:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to fetch driver reviews';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
      
      // Check for Prisma-specific errors
      if (error.name === 'PrismaClientKnownRequestError') {
        // @ts-expect-error - Prisma specific error properties
        if (error.code === 'P2023') {
          errorMessage = 'Invalid ID format provided';
          statusCode = 400;
        }
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
