//Get all schools
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all schools from the database
    const schools = await prisma.school.findMany({
      orderBy: {
        schoolName: 'asc'
      }
    });

    // Process schools to extract location data for each one
    const processedSchools = await Promise.all(schools.map(async (school) => {
      // If school has location, try to extract it
      let locationData = null;
      if (school.location) {
        try {
          // For PostGIS point, we need a raw query to extract coordinates
          const locationResult = await prisma.$queryRaw`
            SELECT 
              ST_X(location::geometry) as lng,
              ST_Y(location::geometry) as lat
            FROM "School"
            WHERE id = ${school.id}
          `;

          if (locationResult && locationResult.length > 0) {
            locationData = {
              lat: locationResult[0].lat,
              lng: locationResult[0].lng
            };
          }
        } catch (err) {
          console.error(`Error extracting location coordinates for school ${school.id}:`, err);
        }
      }

      // Return the school data with location if available
      return {
        ...school,
        location: locationData,
      };
    }));

    return NextResponse.json(processedSchools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ 
      error: 'Error fetching schools', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
