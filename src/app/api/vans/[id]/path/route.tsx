import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

interface RouteRequestBody {
  routeStart: { lat: number; lng: number };
  routeEnd: { lat: number; lng: number };
  routeGeometry: number[][];
  waypoints: Array<{
    name: string;
    placeId: string;
    latitude: number;
    longitude: number;
    order: number;
    isStop: boolean;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vanId = parseInt(params.id);
    const body: RouteRequestBody = await req.json();
    console.log('POST /api/vans/[id]/path - Request body:', body);

    const {
      routeStart,
      routeEnd,
      routeGeometry,
      waypoints
    } = body;

    // Validate required fields
    if (!routeStart || !routeEnd || !routeGeometry || !Array.isArray(routeGeometry)) {
      console.log('Missing required fields:', {
        routeStart: !!routeStart,
        routeEnd: !!routeEnd,
        routeGeometry: !!routeGeometry
      });
      return NextResponse.json({ error: 'Missing required fields: routeStart, routeEnd, and routeGeometry are required' }, { status: 400 });
    }

    // Validate van ID
    if (isNaN(vanId)) {
      return NextResponse.json({ error: 'Invalid van ID' }, { status: 400 });
    }

    // Check if van exists
    const existingVan = await prisma.van.findUnique({
      where: { id: vanId },
      include: { path: true }
    });

    if (!existingVan) {
      return NextResponse.json({ error: 'Van not found' }, { status: 404 });
    }

    // Calculate total distance (rough estimation using straight-line distance between consecutive points)
    let totalDistance = 0;
    for (let i = 0; i < routeGeometry.length - 1; i++) {
      const [lng1, lat1] = routeGeometry[i];
      const [lng2, lat2] = routeGeometry[i + 1];
      
      // Haversine formula for distance calculation
      const R = 6371; // Earth's radius in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      totalDistance += distance;
    }

    // Rough estimation: 30 km/h average speed in urban areas
    const estimatedDurationMinutes = Math.round((totalDistance / 30) * 60);

    // Create bounding box from all coordinates
    const allLngs = routeGeometry.map(coord => coord[0]);
    const allLats = routeGeometry.map(coord => coord[1]);
    const minLng = Math.min(...allLngs);
    const maxLng = Math.max(...allLngs);
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);

    // Generate a unique ID for the path
    const pathId = `path_${vanId}_${Date.now()}`;

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // If van already has a path, delete it first (along with its waypoints)
      if (existingVan.pathId) {
        await tx.wayPoint.deleteMany({
          where: { pathId: existingVan.pathId }
        });
        await tx.path.delete({
          where: { id: existingVan.pathId }
        });
      }

      // Create the path with PostGIS geometry functions
      await tx.$executeRaw`
        INSERT INTO "Path" (
          id, 
          "routeStart", 
          "routeEnd", 
          "routeGeometry", 
          "boundingBox", 
          "totalDistance", 
          "estimatedDuration"
        ) VALUES (
          ${pathId},
          ST_SetSRID(ST_MakePoint(${routeStart.lng}, ${routeStart.lat}), 4326),
          ST_SetSRID(ST_MakePoint(${routeEnd.lng}, ${routeEnd.lat}), 4326),
          ST_SetSRID(ST_MakeLine(ARRAY[${Prisma.join(
            routeGeometry.map(coord => 
              Prisma.sql`ST_MakePoint(${coord[0]}, ${coord[1]})`
            )
          )}]), 4326),
          ST_SetSRID(ST_MakePolygon(ST_MakeLine(ARRAY[
            ST_MakePoint(${minLng}, ${minLat}),
            ST_MakePoint(${maxLng}, ${minLat}),
            ST_MakePoint(${maxLng}, ${maxLat}),
            ST_MakePoint(${minLng}, ${maxLat}),
            ST_MakePoint(${minLng}, ${minLat})
          ])), 4326),
          ${totalDistance},
          ${estimatedDurationMinutes}
        )
      `;

      // Create waypoints if provided
      if (waypoints && waypoints.length > 0) {
        for (const waypoint of waypoints) {
          await tx.$executeRaw`
            INSERT INTO "WayPoint" (
              "pathId",
              name,
              "placeId",
              latitude,
              longitude,
              location,
              "order",
              "isStop",
              "createdAt"
            ) VALUES (
              ${pathId},
              ${waypoint.name},
              ${waypoint.placeId || null},
              ${waypoint.latitude},
              ${waypoint.longitude},
              ST_SetSRID(ST_MakePoint(${waypoint.longitude}, ${waypoint.latitude}), 4326),
              ${waypoint.order},
              ${waypoint.isStop},
              NOW()
            )
          `;
        }
      }

      // Update van to reference the new path
      const updatedVan = await tx.van.update({
        where: { id: vanId },
        data: { pathId: pathId },
        include: {
          path: {
            include: {
              waypoints: {
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      });

      return updatedVan;
    });

    console.log('Path added to van successfully:', { vanId, pathId });
    return NextResponse.json({
      message: 'Route created successfully',
      van: result,
      pathId: pathId,
      totalDistance: totalDistance,
      estimatedDuration: estimatedDurationMinutes
    }, { status: 201 });

  } catch (error) {
    console.error('[ADD PATH ERROR]', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Handle unique constraint violations
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ 
          error: 'A path with this configuration already exists' 
        }, { status: 409 });
      }
      
      // Handle foreign key constraint violations
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json({ 
          error: 'Invalid reference to related data' 
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
