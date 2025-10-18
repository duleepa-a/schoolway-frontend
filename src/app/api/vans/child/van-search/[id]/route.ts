import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAX_DETOUR_KM = 205;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const childId = parseInt(params.id);
    const searchParams = new URL(req.url).searchParams;
    
    // Optional filter parameters
    const filterPickupLat = searchParams.get('pickupLat');
    const filterPickupLng = searchParams.get('pickupLng');
    const filterGateId = searchParams.get('gateId');

    // 1️⃣ Fetch the child with related data
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        School: true,
        Gate: {
          select: {
            id: true,
            gateName: true,
            latitude: true,
            longitude: true,
            placeName: true,
            address: true,
          },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // 2️⃣ Set pickup and dropoff points (use filter values if provided)
    const pickupPoint = {
      lat: filterPickupLat ? Number(filterPickupLat) : Number(child.pickupLat),
      lng: filterPickupLng ? Number(filterPickupLng) : Number(child.pickupLng),
      address: child.pickupAddress,
    };

    const dropoffPoint = {
      lat: child.Gate?.latitude || Number(child.School.latitude),
      lng: child.Gate?.longitude || Number(child.School.longitude),
      gateName: child.Gate?.gateName || "Main Gate",
      address: child.Gate?.address || child.School.address,
      placeId: child.Gate?.placeName,
    };

    // 3️⃣ Fetch eligible vans
    const vans = await prisma.van.findMany({
      // where: {
      //   hasDriver: true,
      // },
      include: {
        UserProfile_Van_ownerIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true,
            mobile: true,
            VanService: {
              select: {
                serviceName: true,
                contactNo: true,
                averageRating: true,
              },
            },
          },
        },
        UserProfile_Van_assignedDriverIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true,
            mobile: true,
            DriverProfile: {
              select: {
                averageRating: true,
                totalReviews: true,
                languages: true,
              },
            },
          },
        },
        Assistant: {
          select: {
            name: true,
            contact: true,
          },
        },
        Path: {
          include: {
            WayPoint: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    // all the vans fetched with path id and waypoints
            console.log(`Fetched ${vans.length} vans from database`, vans);

    // 4️⃣ Filter vans based on route compatibility
    const eligibleVans = vans.filter((van) => {
      if (!van.Path?.WayPoint?.length) return false;

      return isValidRouteSequence(
        pickupPoint,
        dropoffPoint,
        van.Path.WayPoint
      );
    });

    // 5️⃣ Calculate estimated fares and prepare response
    const vansWithEstimates = await Promise.all(
      eligibleVans.map(async (van) => {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupPoint.lat},${pickupPoint.lng}&destinations=${dropoffPoint.lat},${dropoffPoint.lng}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        const distanceInMeters = data.rows[0]?.elements[0]?.distance?.value || 0;
        const distanceInKm = distanceInMeters / 1000;

        return {
          id: van.id,
          registrationNumber: van.registrationNumber,
          makeAndModel: van.makeAndModel,
          capacity: van.seatingCapacity,
          acAvailable: van.acCondition,
          hasAssistant: van.hasAssistant,
          photoUrl: van.photoUrl,
          service: {
            name: van.UserProfile_Van_ownerIdToUserProfile?.VanService?.serviceName,
            rating: van.UserProfile_Van_ownerIdToUserProfile?.VanService?.averageRating,
            contact: van.UserProfile_Van_ownerIdToUserProfile?.VanService?.contactNo,
          },
          driver: {
            name: `${van.UserProfile_Van_assignedDriverIdToUserProfile?.firstname} ${van.UserProfile_Van_assignedDriverIdToUserProfile?.lastname}`,
            contact: van.UserProfile_Van_assignedDriverIdToUserProfile?.mobile,
            rating: van.UserProfile_Van_assignedDriverIdToUserProfile?.DriverProfile?.averageRating,
            reviews: van.UserProfile_Van_assignedDriverIdToUserProfile?.DriverProfile?.totalReviews,
            languages: van.UserProfile_Van_assignedDriverIdToUserProfile?.DriverProfile?.languages,
          },
          assistant: van.Assistant ? {
            name: van.Assistant.name,
            contact: van.Assistant.contact,
          } : null,
          route: {
            pickupPoint,
            dropoffPoint,
            distanceInKm,
            estimatedFare: Math.round(distanceInKm * van.studentRating * 100) / 100,
          },
        };
      })
    );
console.log("Vans with estimates:", vansWithEstimates);

    return NextResponse.json(vansWithEstimates);
  } catch (error) {
    console.error("Error fetching vans:", error);
    return NextResponse.json(
      { error: "Failed to fetch vans" },
      { status: 500 }
    );
  }
}

// Helper functions
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isPointNearRoute(
  point: { lat: number; lng: number },
  waypoints: any[]
): boolean {
  return waypoints.some((wp) => {
    const distance = calculateDistance(
      point.lat,
      point.lng,
      Number(wp.latitude),
      Number(wp.longitude)
    );
    return distance <= MAX_DETOUR_KM;
  });
}

function findNearestWaypointIndex(
  point: { lat: number; lng: number },
  waypoints: any[]
): number {
  let minDistance = Infinity;
  let nearestIndex = -1;

  waypoints.forEach((wp, index) => {
    const distance = calculateDistance(
      point.lat,
      point.lng,
      Number(wp.latitude),
      Number(wp.longitude)
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

interface Waypoint {
  order: number;
  latitude: number;
  longitude: number;
}

function isValidRouteSequence(
  pickupPoint: { lat: number; lng: number },
  dropoffPoint: { lat: number; lng: number },
  waypoints: Waypoint[]
): boolean {
  // Sort waypoints by their order to ensure proper sequence
  const sortedWaypoints = [...waypoints].sort((a, b) => a.order - b.order);
  
  // Find nearest valid waypoints for pickup and dropoff
  const pickupWaypoint = findValidPickupWaypoint(pickupPoint, sortedWaypoints);
  const dropoffWaypoint = findValidDropoffWaypoint(dropoffPoint, sortedWaypoints);
  
  if (!pickupWaypoint || !dropoffWaypoint) return false;
  
  // Check if pickup comes before dropoff in the route sequence
  return pickupWaypoint.order < dropoffWaypoint.order;
}

function findValidPickupWaypoint(
  point: { lat: number; lng: number },
  waypoints: Waypoint[]
): Waypoint | null {
  const MAX_DETOUR = 5; // 5km detour limit
  
  // Find all waypoints within detour limit
  const validWaypoints = waypoints.filter(wp => {
    const distance = calculateDistance(
      point.lat,
      point.lng,
      Number(wp.latitude),
      Number(wp.longitude)
    );
    return distance <= MAX_DETOUR;
  });
  
  // Return the earliest waypoint in sequence that's within detour limit
  return validWaypoints.length > 0 ? validWaypoints[0] : null;
}

function findValidDropoffWaypoint(
  point: { lat: number; lng: number },
  waypoints: Waypoint[]
): Waypoint | null {
  const MAX_DETOUR = 5;
  
  // Find all waypoints within detour limit
  const validWaypoints = waypoints.filter(wp => {
    const distance = calculateDistance(
      point.lat,
      point.lng,
      Number(wp.latitude),
      Number(wp.longitude)
    );
    return distance <= MAX_DETOUR;
  });
  
  // Return the latest waypoint in sequence that's within detour limit
  return validWaypoints.length > 0 ? validWaypoints[validWaypoints.length - 1] : null;
}
