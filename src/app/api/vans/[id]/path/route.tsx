// app/api/vans/[id]/path/route.ts (App Router)
// or pages/api/vans/[id]/path.ts (Pages Router)

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

// Create or update van path
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vanId = parseInt(params.id);
    const body = await request.json();
    const { waypoints, totalDistance, estimatedDuration } = body;

    if (!waypoints || waypoints.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 waypoints are required' },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Check if van exists
      const van = await tx.van.findUnique({ where: { id: vanId } });
      if (!van) {
        throw new Error('Van not found');
      }

      // Create LineString from waypoints
      const coordinates = waypoints
        .map((wp: any) => `${wp.longitude} ${wp.latitude}`)
        .join(',');
      const lineStringWKT = `LINESTRING(${coordinates})`;

      // Create bounding box
      const lngs = waypoints.map((wp: any) => wp.longitude);
      const lats = waypoints.map((wp: any) => wp.latitude);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      
      const buffer = 0.01; // ~1km buffer
      const boundingBoxWKT = `POLYGON((${minLng - buffer} ${minLat - buffer}, ${maxLng + buffer} ${minLat - buffer}, ${maxLng + buffer} ${maxLat + buffer}, ${minLng - buffer} ${maxLat + buffer}, ${minLng - buffer} ${minLat - buffer}))`;

      // Start and end points
      const startPoint = `POINT(${waypoints[0].longitude} ${waypoints[0].latitude})`;
      const endPoint = `POINT(${waypoints[waypoints.length - 1].longitude} ${waypoints[waypoints.length - 1].latitude})`;

      let pathId: string;

      if (van.pathId) {
        // Update existing path
        pathId = van.pathId;
        
        // Delete existing waypoints
        await tx.wayPoints.deleteMany({
          where: { pathId: van.pathId }
        });

        // Update path with new geometry
        await tx.$executeRaw`
          UPDATE "Path" 
          SET 
            "routeStart" = ST_GeomFromText(${startPoint}, 4326),
            "routeEnd" = ST_GeomFromText(${endPoint}, 4326),
            "routeGeometry" = ST_GeomFromText(${lineStringWKT}, 4326),
            "boundingBox" = ST_GeomFromText(${boundingBoxWKT}, 4326),
            "totalDistance" = ${totalDistance || 0},
            "estimatedDuration" = ${estimatedDuration || 0},
            "updatedAt" = NOW()
          WHERE id = ${van.pathId}
        `;
      } else {
        // Create new path
        pathId = nanoid();
        
        await tx.$executeRaw`
          INSERT INTO "Path" (
            id, "routeStart", "routeEnd", "routeGeometry", 
            "boundingBox", "totalDistance", "estimatedDuration", 
            "createdAt", "updatedAt"
          ) VALUES (
            ${pathId},
            ST_GeomFromText(${startPoint}, 4326),
            ST_GeomFromText(${endPoint}, 4326),
            ST_GeomFromText(${lineStringWKT}, 4326),
            ST_GeomFromText(${boundingBoxWKT}, 4326),
            ${totalDistance || 0},
            ${estimatedDuration || 0},
            NOW(),
            NOW()
          )
        `;

        // Update van to reference the new path
        await tx.van.update({
          where: { id: vanId },
          data: { pathId: pathId }
        });
      }

      // Create new waypoints
      for (let i = 0; i < waypoints.length; i++) {
        const wp = waypoints[i];
        const pointWKT = `POINT(${wp.longitude} ${wp.latitude})`;

        await tx.$executeRaw`
          INSERT INTO "WayPoints" (
            "pathId", name, "placeId", latitude, longitude, 
            location, "order", "isStop", notes, "createdAt"
          ) VALUES (
            ${pathId}, ${wp.name}, ${wp.placeId || null}, 
            ${wp.latitude}, ${wp.longitude}, 
            ST_GeomFromText(${pointWKT}, 4326), 
            ${i}, ${wp.isStop !== false}, ${wp.notes || null}, NOW()
          )
        `;
      }

      return pathId;
    });

    return NextResponse.json({
      success: true,
      pathId: result,
      message: 'Path saved successfully'
    });

  } catch (error) {
    console.error('Error saving van path:', error);
    return NextResponse.json(
      { error: 'Failed to save van path' },
      { status: 500 }
    );
  }
}

// Get van path
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vanId = parseInt(params.id);

    // Get van with path info
    const van = await prisma.van.findUnique({
      where: { id: vanId },
      select: { pathId: true, registrationNumber: true, makeAndModel: true }
    });

    if (!van || !van.pathId) {
      return NextResponse.json(
        { error: 'No path found for this van' },
        { status: 404 }
      );
    }

    // Get path with spatial data
    const pathData = await prisma.$queryRaw<any[]>`
      SELECT 
        p.*,
        ST_AsGeoJSON(p."routeStart") as route_start_json,
        ST_AsGeoJSON(p."routeEnd") as route_end_json,
        ST_AsGeoJSON(p."routeGeometry") as route_geometry_json,
        ST_AsGeoJSON(p."boundingBox") as bounding_box_json,
        ST_Length(ST_Transform(p."routeGeometry", 3857)) as calculated_distance
      FROM "Path" p
      WHERE p.id = ${van.pathId}
    `;

    if (!pathData.length) {
      return NextResponse.json(
        { error: 'Path data not found' },
        { status: 404 }
      );
    }

    // Get waypoints
    const waypoints = await prisma.wayPoints.findMany({
      where: { pathId: van.pathId },
      orderBy: { order: 'asc' }
    });

    const path = pathData[0];
    
    return NextResponse.json({
      success: true,
      data: {
        id: path.id,
        totalDistance: path.totalDistance,
        estimatedDuration: path.estimatedDuration,
        calculatedDistance: path.calculated_distance,
        routeStartGeoJSON: path.route_start_json ? JSON.parse(path.route_start_json) : null,
        routeEndGeoJSON: path.route_end_json ? JSON.parse(path.route_end_json) : null,
        routeGeometryGeoJSON: path.route_geometry_json ? JSON.parse(path.route_geometry_json) : null,
        boundingBoxGeoJSON: path.bounding_box_json ? JSON.parse(path.bounding_box_json) : null,
        waypoints: waypoints.map(wp => ({
          id: wp.id,
          name: wp.name,
          placeId: wp.placeId,
          latitude: wp.latitude,
          longitude: wp.longitude,
          order: wp.order,
          isStop: wp.isStop,
          notes: wp.notes
        })),
        van: {
          registrationNumber: van.registrationNumber,
          makeAndModel: van.makeAndModel
        }
      }
    });

  } catch (error) {
    console.error('Error fetching van path:', error);
    return NextResponse.json(
      { error: 'Failed to fetch van path' },
      { status: 500 }
    );
  }
}

// Delete van path
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vanId = parseInt(params.id);

    await prisma.$transaction(async (tx) => {
      const van = await tx.van.findUnique({
        where: { id: vanId },
        select: { pathId: true }
      });

      if (van?.pathId) {
        // Delete waypoints first
        await tx.wayPoints.deleteMany({
          where: { pathId: van.pathId }
        });

        // Delete path
        await tx.path.delete({
          where: { id: van.pathId }
        });

        // Remove path reference from van
        await tx.van.update({
          where: { id: vanId },
          data: { pathId: null }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Path deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting van path:', error);
    return NextResponse.json(
      { error: 'Failed to delete van path' },
      { status: 500 }
    );
  }
}