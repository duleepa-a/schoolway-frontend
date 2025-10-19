import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PROXIMITY_RADIUS_KM = 40; // Configurable proximity radius in km

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper function to check if van route direction matches child's direction
function isDirectionMatching(
  childPickupLat: number,
  childPickupLng: number,
  schoolLat: number,
  schoolLng: number,
  vanStartLat: number,
  vanStartLng: number,
  vanEndLat: number,
  vanEndLng: number
): boolean {
  // Calculate distances: child pickup to van start and school to van end
  const childPickupToVanStart = calculateDistance(
    childPickupLat,
    childPickupLng,
    vanStartLat,
    vanStartLng
  );

  const schoolToVanEnd = calculateDistance(
    schoolLat,
    schoolLng,
    vanEndLat,
    vanEndLng
  );

  // Child pickup should be close to van's start, and school close to van's end
  // Allowing flexibility (within 10km each for general direction check)
  return childPickupToVanStart <= 10 && schoolToVanEnd <= 10;
}

// Helper function to check if van route is within proximity radius of both pickup and dropoff
function isVanWithinProximity(
  childPickupLat: number,
  childPickupLng: number,
  schoolLat: number,
  schoolLng: number,
  vanPathWaypoints: any[]
): boolean {
  if (!vanPathWaypoints || vanPathWaypoints.length === 0) return false;

  // Check if any waypoint/endpoint is within proximity radius of pickup
  let pickupProximityMet = false;
  for (const waypoint of vanPathWaypoints) {
    const distanceToPickup = calculateDistance(
      childPickupLat,
      childPickupLng,
      parseFloat(waypoint.latitude.toString()),
      parseFloat(waypoint.longitude.toString())
    );
    if (distanceToPickup <= PROXIMITY_RADIUS_KM) {
      pickupProximityMet = true;
      break;
    }
  }

  if (!pickupProximityMet) return false;

  // Check if any waypoint/endpoint is within proximity radius of dropoff (school)
  let dropoffProximityMet = false;
  for (const waypoint of vanPathWaypoints) {
    const distanceToDropoff = calculateDistance(
      schoolLat,
      schoolLng,
      parseFloat(waypoint.latitude.toString()),
      parseFloat(waypoint.longitude.toString())
    );
    if (distanceToDropoff <= PROXIMITY_RADIUS_KM) {
      dropoffProximityMet = true;
      break;
    }
  }

  return pickupProximityMet && dropoffProximityMet;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const childId = parseInt(params.id);

    // 1️⃣ Fetch the child's pickup location + school with first gate
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        School: {
          include: {
            Gate: {
              take: 1,
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const pickupLat = parseFloat(child.pickupLat.toString());
    const pickupLng = parseFloat(child.pickupLng.toString());

    // 2️⃣ Get school gate location (using first active gate)
    const gateLocation = child.School?.Gate?.[0];
    if (!gateLocation || gateLocation.latitude === null || gateLocation.longitude === null) {
      return NextResponse.json(
        { error: "School gate location not found" },
        { status: 400 }
      );
    }

    const schoolLat = gateLocation.latitude;
    const schoolLng = gateLocation.longitude;

    // 3️⃣ Fetch existing van requests for this child
    const existingRequests = await prisma.vanRequest.findMany({
      where: { childId },
      select: { vanId: true, status: true },
    });

    const requestMap = new Map(existingRequests.map(r => [r.vanId, r.status]));

    // 4️⃣ Fetch only APPROVED vans (status = 1) with assigned drivers and their paths
    const vans = await prisma.van.findMany({
      where: {
        hasDriver: true,
        status: 1,
        assignedDriverId: { not: null },
      },
      include: {
        UserProfile_Van_ownerIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        UserProfile_Van_assignedDriverIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        Path: {
          include: {
            WayPoint: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    // 5️⃣ Filter vans based on direction matching AND proximity
    const qualifiedVans = [];

    for (const van of vans) {
      if (!van.Path || !van.Path.WayPoint || van.Path.WayPoint.length < 2) {
        continue;
      }

      const vanStartWaypoint = van.Path.WayPoint[0];
      const vanEndWaypoint = van.Path.WayPoint[van.Path.WayPoint.length - 1];

      // Check if van's route direction matches child's direction
      const isDirectionGood = isDirectionMatching(
        pickupLat,
        pickupLng,
        schoolLat,
        schoolLng,
        parseFloat(vanStartWaypoint.latitude.toString()),
        parseFloat(vanStartWaypoint.longitude.toString()),
        parseFloat(vanEndWaypoint.latitude.toString()),
        parseFloat(vanEndWaypoint.longitude.toString())
      );

      if (!isDirectionGood) continue;

      // Check if van route is within proximity radius of both pickup and dropoff
      const isWithinProximity = isVanWithinProximity(
        pickupLat,
        pickupLng,
        schoolLat,
        schoolLng,
        van.Path.WayPoint
      );

      if (!isWithinProximity) continue;

      qualifiedVans.push(van);
    }

    // 6️⃣ Calculate distance and estimated fare for qualified vans
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLat},${pickupLng}&destinations=${schoolLat},${schoolLng}&key=${GOOGLE_MAPS_API_KEY}`;

    const distanceRes = await fetch(url);
    const distanceData = await distanceRes.json();

    if (
      distanceData.status !== "OK" ||
      !distanceData.rows[0]?.elements[0]?.distance
    ) {
      return NextResponse.json(
        { error: "Failed to calculate distance" },
        { status: 400 }
      );
    }

    const distanceInMeters = distanceData.rows[0].elements[0].distance.value;
    const distanceInKm = distanceInMeters / 1000;

    const vansWithEstimate = qualifiedVans.map((van) => {
      const requestStatus = requestMap.get(van.id);
      return {
        ...van,
        estimatedFare: Math.round(distanceInKm * van.studentRating * 100) / 100,
        distanceInKm,
        requestStatus: requestStatus || null,
      };
    });

    console.log(`Found ${vansWithEstimate.length} qualified vans for child ${childId}`);
    console.log(vansWithEstimate);

    return NextResponse.json(vansWithEstimate, { status: 200 });
  } catch (error) {
    console.error("Error fetching vans:", error);
    return NextResponse.json(
      { error: "Failed to fetch vans" },
      { status: 500 }
    );
  }
}
