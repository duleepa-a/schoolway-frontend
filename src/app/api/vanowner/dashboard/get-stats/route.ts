import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Get current session to ensure authorized access
    console.log("Fetching session...");
    const session = await getServerSession(authOptions);
    console.log("Session:", session ? "Found" : "Not found");
    
    // Get owner ID from URL search params
    const searchParams = req.nextUrl.searchParams;
    const ownerId = searchParams.get('ownerId');
    console.log("Owner ID from params:", ownerId);
    
    // If no ownerId provided and we have a session, use the session's user ID
    let ownerIdToUse = ownerId;
    if (!ownerIdToUse && session && session.user) {
      ownerIdToUse = session.user.id;
    }
    console.log("Using owner ID:", ownerIdToUse);
    
    if (!ownerIdToUse) {
      return NextResponse.json(
        { error: 'Owner ID is required' },
        { status: 400 }
      );
    }
    
    console.log("Querying database for van counts...");
    
    // Fetch all counts in parallel for better performance
    try {
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
      
      console.log("Database query complete:", { totalVans, vansWithRoutes, vansWithDrivers });
      
      // Return dashboard statistics
      return NextResponse.json({
        totalVans,
        vansWithRoutes,
        vansWithDrivers,
        vansWithoutRoutes: totalVans - vansWithRoutes,
        vansWithoutDrivers: totalVans - vansWithDrivers,
      });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return NextResponse.json(
        { error: `Database query failed: ${dbError instanceof Error ? dbError.message : String(dbError)}` },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: `Failed to fetch dashboard data: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
