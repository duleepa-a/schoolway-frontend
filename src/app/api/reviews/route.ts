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
      // For VAN_SERVICE, targetId is the van service owner's user ID
      const vanService = await prisma.vanService.findUnique({
        where: { userId: targetId }
      });

      if (!vanService) {
        // Get some sample van services to help debug
        const sampleVanServices = await prisma.vanService.findMany({
          select: { id: true, serviceName: true, userId: true },
          take: 5
        });
        
        return NextResponse.json(
          { 
            error: 'Van service not found',
            debug: {
              requestedTargetId: targetId,
              sampleVanServices: sampleVanServices
            }
          },
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
      // For VAN_SERVICE, targetId is the van service owner's user ID
      const vanServiceReviews = await prisma.review.findMany({
        where: {
          reviewType: 'VAN_SERVICE',
          targetId: targetId
        }
      });

      const totalRating = vanServiceReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = vanServiceReviews.length > 0 ? totalRating / vanServiceReviews.length : 0;

      // Update van service using the user ID (targetId is the van service owner's user ID)
      await prisma.vanService.updateMany({
        where: { userId: targetId },
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
            lastname: true,
            dp: true,
            mobile: true,
            driverProfile: {
              select: {
                averageRating: true
              }
            }
          }
        },
        Van: {
          select: {
            id: true,
            registrationNumber: true,
            makeAndModel: true,
            ownerId: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // For van service reviews, fetch the van service names
    if (reviewType === 'VAN_SERVICE') {
      const vanOwnerIds = [...new Set(reviews.map(review => review.Van.ownerId))];
      
      if (vanOwnerIds.length > 0) {
        const vanServices = await prisma.vanService.findMany({
          where: {
            userId: {
              in: vanOwnerIds
            }
          },
          select: {
            userId: true,
            serviceName: true
          }
        });

        // Create a map of userId to serviceName
        const serviceNameMap = vanServices.reduce((acc, service) => {
          acc[service.userId] = service.serviceName;
          return acc;
        }, {} as Record<string, string>);

        // Add service names to reviews
        reviews.forEach(review => {
          (review.Van as any).serviceName = serviceNameMap[review.Van.ownerId] || 'Unknown Service';
        });
      }
    }

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

// PUT endpoint to update a review
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const reviewId = formData.get('reviewId') as string;
    const rating = parseInt(formData.get('rating') as string);
    const comment = formData.get('comment') as string;
    const reviewerId = formData.get('reviewerId') as string;

    // Validate required fields
    if (!reviewId || !rating || !reviewerId) {
      return NextResponse.json(
        { error: 'Missing required fields: reviewId, rating, and reviewerId are required' },
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

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        Child: {
          select: { parentId: true }
        }
      }
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify the reviewer is the parent of the child
    if (existingReview.Child.parentId !== reviewerId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only update reviews for your own child' },
        { status: 403 }
      );
    }

    // Update the review
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: rating,
        comment: comment || null,
        updatedAt: new Date()
      }
    });

    // Update average ratings for the target
    await updateAverageRatings(existingReview.reviewType, existingReview.targetId);

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      review: {
        id: updatedReview.id,
        rating: updatedReview.rating,
        comment: updatedReview.comment,
        reviewType: updatedReview.reviewType,
        updatedAt: updatedReview.updatedAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a review
export async function DELETE(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const reviewId = formData.get('reviewId') as string;
    const reviewerId = formData.get('reviewerId') as string;

    // Validate required fields
    if (!reviewId || !reviewerId) {
      return NextResponse.json(
        { error: 'Missing required fields: reviewId and reviewerId are required' },
        { status: 400 }
      );
    }

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        Child: {
          select: { parentId: true }
        }
      }
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify the reviewer is the parent of the child
    if (existingReview.Child.parentId !== reviewerId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete reviews for your own child' },
        { status: 403 }
      );
    }

    // Store review info before deletion for rating update
    const reviewType = existingReview.reviewType;
    const targetId = existingReview.targetId;

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    // Update average ratings for the target after deletion
    await updateAverageRatings(reviewType, targetId);

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
