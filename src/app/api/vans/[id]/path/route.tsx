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


export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const params = await context.params;
    const vanId = parseInt(params.id);
    
    // First get the path ID
    const van = await prisma.van.findFirst({
      where: {
        id: vanId,
      },
      select: {
        pathId: true
      }
    });

    if (!van || !van.pathId) {
      return NextResponse.json(null, { status: 404 });
    }

    // Then use raw query to get path data with geometry conversion
    const pathData = await prisma.$queryRaw`
      SELECT 
        p.id,
        p."totalDistance",
        p."estimatedDuration",
        ST_AsGeoJSON(p."routeStart")::json as "routeStart",
        ST_AsGeoJSON(p."routeEnd")::json as "routeEnd",
        ST_AsGeoJSON(p."routeGeometry")::json as "routeGeometry",
        ST_AsGeoJSON(p."boundingBox")::json as "boundingBox",
        json_agg(
          json_build_object(
            'id', w.id,
            'pathId', w."pathId",
            'name', w.name,
            'placeId', w."placeId",
            'latitude', w.latitude,
            'longitude', w.longitude,
            'order', w."order",
            'isStop', w."isStop",
            'createdAt', w."createdAt"
          ) ORDER BY w."order"
        ) as "WayPoint"
      FROM "Path" p
      LEFT JOIN "WayPoint" w ON p.id = w."pathId"
      WHERE p.id = ${van.pathId}
      GROUP BY p.id
    `;

    if (!pathData || !pathData[0]) {
      return NextResponse.json(null, { status: 404 });
    }

    // Transform coordinates to match frontend expectations
    const transformedPath = {
      ...pathData[0],
      routeStart: pathData[0].routeStart ? {
        lat: pathData[0].routeStart.coordinates[1],
        lng: pathData[0].routeStart.coordinates[0]
      } : null,
      routeEnd: pathData[0].routeEnd ? {
        lat: pathData[0].routeEnd.coordinates[1],
        lng: pathData[0].routeEnd.coordinates[0]
      } : null,
      WayPoint: pathData[0].WayPoint || []
    };

    console.log('path:', JSON.stringify(transformedPath, null, 2));
    return NextResponse.json(transformedPath);
    
  } catch (error) {
    console.error('Error fetching path:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } 
) {
  try {

    const params = await context.params;
    const vanId = parseInt(params.id);
    const body: RouteRequestBody = await req.json();

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
      include: { Path: true }
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

    // Create WKT representation of the route geometry
    const lineStringWKT = `LINESTRING(${routeGeometry
      .map(([lng, lat]) => `${lng} ${lat}`)
      .join(',')})`;

    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      try {
        // Debug existing path deletion
        if (existingVan.pathId) {
          console.log('Deleting existing waypoints and path:', existingVan.pathId);
          
          const deletedWaypoints = await tx.$executeRaw`
            DELETE FROM "WayPoint" WHERE "pathId" = ${existingVan.pathId} RETURNING *;
          `;
          console.log('Deleted waypoints:', deletedWaypoints);

          const deletedPath = await tx.$executeRaw`
            DELETE FROM "Path" WHERE id = ${existingVan.pathId} RETURNING *;
          `;
          console.log('Deleted path:', deletedPath);
        }

        // Debug path insertion
        console.log('Inserting new path with ID:', pathId);
        console.log('LineString WKT:', lineStringWKT);

        const insertedPath = await tx.$executeRaw`
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
            ST_SetSRID(ST_GeomFromText(${lineStringWKT}), 4326),
            ST_SetSRID(ST_MakePolygon(ST_MakeLine(ARRAY[
              ST_MakePoint(${minLng}, ${minLat}),
              ST_MakePoint(${maxLng}, ${minLat}),
              ST_MakePoint(${maxLng}, ${maxLat}),
              ST_MakePoint(${minLng}, ${maxLat}),
              ST_MakePoint(${minLng}, ${minLat})
            ])), 4326),
            ${totalDistance},
            ${estimatedDurationMinutes}
          ) RETURNING *;
        `;
        console.log('Path insertion result:', insertedPath);

        // Verify path exists
        const pathCheck = await tx.$queryRaw`
          SELECT 
            id, 
            ST_AsText("routeStart") as "routeStart",
            ST_AsText("routeEnd") as "routeEnd",
            ST_AsText("routeGeometry") as "routeGeometry",
            ST_AsText("boundingBox") as "boundingBox",
            "totalDistance",
            "estimatedDuration"
          FROM "Path" 
          WHERE id = ${pathId};
        `;
        console.log('Path check after insertion:', pathCheck);

        // Create waypoints if provided
        if (waypoints && waypoints.length > 0) {
          for (const waypoint of waypoints) {
            console.log('Inserting waypoint:', waypoint);
            const insertedWaypoint = await tx.$executeRaw`
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
              ) RETURNING *;
            `;
            console.log('Waypoint insertion result:', insertedWaypoint);
          }

          // Verify waypoints exist
          const waypointCheck = await tx.$queryRaw`
            SELECT 
              "pathId",
              name,
              "placeId",
              latitude,
              longitude,
              ST_AsText(location) as location,
              "order",
              "isStop",
              "createdAt"
            FROM "WayPoint" 
            WHERE "pathId" = ${pathId};
          `;
          console.log('Waypoint check after insertion:', waypointCheck);
        }

        // Update and verify van reference
        console.log('Updating van with pathId:', pathId);
        const updatedVan = await tx.van.update({
          where: { id: vanId },
          data: { pathId: pathId },
          include: {
            Path: {
              include: {
                WayPoint: {
                  orderBy: { order: 'asc' }
                }
              }
            }
          }
        });
        console.log('Updated van result:', updatedVan);

        return updatedVan;
      } catch (error) {
        console.error('Transaction error:', error);
        throw error; // Re-throw to trigger rollback
      }
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
