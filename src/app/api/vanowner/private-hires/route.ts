import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getPlaceId } from '@/utils/getPlaceId';
import { getPlaceName } from '@/utils/getPlaceName';

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) throw new Error('Google Maps API key not set');

    const hires = await prisma.privateHire.findMany({
      include: {
        Van: {
          select: {
            id: true,
            registrationNumber: true,
            licensePlateNumber: true,
            makeAndModel: true,
            seatingCapacity: true,
            acCondition: true,
            photoUrl: true,
            ownerId: true,
            assignedDriverId: true,
            privateRating: true,
            status: true,
          },
          where: {
            status: 1, // assuming 1 means active
          },
        },
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            mobile: true,
            dp: true,
          },
        },
      },
    });

    const hiresWithPlaceIds = await Promise.all(
      hires.map(async (hire: any) => {
        try {
          console.log(`Processing hire ID: ${hire.id}`);

          if (
            hire.pickupLat == null ||
            hire.pickupLng == null ||
            hire.destinationLat == null ||
            hire.destinationLng == null
          ) {
            console.warn('Missing coordinates for hire:', hire.id, {
              pickupLat: hire.pickupLat,
              pickupLng: hire.pickupLng,
              destinationLat: hire.destinationLat,
              destinationLng: hire.destinationLng,
            });
            return {
              ...hire,
              pickupPlaceId: null,
              destinationPlaceId: null,
            };
          }

          const pickupPlaceId = await getPlaceName(hire.pickupLat, hire.pickupLng, apiKey);
          const destinationPlaceId = await getPlaceName(hire.destinationLat, hire.destinationLng, apiKey);

          if (!pickupPlaceId || !destinationPlaceId) {
            console.warn(`Place ID lookup failed for hire ${hire.id}`, {
              pickupLat: hire.pickupLat,
              pickupLng: hire.pickupLng,
              pickupPlaceId,
              destinationLat: hire.destinationLat,
              destinationLng: hire.destinationLng,
              destinationPlaceId,
            });
          }

          return {
            ...hire,
            pickupPlaceId,
            destinationPlaceId,
          };
        } catch (err) {
          console.error(`Error processing hire ${hire.id}:`, err);
          return {
            ...hire,
            pickupPlaceId: null,
            destinationPlaceId: null,
          };
        }
      })
    );

  console.log('Backend payload:', JSON.stringify(hiresWithPlaceIds, null, 2));
  return NextResponse.json(hiresWithPlaceIds, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching private hires:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
