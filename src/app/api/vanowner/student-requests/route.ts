import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserIdFromSession(): Promise<string | null> {
  try {
    console.log('[STUDENT_REQUESTS] Getting session');
    const session = await getServerSession(authOptions);
    console.log('[STUDENT_REQUESTS] Session user ID:', session?.user?.id);
    return session?.user?.id ?? null;
  } catch (error) {
    console.error('[STUDENT_REQUESTS] Error getting user ID from session:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  console.log('[STUDENT_REQUESTS] Received GET request');
  try {
    const ownerId = await getUserIdFromSession();
    console.log('[STUDENT_REQUESTS] Owner ID from session:', ownerId);
    
    if (!ownerId) {
      console.log('[STUDENT_REQUESTS] Unauthorized - No owner ID found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[STUDENT_REQUESTS] Querying VanRequest for owner:', ownerId);
    
    try {
      const requests = await prisma.vanRequest.findMany({
        where: {
          status: 'PENDING',
          Van: {
            ownerId: ownerId,
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          Child: {
            include: {
              UserProfile: true, 
              School: true,
            },
          },
          Van: true,
        },
      });

      console.log('[STUDENT_REQUESTS] Found', requests.length, 'request(s)');
      
      // Debug first request if any
      if (requests.length > 0) {
        console.log('[STUDENT_REQUESTS] Sample request:', {
          id: requests[0].id,
          vanId: requests[0].vanId,
          childId: requests[0].childId,
          status: requests[0].status,
          hasVan: !!requests[0].Van,
          hasChild: !!requests[0].Child
        });
      }
      
      const payload = requests.map((r) => {
        try {
          // Safely access nested properties with null checks
          return {
            id: r.id,
            status: r.status,
            estimatedFare: r.estimatedFare,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            van: {
              id: r.vanId,
              registrationNumber: r.Van?.registrationNumber ?? null,
              makeAndModel: r.Van?.makeAndModel ?? null,
              licensePlateNumber: r.Van?.licensePlateNumber ?? null,
            },
            child: {
              id: r.Child?.id,
              name: r.Child?.name ?? 'Unknown',
              grade: r.Child?.grade ?? 'N/A',
              profilePicture: r.Child?.profilePicture ?? null,
              pickupAddress: r.Child?.pickupAddress ?? null,
              specialNotes: r.Child?.specialNotes ?? null,
              school: r.Child?.School ? { id: r.Child.School.id, name: r.Child.School.schoolName } : null,
              parent: r.Child?.UserProfile
                ? { 
                    id: r.Child.UserProfile.id, 
                    email: r.Child.UserProfile.email ?? null, 
                    firstname: r.Child.UserProfile.firstname ?? null 
                  }
                : null,
            },
          };
        } catch (mapError) {
          console.error('[STUDENT_REQUESTS] Error mapping request:', r.id, mapError);
          // Return a minimal object for this item if mapping fails
          return {
            id: r.id,
            status: r.status || 'UNKNOWN',
            estimatedFare: r.estimatedFare || 0,
            createdAt: r.createdAt,
            van: { id: r.vanId },
            child: { id: r.childId || 0 },
            error: mapError instanceof Error ? mapError.message : 'Error mapping data'
          };
        }
      });

      console.log('[STUDENT_REQUESTS] Successfully mapped payload, returning', payload.length, 'items');
      return NextResponse.json(payload);
    } catch (prismaError) {
      console.error('[STUDENT_REQUESTS] Prisma error:', prismaError);
      return NextResponse.json({ 
        error: 'Database query failed',
        details: prismaError instanceof Error ? prismaError.message : 'Unknown prisma error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[STUDENT_REQUESTS] Unhandled error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: errorMessage,
      stack: errorStack
    }, { status: 500 });
  }
}
