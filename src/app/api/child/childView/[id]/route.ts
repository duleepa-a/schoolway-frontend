import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const child = await prisma.child.findUnique({
    where: { id },
    include: {
      Van: {
        include: {
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
      },
      School: true,
      UserProfile: true,
    },
  });

  if (!child) {
    return NextResponse.json({ error: 'Child not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...child,
  });
}