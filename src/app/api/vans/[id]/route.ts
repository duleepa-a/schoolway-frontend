import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface PathQueryResult {
  id: string;
  totalDistance: number | null;
  estimatedDuration: number | null;
  routeStart: { type: string; coordinates: [number, number] } | null;
  routeEnd: { type: string; coordinates: [number, number] } | null;
  routeGeometry: { type: string; coordinates: number[][] } | null;
  boundingBox: { type: string; coordinates: number[][] } | null;
  WayPoint: Array<{
    id: number;
    pathId: string;
    name: string;
    placeId: string | null;
    latitude: number;
    longitude: number;
    order: number;
    isStop: boolean;
    createdAt: string;
  }> | null;
}

// GET /api/vans/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    console.log('Fetching van with ID:', id);
    const van = await prisma.van.findUnique({
      where: { id },
      include: {
        Assistant: true,
        UserProfile_Van_assignedDriverIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true,
            nic: true,
            mobile: true,
            dp: true,
          },
        },
      },
    });

    if (!van) {
      return NextResponse.json({ error: 'Van not found' }, { status: 404 });
    }

    // Fetch Path data if pathId exists
    let pathData = null;
    if (van.pathId) {
      try {
        const rawPathData = await prisma.$queryRaw<PathQueryResult[]>`
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
            ) FILTER (WHERE w.id IS NOT NULL) as "WayPoint"
          FROM "Path" p
          LEFT JOIN "WayPoint" w ON p.id = w."pathId"
          WHERE p.id = ${van.pathId}
          GROUP BY p.id
        `;

        if (rawPathData && rawPathData[0]) {
          const pathRecord = rawPathData[0];
          pathData = {
            id: pathRecord.id,
            totalDistance: pathRecord.totalDistance,
            estimatedDuration: pathRecord.estimatedDuration,
            routeStart: pathRecord.routeStart ? {
              lat: pathRecord.routeStart.coordinates[1],
              lng: pathRecord.routeStart.coordinates[0]
            } : null,
            routeEnd: pathRecord.routeEnd ? {
              lat: pathRecord.routeEnd.coordinates[1],
              lng: pathRecord.routeEnd.coordinates[0]
            } : null,
            routeGeometry: pathRecord.routeGeometry,
            boundingBox: pathRecord.boundingBox,
            WayPoint: pathRecord.WayPoint || []
          };
          
          console.log('✓ Path data fetched:', {
            pathId: pathData.id,
            waypointCount: pathData.WayPoint?.length || 0,
            hasStart: !!pathData.routeStart,
            hasEnd: !!pathData.routeEnd
          });
        }
      } catch (pathError) {
        console.error('Error fetching path data:', pathError);
      }
    }

    // Driver data is already fetched from UserProfile_Van_assignedDriverIdToUserProfile
    // No need to access DriverVanJobRequest anymore

    // Determine route status
    const hasRoute = !!pathData && (!!pathData.routeStart || !!pathData.routeEnd);
    const routeAssigned = !!pathData && !!pathData.routeStart && !!pathData.routeEnd && pathData.WayPoint.length > 0;
    
    // Calculate route status details
    const routeStatus = {
      hasStartLocation: !!pathData?.routeStart,
      hasEndLocation: !!pathData?.routeEnd,
      waypointCount: pathData?.WayPoint?.length || 0,
      isComplete: !!pathData?.routeStart && !!pathData?.routeEnd && (pathData?.WayPoint?.length || 0) > 0,
      isEmpty: !pathData || (!pathData.routeStart && !pathData.routeEnd && (!pathData.WayPoint || pathData.WayPoint.length === 0))
    };

    // Transform driver data to match expected format
    const transformedDriver = van.UserProfile_Van_assignedDriverIdToUserProfile ? {
      firstname: van.UserProfile_Van_assignedDriverIdToUserProfile.firstname || '',
      lastname: van.UserProfile_Van_assignedDriverIdToUserProfile.lastname || '',
      nic: van.UserProfile_Van_assignedDriverIdToUserProfile.nic || '',
      mobile: van.UserProfile_Van_assignedDriverIdToUserProfile.mobile || '',
      dp: van.UserProfile_Van_assignedDriverIdToUserProfile.dp || '',
    } : null;

    const transformedVan = {
      ...van,
      Path: pathData,
      driver: transformedDriver,
      hasRoute,
      routeAssigned,
      routeStatus,
    };

    console.log('✓ Fetched van:', {
      id: transformedVan.id,
      hasRoute: transformedVan.hasRoute,
      routeAssigned: transformedVan.routeAssigned,
      pathId: transformedVan.pathId,
      routeStatus: transformedVan.routeStatus
    });

    console.log('Van details:', JSON.stringify(transformedVan, null, 2));
    
    return NextResponse.json(transformedVan);
  } catch (error) {
    console.error('Error fetching van:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/vans/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const data = await req.json();

    const updatedVan = await prisma.van.update({
      where: { id },
      data: {
        makeAndModel: data.makeAndModel,
        seatingCapacity: data.seatingCapacity,
        studentRating: data.studentRating,
        privateRating: data.privateRating,
        salaryPercentage: data.salaryPercentage,
      },
    });
    return NextResponse.json(updatedVan, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}
