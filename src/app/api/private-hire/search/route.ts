// /api/private-hire/search.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDistance } from '@/utils/calculateDistance';

// Define TypeScript interfaces for the vans
interface VanFromDB {
  id: number;
  registrationNumber: string;
  licensePlateNumber: string;
  makeAndModel: string;
  seatingCapacity: number;
  acCondition: boolean;
  photoUrl: string | null;
  ownerId: string;
  privateRating: number | null;
  routeStart: string | null;
  averageRating: number | null;
  contactNo: string | null;
}

interface VanWithDistance extends VanFromDB {
  pickupDistance: number | null;
  tripDistance: number | null;
  warning: string | null;
}

export async function POST(request: Request) {
  try {
    const {
      pickupLat,
      pickupLng,
      destinationLat,
      destinationLng,
      departureDate,
      returnDate, // We're extracting this but not using it in validation currently
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
  const vansWithPath = await prisma.$queryRaw<VanFromDB[]>`\
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
      ST_AsText(p."routeStart") as "routeStart",
      vs."averageRating",
      vs."contactNo"
    FROM "Van" v
    JOIN "Path" p ON v."pathId" = p.id
    LEFT JOIN "VanService" vs ON v."ownerId" = vs."userId"
    WHERE p."routeStart" IS NOT NULL AND v.status = 1
  `;
  console.log('DEBUG vansWithPath (raw):', JSON.stringify(vansWithPath, null, 2));

    function extractLatLng(geometry: unknown): { lat: number; lng: number } | null {
      if (!geometry) return null;
      
      // For GeoJSON Point objects
      if (typeof geometry === 'object' && geometry !== null && !Buffer.isBuffer(geometry) &&
          'type' in geometry && 'coordinates' in geometry &&
          geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
        const point = geometry as { type: string; coordinates: number[] };
        return { lat: point.coordinates[1], lng: point.coordinates[0] };
      }
      
      // Convert Buffer to string if needed
      let geomStr: string;
      if (typeof geometry === 'object' && geometry !== null && Buffer.isBuffer(geometry)) {
        geomStr = geometry.toString('utf8');
      } else if (typeof geometry === 'string') {
        geomStr = geometry;
      } else {
        return null; // Unsupported type
      }
      
      // WKT string POINT(lng lat)
      if (geomStr.startsWith('POINT(')) {
        const match = geomStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (match) {
          return { lat: parseFloat(match[2]), lng: parseFloat(match[1]) };
        }
      }
      
      // Try parsing as JSON string
      try {
        const obj = JSON.parse(geomStr);
        if (obj && typeof obj === 'object' && obj.type === 'Point' && Array.isArray(obj.coordinates)) {
          return { lat: obj.coordinates[1], lng: obj.coordinates[0] };
        }
      } catch {
        // Parsing failed, ignore and continue
      }
      
      return null;
    }

    const vansWithDistance: VanWithDistance[] = vansWithPath.map((van: VanFromDB) => {
      const routeStart = van.routeStart;
      const coords = extractLatLng(routeStart);
      let pickupDistance = null;
      let tripDistance = null;
      if (coords) {
        pickupDistance = calculateDistance(pickupLat, pickupLng, coords.lat, coords.lng);
        tripDistance = calculateDistance(pickupLat, pickupLng, destinationLat, destinationLng);
      }
      
      // Check passenger count and add warning directly to each van object
      let capacityWarning = null;
      if (noOfPassengers > van.seatingCapacity) {
        capacityWarning = `Requested passengers (${noOfPassengers}) exceed van seating capacity (${van.seatingCapacity})`;
      }
      
      return {
        ...van,
        pickupDistance,
        tripDistance,
        warning: capacityWarning // Add warning to each van object
      };
    });

    vansWithDistance.sort((a, b) => {
      if (a.pickupDistance == null && b.pickupDistance == null) return 0;
      if (a.pickupDistance == null) return 1;
      if (b.pickupDistance == null) return -1;
      return a.pickupDistance - b.pickupDistance;
    });

    return NextResponse.json({ vans: vansWithDistance }, { status: 200 });
  } catch (error: unknown) {
    console.error('Search Vans Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}