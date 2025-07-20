//Update school 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request) {
  try {
    const body = await request.json();
    console.log("Update school request body:", body);
    
    // Check if school ID is provided
    if (!body.id) {
      return NextResponse.json({ 
        error: 'Missing school ID', 
        message: 'School ID is required for updating'
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.schoolName || !body.email || !body.contact || !body.address) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        message: 'School name, email, contact, and address are required'
      }, { status: 400 });
    }
    
    // Validate location data if provided
    let hasLocation = false;
    let lat = null;
    let lng = null;

    if (body.location) {
      console.log("Processing location data for update:", body.location);
      
      // Validate location data
      if (!body.location.lat || !body.location.lng) {
        return NextResponse.json({ 
          error: 'Invalid location data', 
          message: 'Location must include lat and lng coordinates'
        }, { status: 400 });
      }
      
      // Convert string values to numbers if needed
      lat = typeof body.location.lat === 'string' ? parseFloat(body.location.lat) : body.location.lat;
      lng = typeof body.location.lng === 'string' ? parseFloat(body.location.lng) : body.location.lng;
      
      // Check if coordinates are valid numbers
      if (isNaN(lat) || isNaN(lng)) {
        return NextResponse.json({ 
          error: 'Invalid location coordinates', 
          message: 'Latitude and longitude must be valid numbers'
        }, { status: 400 });
      }

      hasLocation = true;
    }

    // First check if the school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id: parseInt(body.id) }
    });

    if (!existingSchool) {
      return NextResponse.json({ 
        error: 'School not found', 
        message: `No school found with ID ${body.id}`
      }, { status: 404 });
    }

    // Update the school without location using Prisma
    const updatedSchool = await prisma.school.update({
      where: { id: parseInt(body.id) },
      data: {
        schoolName: body.schoolName,
        email: body.email,
        contact: body.contact,
        address: body.address,
        // Location will be updated separately with raw SQL
      }
    });
    
    // If location is provided, update with raw SQL for PostGIS
    if (hasLocation && lat !== null && lng !== null) {
      try {
        // Use Prisma's executeRaw to run a SQL update for the PostGIS Point
        await prisma.$executeRaw`
          UPDATE "School"
          SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
          WHERE id = ${updatedSchool.id}
        `;
        
        console.log(`Updated school ${updatedSchool.id} with new location: (${lng}, ${lat})`);
      } catch (err) {
        console.error("Error updating location with PostGIS:", err);
        // The school was already updated, so we return success but with a warning
      }
    }

    // Fetch the updated school record to include in response
    let finalSchool = updatedSchool;
    try {
      // Use Prisma's findUnique to get the updated school with location
      const fetchedSchool = await prisma.school.findUnique({
        where: { id: updatedSchool.id }
      });
      
      if (fetchedSchool) {
        finalSchool = fetchedSchool;
      }
    } catch (err) {
      console.error("Error fetching updated school with location:", err);
    }
    
    // Include a message about the location status in the response
    const response = {
      ...finalSchool,
      locationUpdated: hasLocation,
      locationCoordinates: hasLocation ? { lat, lng } : null,
      message: 'School information updated successfully'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating school:', error);
    return NextResponse.json({ 
      error: 'Error updating school', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}

// Also allow GET method to fetch school details by ID
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
