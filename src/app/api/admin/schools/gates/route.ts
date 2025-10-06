import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch gates for a specific school
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const gateId = searchParams.get('gateId');

    if (!schoolId && !gateId) {
      return NextResponse.json(
        { error: 'Missing schoolId or gateId parameter' },
        { status: 400 }
      );
    }

    let gates;

    if (gateId) {
      // Fetch specific gate
      const gate = await prisma.$queryRaw`
        SELECT 
          "id",
          "gateName",
          "description",
          "placeName",
          "address",
          "isActive",
          "schoolId",
          "createdAt",
          ST_AsGeoJSON("location") as "locationGeoJSON"
        FROM "Gate"
        WHERE "id" = ${parseInt(gateId)}
      `;

      // @ts-ignore
      const gateArray = gate as any[];
      const processedGate = gateArray[0] ? {
        ...gateArray[0],
        location: gateArray[0].locationGeoJSON ? (() => {
          try {
            const locationObject = JSON.parse(gateArray[0].locationGeoJSON);
            return {
              lat: locationObject.coordinates[1],
              lng: locationObject.coordinates[0]
            };
          } catch (e) {
            console.error('Error parsing gate location GeoJSON:', e);
            return null;
          }
        })() : null,
        locationGeoJSON: undefined
      } : null;

      return NextResponse.json({ gate: processedGate });
    } else {
      // Fetch all gates for a school
      gates = await prisma.$queryRaw`
        SELECT 
          "id",
          "gateName",
          "description",
          "placeName",
          "address",
          "isActive",
          "schoolId",
          "createdAt",
          ST_AsGeoJSON("location") as "locationGeoJSON"
        FROM "Gate"
        WHERE "schoolId" = ${parseInt(schoolId!)}
        ORDER BY "createdAt" DESC
      `;
    }

    // Process the results to convert GeoJSON strings to objects
    // @ts-ignore
    const processedGates = gates.map(gate => {
      try {
        return {
          ...gate,
          location: gate.locationGeoJSON ? (() => {
            try {
              const locationObject = JSON.parse(gate.locationGeoJSON);
              return {
                lat: locationObject.coordinates[1],
                lng: locationObject.coordinates[0]
              };
            } catch (e) {
              console.error('Error parsing gate location GeoJSON:', e);
              return null;
            }
          })() : null,
          locationGeoJSON: undefined
        };
      } catch (e) {
        console.error('Error processing gate:', e);
        return gate;
      }
    });

    return NextResponse.json({ gates: processedGates });
  } catch (error) {
    console.error('Error fetching gates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gates' },
      { status: 500 }
    );
  }
}

// POST - Create a new gate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schoolId, gateName, location, description, isActive, placeName, address } = body;

    // Validate required fields
    if (!schoolId || !gateName || !location || !location.lat || !location.lng) {
      return NextResponse.json(
        { error: 'Missing required fields: schoolId, gateName, and location are required' },
        { status: 400 }
      );
    }

    // Create the gate using raw SQL to handle PostGIS geometry
    const result = await prisma.$queryRaw`
      INSERT INTO "Gate" ("gateName", "description", "location", "placeName", "address", "isActive", "schoolId")
      VALUES (
        ${gateName}, 
        ${description || null}, 
        ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326),
        ${placeName || null},
        ${address || null},
        ${isActive !== undefined ? isActive : true},
        ${parseInt(schoolId)}
      )
      RETURNING 
        "id",
        "gateName",
        "description",
        "placeName",
        "address",
        "isActive",
        "schoolId",
        "createdAt",
        ST_AsGeoJSON("location") as "locationGeoJSON"
    `;

    // @ts-ignore
    const newGate = result[0] as any;
    const processedGate = {
      ...newGate,
      location: newGate.locationGeoJSON ? (() => {
        try {
          const locationObject = JSON.parse(newGate.locationGeoJSON);
          return {
            lat: locationObject.coordinates[1],
            lng: locationObject.coordinates[0]
          };
        } catch (e) {
          console.error('Error parsing new gate location GeoJSON:', e);
          return null;
        }
      })() : null,
      locationGeoJSON: undefined
    };

    return NextResponse.json(
      { 
        message: 'Gate created successfully',
        gate: processedGate 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gate:', error);
    return NextResponse.json(
      { error: 'Failed to create gate' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing gate
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, gateName, location, description, isActive, placeName, address } = body;

    // Validate required fields
    if (!id || !gateName) {
      return NextResponse.json(
        { error: 'Missing required fields: id and gateName are required' },
        { status: 400 }
      );
    }

    // Build the update query dynamically based on provided fields
    let updateFields = [`"gateName" = $1`];
    let queryParams = [gateName];
    let paramIndex = 2;
    
    if (description !== undefined) {
      updateFields.push(`"description" = $${paramIndex}`);
      queryParams.push(description);
      paramIndex++;
    }
    
    if (location && location.lat && location.lng) {
      updateFields.push(`"location" = ST_SetSRID(ST_MakePoint($${paramIndex}, $${paramIndex + 1}), 4326)`);
      queryParams.push(location.lng, location.lat);
      paramIndex += 2;
    }
    
    if (placeName !== undefined) {
      updateFields.push(`"placeName" = $${paramIndex}`);
      queryParams.push(placeName);
      paramIndex++;
    }
    
    if (address !== undefined) {
      updateFields.push(`"address" = $${paramIndex}`);
      queryParams.push(address);
      paramIndex++;
    }
    
    if (isActive !== undefined) {
      updateFields.push(`"isActive" = $${paramIndex}`);
      queryParams.push(isActive);
      paramIndex++;
    }

    // Add the gate ID as the last parameter
    queryParams.push(parseInt(id));

    const updateQuery = `
      UPDATE "Gate" 
      SET ${updateFields.join(', ')}
      WHERE "id" = $${paramIndex}
      RETURNING 
        "id",
        "gateName",
        "description",
        "placeName",
        "address",
        "isActive",
        "schoolId",
        "createdAt",
        ST_AsGeoJSON("location") as "locationGeoJSON"
    `;

    const result = await prisma.$queryRawUnsafe(updateQuery, ...queryParams);

    // @ts-ignore
    const updatedGate = result[0] as any;
    if (!updatedGate) {
      return NextResponse.json(
        { error: 'Gate not found' },
        { status: 404 }
      );
    }

    const processedGate = {
      ...updatedGate,
      location: updatedGate.locationGeoJSON ? (() => {
        try {
          const locationObject = JSON.parse(updatedGate.locationGeoJSON);
          return {
            lat: locationObject.coordinates[1],
            lng: locationObject.coordinates[0]
          };
        } catch (e) {
          console.error('Error parsing updated gate location GeoJSON:', e);
          return null;
        }
      })() : null,
      locationGeoJSON: undefined
    };

    return NextResponse.json(
      { 
        message: 'Gate updated successfully',
        gate: processedGate 
      }
    );
  } catch (error) {
    console.error('Error updating gate:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update gate',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gate
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gateId = searchParams.get('gateId');

    if (!gateId) {
      return NextResponse.json(
        { error: 'Missing gateId parameter' },
        { status: 400 }
      );
    }

    // Delete the gate
    const result = await prisma.$executeRaw`
      DELETE FROM "Gate" 
      WHERE "id" = ${parseInt(gateId)}
    `;

    if (result === 0) {
      return NextResponse.json(
        { error: 'Gate not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Gate deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting gate:', error);
    return NextResponse.json(
      { error: 'Failed to delete gate' },
      { status: 500 }
    );
  }
}
