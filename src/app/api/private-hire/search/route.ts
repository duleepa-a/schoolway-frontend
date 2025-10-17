// /api/private-hire/search.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDistance } from '@/utils/calculateDistance';

export async function POST(request: Request) {
  try {
    const {
      pickupLat,
      pickupLng,
      destinationLat,
      destinationLng,
      departureDate,
      returnDate,
      noOfPassengers,
    } = await request.json();

    if (
      pickupLat == null ||
      pickupLng == null ||
      destinationLat == null ||
      destinationLng == null ||
      !departureDate ||
      !noOfPassengers
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

  // Use a raw query to fetch vans and their path's routeStart geometry
  const vansWithPath = await prisma.$queryRaw`\
    SELECT 
      v.id, 
      v."registrationNumber", 
      v."licensePlateNumber", 
      v."makeAndModel", 
      v."seatingCapacity", 
      v."acCondition", 
      v."photoUrl", 
      v."ownerId", 
      v."privateRating", 
      ST_AsText(p."routeStart") as "routeStart"
    FROM "Van" v
    JOIN "Path" p ON v."pathId" = p.id
    WHERE p."routeStart" IS NOT NULL AND v.status = 1
  `;
  console.log('DEBUG vansWithPath (raw):', JSON.stringify(vansWithPath, null, 2));

    function extractLatLng(geometry: any): { lat: number; lng: number } | null {
      if (!geometry) return null;
      let geomStr = geometry;
      // If Buffer, convert to string
      if (typeof geometry === 'object' && geometry !== null && Buffer.isBuffer?.(geometry)) {
        geomStr = geometry.toString('utf8');
      }
      // GeoJSON Point object
      if (geomStr.type === 'Point' && Array.isArray(geomStr.coordinates)) {
        return { lat: geomStr.coordinates[1], lng: geomStr.coordinates[0] };
      }
      // WKT string POINT(lng lat)
      if (typeof geomStr === 'string' && geomStr.startsWith('POINT(')) {
        const match = geomStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (match) {
          return { lat: parseFloat(match[2]), lng: parseFloat(match[1]) };
        }
      }
      // Try parsing as JSON string
      if (typeof geomStr === 'string') {
        try {
          const obj = JSON.parse(geomStr);
          if (obj.type === 'Point' && Array.isArray(obj.coordinates)) {
            return { lat: obj.coordinates[1], lng: obj.coordinates[0] };
          }
        } catch (e) {}
      }
      return null;
    }

    const vansWithDistance = vansWithPath.map((van: any) => {
      const routeStart = van.routeStart;
      const coords = extractLatLng(routeStart);
      let pickupDistance = null;
      let tripDistance = null;
      if (coords) {
        pickupDistance = calculateDistance(pickupLat, pickupLng, coords.lat, coords.lng);
        tripDistance = calculateDistance(pickupLat, pickupLng, destinationLat, destinationLng);
      }
      return {
        ...van,
        pickupDistance,
        tripDistance
      };
    });

    vansWithDistance.sort((a, b) => {
      if (a.pickupDistance == null && b.pickupDistance == null) return 0;
      if (a.pickupDistance == null) return 1;
      if (b.pickupDistance == null) return -1;
      return a.pickupDistance - b.pickupDistance;
    });

    return NextResponse.json({ vans: vansWithDistance }, { status: 200 });
  } catch (error: any) {
    console.error('Search Vans Error:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}