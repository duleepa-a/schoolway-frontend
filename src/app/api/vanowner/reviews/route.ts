import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    
    // Extract search and filter parameters
    const search = searchParams.get('search') || '';
    const minRating = searchParams.get('minRating') ? parseInt(searchParams.get('minRating')!) : null;
    const maxRating = searchParams.get('maxRating') ? parseInt(searchParams.get('maxRating')!) : null;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const reviewType = searchParams.get('reviewType') || 'all';
    const selectedVan = searchParams.get('selectedVan') || '';
    const selectedDriver = searchParams.get('selectedDriver') || '';

    // Get the van service owner's vans
    const ownerVans = await prisma.van.findMany({
      where: { ownerId: userId },
      select: { id: true, registrationNumber: true, makeAndModel: true }
    });

    const vanIds = ownerVans.map(van => van.id);

    if (vanIds.length === 0) {
      return NextResponse.json({
        vanReviews: [],
        vanServiceReviews: [],
        totalVanReviews: 0,
        totalVanServiceReviews: 0,
        averageVanRating: 0,
        averageVanServiceRating: 0
      });
    }

    // Build where clause for van reviews
    const vanReviewsWhere: any = {
      vanId: { in: vanIds },
      reviewType: 'DRIVER'
    };

    // Add search conditions
    if (search) {
      vanReviewsWhere.OR = [
        { Child: { name: { contains: search, mode: 'insensitive' } } },
        { Child: { UserProfile: { firstname: { contains: search, mode: 'insensitive' } } } },
        { Child: { UserProfile: { lastname: { contains: search, mode: 'insensitive' } } } },
        { UserProfile: { firstname: { contains: search, mode: 'insensitive' } } },
        { UserProfile: { lastname: { contains: search, mode: 'insensitive' } } },
        { Van: { registrationNumber: { contains: search, mode: 'insensitive' } } },
        { Van: { makeAndModel: { contains: search, mode: 'insensitive' } } },
        { comment: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add rating filter
    if (minRating !== null || maxRating !== null) {
      vanReviewsWhere.rating = {};
      if (minRating !== null) vanReviewsWhere.rating.gte = minRating;
      if (maxRating !== null) vanReviewsWhere.rating.lte = maxRating;
    }

    // Add date filter
    if (startDate || endDate) {
      vanReviewsWhere.createdAt = {};
      if (startDate) vanReviewsWhere.createdAt.gte = startDate;
      if (endDate) vanReviewsWhere.createdAt.lte = endDate;
    }

    // Add van filter (only for van reviews)
    if (selectedVan && reviewType !== 'service') {
      vanReviewsWhere.vanId = parseInt(selectedVan);
    }

    // Add driver filter (only for van reviews)
    if (selectedDriver && reviewType !== 'service') {
      vanReviewsWhere.UserProfile = {
        id: selectedDriver
      };
    }

    // Get reviews for the owner's vans (driver reviews)
    const vanReviews = await prisma.review.findMany({
      where: vanReviewsWhere,
      include: {
        Child: {
          select: {
            id: true,
            name: true,
            UserProfile: {
              select: {
                firstname: true,
                lastname: true,
                dp: true
              }
            }
          }
        },
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            dp: true,
            DriverProfile: {
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
            makeAndModel: true
          }
        }
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });

    // Build where clause for van service reviews
    const vanServiceReviewsWhere: any = {
      targetId: userId,
      reviewType: 'VAN_SERVICE'
    };

    // Add search conditions for van service reviews
    if (search) {
      vanServiceReviewsWhere.OR = [
        { Child: { name: { contains: search, mode: 'insensitive' } } },
        { Child: { UserProfile: { firstname: { contains: search, mode: 'insensitive' } } } },
        { Child: { UserProfile: { lastname: { contains: search, mode: 'insensitive' } } } },
        { Van: { registrationNumber: { contains: search, mode: 'insensitive' } } },
        { Van: { makeAndModel: { contains: search, mode: 'insensitive' } } },
        { comment: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Add rating filter for van service reviews
    if (minRating !== null || maxRating !== null) {
      vanServiceReviewsWhere.rating = {};
      if (minRating !== null) vanServiceReviewsWhere.rating.gte = minRating;
      if (maxRating !== null) vanServiceReviewsWhere.rating.lte = maxRating;
    }

    // Add date filter for van service reviews
    if (startDate || endDate) {
      vanServiceReviewsWhere.createdAt = {};
      if (startDate) vanServiceReviewsWhere.createdAt.gte = startDate;
      if (endDate) vanServiceReviewsWhere.createdAt.lte = endDate;
    }

    // Add van filter for van service reviews (only when not filtering by reviewType)
    if (selectedVan && reviewType !== 'van') {
      vanServiceReviewsWhere.Van = {
        id: parseInt(selectedVan)
      };
    }

    // Get reviews for the van service owner (VAN_SERVICE reviews)
    const vanServiceReviews = await prisma.review.findMany({
      where: vanServiceReviewsWhere,
      include: {
        Child: {
          select: {
            id: true,
            name: true,
            UserProfile: {
              select: {
                firstname: true,
                lastname: true,
                dp: true
              }
            }
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
        [sortBy]: sortOrder
      }
    });

    // Filter reviews based on reviewType parameter
    let filteredVanReviews = vanReviews;
    let filteredVanServiceReviews = vanServiceReviews;

    if (reviewType === 'van') {
      filteredVanServiceReviews = [];
    } else if (reviewType === 'service') {
      filteredVanReviews = [];
    }

    // Calculate average ratings based on ALL data (not filtered)
    const vanReviewsRatings = vanReviews.map(review => review.rating);
    const vanServiceReviewsRatings = vanServiceReviews.map(review => review.rating);

    const averageVanRating = vanReviewsRatings.length > 0 
      ? vanReviewsRatings.reduce((sum, rating) => sum + rating, 0) / vanReviewsRatings.length 
      : 0;

    const averageVanServiceRating = vanServiceReviewsRatings.length > 0 
      ? vanServiceReviewsRatings.reduce((sum, rating) => sum + rating, 0) / vanServiceReviewsRatings.length 
      : 0;

    console.log('API Response:', {
      reviewType,
      totalVanReviews: vanReviews.length,
      totalVanServiceReviews: vanServiceReviews.length,
      filteredVanReviewsCount: filteredVanReviews.length,
      filteredVanServiceReviewsCount: filteredVanServiceReviews.length,
      averageVanRating,
      averageVanServiceRating
    });

    return NextResponse.json({
      vanReviews: filteredVanReviews,
      vanServiceReviews: filteredVanServiceReviews,
      totalVanReviews: vanReviews.length, // Always return total counts
      totalVanServiceReviews: vanServiceReviews.length, // Always return total counts
      averageVanRating: Math.round(averageVanRating * 10) / 10,
      averageVanServiceRating: Math.round(averageVanServiceRating * 10) / 10,
      ownerVans,
      filters: {
        search,
        minRating,
        maxRating,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        sortBy,
        sortOrder,
        reviewType,
        selectedVan,
        selectedDriver
      }
    });

  } catch (error) {
    console.error('Error fetching van owner reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
