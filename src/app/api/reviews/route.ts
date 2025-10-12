import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract data from form
    const childId = parseInt(formData.get('childId') as string);
    const reviewType = formData.get('reviewType') as string;
    const targetId = formData.get('targetId') as string;
    const rating = parseInt(formData.get('rating') as string);
    const comment = formData.get('comment') as string;
    const vanId = parseInt(formData.get('vanId') as string);
    const reviewerId = formData.get('reviewerId') as string;

    // Validate required fields
    if (!childId || !reviewType || !targetId || !rating || !vanId || !reviewerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate review type
    if (!['DRIVER', 'VAN_SERVICE'].includes(reviewType)) {
      return NextResponse.json(
        { error: 'Invalid review type. Must be DRIVER or VAN_SERVICE' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if child exists
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: { UserProfile: true }
    });

    if (!child) {
      // Get some sample children to help debug
      const sampleChildren = await prisma.child.findMany({
        select: { id: true, name: true, parentId: true },
        take: 5
      });
      
      return NextResponse.json(
        { 
          error: 'Child not found',
          debug: {
            requestedChildId: childId,
            sampleChildren: sampleChildren
          }
        },
        { status: 404 }
      );
    }

    // Verify the reviewer is the parent of the child
    if (child.parentId !== reviewerId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only review for your own child' },
        { status: 403 }
      );
    }

    // Check if van exists
    const van = await prisma.van.findUnique({
      where: { id: vanId }
    });

    if (!van) {
      // Get some sample vans to help debug
      const sampleVans = await prisma.van.findMany({
        select: { id: true, registrationNumber: true, makeAndModel: true },
        take: 5
      });
      
      return NextResponse.json(
        { 
          error: 'Van not found',
          debug: {
            requestedVanId: vanId,
            sampleVans: sampleVans
          }
        },
        { status: 404 }
      );
    }

    // Check if target exists based on review type
    if (reviewType === 'DRIVER') {
      const driver = await prisma.userProfile.findUnique({
        where: { id: targetId },
        include: { driverProfile: true }
      });

      if (!driver || !driver.driverProfile) {
        // Get some sample drivers to help debug
        const sampleDrivers = await prisma.userProfile.findMany({
          where: { driverProfile: { isNot: null } },
          select: { id: true, firstname: true, lastname: true },
          take: 5
        });
        
        return NextResponse.json(
          { 
            error: 'Driver not found',
            debug: {
              requestedTargetId: targetId,
              sampleDrivers: sampleDrivers
            }
          },
          { status: 404 }
        );
      }
    } else if (reviewType === 'VAN_SERVICE') {
      const vanService = await prisma.vanService.findUnique({
        where: { id: targetId }
      });

      if (!vanService) {
        return NextResponse.json(
          { error: 'Van service not found' },
          { status: 404 }
        );
      }
    }

    // Check if review already exists for this child and target
    const existingReview = await prisma.review.findFirst({
      where: {
        childId: childId,
        reviewType: reviewType as 'DRIVER' | 'VAN_SERVICE',
        targetId: targetId
      }
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this child and target' },
        { status: 409 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        childId: childId,
        reviewType: reviewType as 'DRIVER' | 'VAN_SERVICE',
        targetId: targetId,
        rating: rating,
        comment: comment || null,
        vanId: vanId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Update average ratings
    await updateAverageRatings(reviewType, targetId);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        reviewType: review.reviewType,
        createdAt: review.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update average ratings
async function updateAverageRatings(reviewType: string, targetId: string) {
  try {
    if (reviewType === 'DRIVER') {
      // Update driver profile ratings
      const driverReviews = await prisma.review.findMany({
        where: {
          reviewType: 'DRIVER',
          targetId: targetId
        }
      });

      const totalRating = driverReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = driverReviews.length > 0 ? totalRating / driverReviews.length : 0;

      await prisma.driverProfile.updateMany({
        where: { userId: targetId },
        data: {
          averageRating: averageRating,
          totalReviews: driverReviews.length
        }
      });
    } else if (reviewType === 'VAN_SERVICE') {
      // Update van service ratings
      const vanServiceReviews = await prisma.review.findMany({
        where: {
          reviewType: 'VAN_SERVICE',
          targetId: targetId
        }
      });

      const totalRating = vanServiceReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = vanServiceReviews.length > 0 ? totalRating / vanServiceReviews.length : 0;

      await prisma.vanService.updateMany({
        where: { id: targetId },
        data: {
          averageRating: averageRating,
          totalReviews: vanServiceReviews.length
        }
      });
    }
  } catch (error) {
    console.error('Error updating average ratings:', error);
    // Don't throw error here as the review was already created successfully
  }
}

// GET endpoint to fetch reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const reviewType = searchParams.get('reviewType');
    const targetId = searchParams.get('targetId');

    let whereClause: any = {};

    if (childId) {
      whereClause.childId = parseInt(childId);
    }

    if (reviewType) {
      whereClause.reviewType = reviewType;
    }

    if (targetId) {
      whereClause.targetId = targetId;
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      include: {
        Child: {
          select: {
            id: true,
            name: true
          }
        },
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true
          }
        },
        Van: {
          select: {
            id: true,
            registrationNumber: true,
            makeAndModel: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      reviews,
      count: reviews.length
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
