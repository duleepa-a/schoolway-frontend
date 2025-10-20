import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get current session to ensure authorized access
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get owner ID from URL search params
    const searchParams = req.nextUrl.searchParams;
    const ownerId = searchParams.get('ownerId');
    
    // If no ownerId provided and we have a session, use the session's user ID
    const ownerIdToUse = ownerId || session.user.id;
    
    if (!ownerIdToUse) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch all counts in parallel for better performance
    const [totalVans, vansWithRoutes, vansWithDrivers] = await Promise.all([
      prisma.van.count({
        where: { ownerId: ownerIdToUse },
      }),
      prisma.van.count({
        where: {
          ownerId: ownerIdToUse,
          pathId: { not: null },
        },
      }),
      prisma.van.count({
        where: {
          ownerId: ownerIdToUse,
          DriverVanJobRequest: {
            some: {
              status: 'ACCEPTED'
            }
          }
        },
      }),
    ]);
    
    // Return dashboard statistics
    return NextResponse.json({
      totalVans,
      vansWithRoutes,
      vansWithDrivers,
      vansWithoutRoutes: totalVans - vansWithRoutes,
      vansWithoutDrivers: totalVans - vansWithDrivers,
    });
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
