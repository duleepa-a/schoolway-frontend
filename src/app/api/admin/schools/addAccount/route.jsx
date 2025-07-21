//Create school 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    console.log(Object.keys(prisma)); 

  try {
    const body = await request.json();
    console.log("Request body:", body);
    
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
      console.log("Processing location data:", body.location);
      
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

    // First create the school without location using Prisma
    const school = await prisma.school.create({
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
          WHERE id = ${school.id}
        `;
        
        console.log(`Updated school ${school.id} with location: (${lng}, ${lat})`);
      } catch (err) {
        console.error("Error updating location with PostGIS:", err);
        // The school was already created, so we return success but with a warning
      }
    }

    // If location was provided, fetch the updated school record to include in response
    let updatedSchool = school;
    if (hasLocation) {
      try {
        // Use Prisma's findUnique to get the updated school with location
        const fetchedSchool = await prisma.school.findUnique({
          where: { id: school.id }
        });
        
        if (fetchedSchool) {
          updatedSchool = fetchedSchool;
        }
      } catch (err) {
        console.error("Error fetching updated school with location:", err);
      }
    }
    
    // Include a message about the location status in the response
    const response = {
      ...updatedSchool,
      locationAdded: hasLocation,
      locationCoordinates: hasLocation ? { lat, lng } : null,
      message: hasLocation ? 'School created with location data' : 'School created without location data'
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json({ 
      error: 'Error creating school', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
