import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolName, email, contact, address, location } = body;

    // Validate required fields
    if (!schoolName || !email || !contact || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a PostGIS point from the latitude and longitude
    let locationPoint = null;
    if (location && location.lat && location.lng) {
      // Using raw SQL to create a PostGIS point
      locationPoint = { 
        create: {
          point: {
            type: 'Point',
            coordinates: [location.lng, location.lat],
            crs: { type: 'name', properties: { name: 'EPSG:4326' } }
          }
        }
      };
    }

    // Create the school in the database
    const school = await prisma.$executeRaw`
      INSERT INTO "School" ("schoolName", "email", "contact", "address", "location")
      VALUES (${schoolName}, ${email}, ${contact}, ${address}, 
        ${location ? `ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326)` : null})
      RETURNING *
    `;

    return NextResponse.json(
      { 
        message: 'School added successfully',
        school 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding school:', error);
    
    // Check for duplicate email error
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { error: 'A school with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add school' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Query that returns schools with location in GeoJSON format
    const schools = await prisma.$queryRaw`
      SELECT 
        "id", 
        "schoolName", 
        "email", 
        "contact", 
        "address",
        ST_AsGeoJSON("location") as "locationGeoJSON"
      FROM "School"
    `;
    
    // Process the results to convert GeoJSON strings to objects
    const processedSchools = schools.map(school => {
      try {
        if (school.locationGeoJSON) {
          const locationObject = JSON.parse(school.locationGeoJSON);
          return {
            ...school,
            location: {
              lat: locationObject.coordinates[1], 
              lng: locationObject.coordinates[0]
            },
            locationGeoJSON: undefined
          };
        }
        return school;
      } catch (e) {
        console.error('Error parsing GeoJSON:', e);
        return school;
      }
    });

    return NextResponse.json(processedSchools, { status: 200 });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}
