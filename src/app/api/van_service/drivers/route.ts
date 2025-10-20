aimport { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const search = searchParams.get('search') || '';
    const district = searchParams.get('district') || '';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
     
    // Build where clause for filtering
    const whereClause: any = {
      UserProfile: {
        activeStatus: true,
        role: 'DRIVER'
      }
    };

    // Add hasVan condition only for non-name searches or when using district filter
    if (!search || (district && district !== 'All')) {
      whereClause.hasVan = 0;
    }
    
    // Add search filter if provided
    if (search) {
      whereClause.UserProfile.OR = [
        {
          firstname: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          lastname: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }
    
    // Add district filter if provided
    if (district && district !== 'All') {
      whereClause.UserProfile.district = district;
    }

    // Get total count for pagination
    const totalCount = await prisma.driverProfile.count({
      where: whereClause
    });

    // Get paginated drivers with their user profiles
    const drivers = await prisma.driverProfile.findMany({
      include: {
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            district: true,
            mobile: true,
            activeStatus: true,
          }
        }
      },
      where: whereClause,
      skip: skip,
      take: limit,
      orderBy: [
        { averageRating: 'desc' },
        { UserProfile: { firstname: 'asc' } }
      ]
    });

    // Get unique districts for filter options
    const uniqueDistricts = await prisma.userProfile.findMany({
      where: {
        role: 'DRIVER',
        activeStatus: true,
        district: {
          not: null
        }
      },
      select: {
        district: true
      },
      distinct: ['district']
    });

    const availableDistricts = uniqueDistricts
      .map(item => item.district)
      .filter(district => district && district !== 'Not specified')
      .sort();

    // Transform the data to match the frontend format
    const transformedDrivers = drivers.map(driver => {
      // Calculate experience based on startedDriving
      const startedDriving = driver.startedDriving;
      let experience = 0;
      
      if (startedDriving) {
        const now = new Date();
        const startDate = new Date(startedDriving);
        const diffInMs = now.getTime() - startDate.getTime();
        const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
        experience = Math.max(0, Math.floor(diffInYears)); // Ensure non-negative
      }

      const fullName = `${driver.UserProfile.firstname || ''} ${driver.UserProfile.lastname || ''}`.trim();

      return {
        id: driver.UserProfile.id,
        name: fullName || 'No name provided',
        experience: experience === 0 ? 'New driver' : `${experience} year${experience !== 1 ? 's' : ''}`,
        rating: Math.max(0, Math.min(5, Math.round(driver.averageRating))) || 0,
        image: '/Images/male_pro_pic_placeholder.png',
        district: driver.UserProfile.district || 'Not specified',
        contact: driver.UserProfile.mobile || 'Not provided',
        licenseId: driver.licenseId,
        licenseExpiry: driver.licenseExpiry,
        ratingCount: Math.max(0, driver.totalReviews),
        email: driver.UserProfile.email,
        hasVan: driver.hasVan === 1  // Add this field to show
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    console.log(`Fetched ${transformedDrivers.length} drivers (page ${page}/${totalPages})`);

    return NextResponse.json({
      drivers: transformedDrivers,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPrevPage
      },
      availableDistricts
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

