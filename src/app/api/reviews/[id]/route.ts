import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT endpoint to update a specific review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const reviewId = resolvedParams.id;
    
    const formData = await request.formData();
    
    const rating = parseInt(formData.get('rating') as string);
    const comment = formData.get('comment') as string;
    const reviewerId = formData.get('reviewerId') as string;

    // Validate required fields
    if (!rating || !reviewerId) {
      return NextResponse.json(
        { error: 'Missing required fields: rating and reviewerId are required' },
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

// DELETE endpoint to delete a specific review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const reviewId = resolvedParams.id;
    
    const formData = await request.formData();
    const reviewerId = formData.get('reviewerId') as string;

    // Validate required fields
    if (!reviewerId) {
      return NextResponse.json(
        { error: 'Missing required field: reviewerId is required' },
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
    // Don't throw error here as the review operation was already successful
  }
}



