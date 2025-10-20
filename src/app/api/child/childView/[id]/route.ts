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

  try {
    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        Van: {
          include: {
            UserProfile_Van_ownerIdToUserProfile: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                mobile: true,
                dp: true,
                VanService: {
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
            UserProfile_Van_assignedDriverIdToUserProfile: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                mobile: true,
                dp: true,
                DriverProfile: {
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
            },
            Assistant: {
              select: {
                id: true,
                name: true,
                contact: true,
                nic: true,
                profilePic: true
              }
            }
          }
        },
        School: {
          select: {
            id: true,
            schoolName: true,
            address: true
          }
        },
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            dp: true
          }
        }
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // start of tomorrow

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1); // start of the next day

    const attendance = await prisma.childAttendance.findFirst({
      where: {
        childId: id,
        absenceDate: {
          gte: tomorrow,       // greater than or equal to start of tomorrow
          lt: dayAfterTomorrow // less than start of the next day
        }
      }
    });
    
    console.log('Fetched child info:', { child, attendance });
    
    return NextResponse.json({
      success: true,
      child: child,
      attendance: attendance
    });
  } catch (error) {
    console.error('Error fetching child info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch child information' },
      { status: 500 }
    );
  }
}