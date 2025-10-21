// app/api/van-details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string[] }> } 
) 
{
  const resolvedParams = await params;
  const driverId = resolvedParams.id?.[0]; 

  if (!driverId) {
    return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 });
  }

  try {

    console.log(driverId)
    // Fetch the van assigned to this driver
    const van = await prisma.van.findFirst({
      where: { assignedDriverId: driverId },
      include: {
        UserProfile_Van_assignedDriverIdToUserProfile: true,
      },
    });

    console.log(van);

    if (!van) {
      return NextResponse.json({ vans: [] });
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: driverId },
    });

    const driverData = {
      id: driverId,
      ownerName: `${van.UserProfile_Van_assignedDriverIdToUserProfile?.firstname || ''} ${van.UserProfile_Van_assignedDriverIdToUserProfile?.lastname || ''}`.trim() || 'Unknown Driver',
      vehicleModel: van.makeAndModel,
      vehicleNumber: van.licensePlateNumber,
      capacity: van.seatingCapacity,
      rating: driverProfile?.averageRating || 4.7,
      profileImage: van.UserProfile_Van_assignedDriverIdToUserProfile?.dp || 'https://i.pravatar.cc/150?img=11',
      route: 'Unknown Route', // Optional: you can fetch route from TransportSession if needed
      phoneNumber: van.UserProfile_Van_assignedDriverIdToUserProfile?.mobile || '+94 71 000 0000',
    };

    return NextResponse.json({ driver: driverData });
  } catch (error) {
    console.error('Error fetching van details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
