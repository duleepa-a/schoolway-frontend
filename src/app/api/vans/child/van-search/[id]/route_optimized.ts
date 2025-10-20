import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

// Helper function to get minimum distance from a point to any waypoint
function getMinDistanceToWaypoints(
  pointLat: number,
  pointLng: number,
  waypoints: any[]
): number {
  if (!waypoints || waypoints.length === 0) return Infinity;

  let minDistance = Infinity;
  for (const waypoint of waypoints) {
    const distance = calculateDistance(
      pointLat,
      pointLng,
      parseFloat(waypoint.latitude.toString()),
      parseFloat(waypoint.longitude.toString())
    );
    minDistance = Math.min(minDistance, distance);
  }
  return minDistance;
}

// Helper function to check if van route direction matches child's direction
function isDirectionMatching(
  childPickupLat: number,
  childPickupLng: number,
  schoolLat: number,
  schoolLng: number,
  vanPathWaypoints: any[]
): boolean {
  if (!vanPathWaypoints || vanPathWaypoints.length < 2) return false;

  // Get the first and last waypoints of the van's route
  const vanStartWaypoint = vanPathWaypoints[0];
  const vanEndWaypoint = vanPathWaypoints[vanPathWaypoints.length - 1];

  // Calculate distances: child pickup to van start and school to van end
  const childPickupToVanStart = calculateDistance(
    childPickupLat,
    childPickupLng,
    parseFloat(vanStartWaypoint.latitude.toString()),
    parseFloat(vanStartWaypoint.longitude.toString())
  );

  const schoolToVanEnd = calculateDistance(
    schoolLat,
    schoolLng,
    parseFloat(vanEndWaypoint.latitude.toString()),
    parseFloat(vanEndWaypoint.longitude.toString())
  );

  // Child pickup should be closer to van's start, and school closer to van's end
  // Allowing flexibility (within 5km each)
  return childPickupToVanStart < 5 && schoolToVanEnd < 5;
}

// Helper function to check if van passes near child's pickup location
function isVanNearPickup(
  childPickupLat: number,
  childPickupLng: number,
  vanPathWaypoints: any[]
): boolean {
  if (!vanPathWaypoints || vanPathWaypoints.length === 0) return false;

  // Check if any waypoint is within 10km of child's pickup
  const minDistance = getMinDistanceToWaypoints(
    childPickupLat,
    childPickupLng,
    vanPathWaypoints
  );

  return minDistance <= 1000;
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
    const schoolLocation = await prisma.school.findUnique({
      where: { id: child.schoolID },
    });

    if (!schoolLocation) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    const gateLocation = child.School?.Gate?.[0];
    if (!gateLocation || gateLocation.latitude === null || gateLocation.longitude === null) {
      return NextResponse.json(
        { error: "School gate location not found" },
        { status: 400 }
      );
    }

    const schoolLat = gateLocation.latitude;
    const schoolLng = gateLocation.longitude;

    // 3️⃣ Fetch only APPROVED vans (status = 1) with assigned drivers
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

    // 4️⃣ Filter vans based on proximity and direction matching
    const qualifiedVans = [];

    for (const van of vans) {
      if (!van.Path || !van.Path.WayPoint || van.Path.WayPoint.length === 0) {
        continue;
      }

      // Check if van passes near pickup location (within 10km)
      const isNearPickup = isVanNearPickup(
        pickupLat,
        pickupLng,
        van.Path.WayPoint
      );

      if (!isNearPickup) continue;

      // Check if van's route direction matches child's direction
      const isDirectionGood = isDirectionMatching(
        pickupLat,
        pickupLng,
        schoolLat,
        schoolLng,
        van.Path.WayPoint
      );

      if (!isDirectionGood) continue;

      qualifiedVans.push(van);
    }

    // 5️⃣ Calculate distance and estimated fare for qualified vans
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

    const vansWithEstimate = qualifiedVans.map((van) => ({
      ...van,
      estimatedFare: Math.round(distanceInKm * van.studentRating * 100) / 100,
      distanceInKm,
    }));

    console.log(`Found ${vansWithEstimate.length} qualified vans for child ${childId}`);

    return NextResponse.json(vansWithEstimate, { status: 200 });
  } catch (error) {
    console.error("Error fetching vans:", error);
    return NextResponse.json(
      { error: "Failed to fetch vans" },
      { status: 500 }
    );
  }
}
