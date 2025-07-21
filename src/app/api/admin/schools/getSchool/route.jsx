//Get school by ID
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Get the school ID from the URL search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Missing school ID', 
        message: 'School ID is required'
      }, { status: 400 });
    }
    
    // Parse ID as integer
    const schoolId = parseInt(id);
    
    if (isNaN(schoolId)) {
      return NextResponse.json({ 
        error: 'Invalid school ID', 
        message: 'School ID must be a valid integer'
      }, { status: 400 });
    }

    // Fetch the school from the database
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!school) {
      return NextResponse.json({ 
        error: 'School not found', 
        message: `No school found with ID ${schoolId}`
      }, { status: 404 });
    }

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
          WHERE id = ${schoolId}
        `;

        if (locationResult && locationResult.length > 0) {
          locationData = {
            lat: locationResult[0].lat,
            lng: locationResult[0].lng
          };
        }
      } catch (err) {
        console.error("Error extracting location coordinates:", err);
      }
    }

    // Return the school data with location if available
    return NextResponse.json({
      ...school,
      location: locationData,
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    return NextResponse.json({ 
      error: 'Error fetching school', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
