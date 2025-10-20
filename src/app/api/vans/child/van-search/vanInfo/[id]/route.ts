import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Helper function to extract coordinates from geometry
function extractCoordinates(geometry: any): { lat: number; lng: number } | null {
  try {
    if (!geometry) return null;
    
    // Handle POINT(lng lat) format from ST_AsText
    // Format: "POINT(79.96074 6.5853948)"
    const pointMatch = geometry.toString().match(/POINT\((-?\d+\.?\d*)\s+(-?\d+\.?\d*)\)/);
    if (pointMatch) {
      return { lat: parseFloat(pointMatch[2]), lng: parseFloat(pointMatch[1]) };
    }
    
    // Fallback: Handle comma-separated format
    const coordMatch = geometry.toString().match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      return { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) };
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting coordinates:", error);
    return null;
  }
}

// Helper function to get location name from coordinates using Google Maps Reverse Geocoding
async function getLocationNameFromCoordinates(
  lat: number,
  lng: number
): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error("Error fetching location name:", error);
    return null;
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const vanId = parseInt(params.id);

    // Fetch comprehensive van details
    const van = await prisma.van.findUnique({
      where: { id: vanId },
      include: {
        // Van owner info
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            dp: true,
          },
        },
        // Assigned driver info
        UserProfile_Van_assignedDriverIdToUserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            mobile: true,
            dp: true,
            DriverProfile: {
              select: {
                licenseId: true,
                licenseExpiry: true,
                startedDriving: true,
                status: true,
              },
            },
          },
        },
        // Van assistant/helper info
        Assistant: {
          select: {
            id: true,
            name: true,
            contact: true,
            profilePic: true,
          },
        },
        // Van reviews - Only VAN_SERVICE reviews
        Review: {
          where: {
            reviewType: "VAN_SERVICE",
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        // Van path/route info
        Path: {
          include: {
            WayPoint: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });

    if (!van) {
      return NextResponse.json({ error: "Van not found" }, { status: 404 });
    }

    // Extract and convert route start/end to location names
    let routeStartName: string | null = null;
    let routeEndName: string | null = null;

    if (van.Path?.id) {
      try {
        // Use raw query to get geometry data since Prisma doesn't support it natively
        const pathGeometry = await prisma.$queryRaw<
          Array<{ routeStart: string | null; routeEnd: string | null }>
        >`SELECT 
          ST_AsText("routeStart") as "routeStart", 
          ST_AsText("routeEnd") as "routeEnd" 
        FROM "Path" 
        WHERE id = ${van.Path.id}`;

        console.log("Raw pathGeometry result:", pathGeometry);

        if (pathGeometry && pathGeometry.length > 0) {
          const { routeStart, routeEnd } = pathGeometry[0];

          console.log("Van Path Geometry:", routeStart, routeEnd);

          if (routeStart) {
            const startCoords = extractCoordinates(routeStart);
            if (startCoords) {
              routeStartName = await getLocationNameFromCoordinates(
                startCoords.lat,
                startCoords.lng
              );
            }
          }

          if (routeEnd) {
            const endCoords = extractCoordinates(routeEnd);
            if (endCoords) {
              routeEndName = await getLocationNameFromCoordinates(
                endCoords.lat,
                endCoords.lng
              );
            }
          }
        }
      } catch (geoError) {
        console.error("Error fetching geometry data:", geoError);
      }
    }

    // Calculate average rating from reviews
    const averageRating =
      van.Review.length > 0
        ? (van.Review.reduce((sum, review) => sum + review.rating, 0) /
            van.Review.length).toFixed(1)
        : "0";

    // Prepare comprehensive response
    const vanDetails = {
      // Basic van info
      id: van.id,
      registrationNumber: van.registrationNumber,
      model: van.makeAndModel,
      licensePlateNumber: van.licensePlateNumber,
      capacity: van.seatingCapacity,
      seatsAvailable: van.seatingCapacity - van.noOfStudentsAssigned,
      acCondition: van.acCondition,
      status: van.status,
      hasDriver: van.hasDriver,
      studentRating: van.studentRating,
      averageReviewRating: averageRating,
      reviewCount: van.Review.length,
      photoUrl: van.photoUrl,
      hasAssistant: van.hasAssistant,
      salaryPercentage: van.salaryPercentage,

      // Van owner info
      owner: van.UserProfile
        ? {
            id: van.UserProfile.id,
            name: `${van.UserProfile.firstname} ${van.UserProfile.lastname}`,
            email: van.UserProfile.email,
            mobile: van.UserProfile.mobile,
            profilePicture: van.UserProfile.dp,
          }
        : null,

      // Assigned driver info
      driver: van.UserProfile_Van_assignedDriverIdToUserProfile
        ? {
            id: van.UserProfile_Van_assignedDriverIdToUserProfile.id,
            name: `${van.UserProfile_Van_assignedDriverIdToUserProfile.firstname} ${van.UserProfile_Van_assignedDriverIdToUserProfile.lastname}`,
            email: van.UserProfile_Van_assignedDriverIdToUserProfile.email,
            mobile: van.UserProfile_Van_assignedDriverIdToUserProfile.mobile,
            profilePicture: van.UserProfile_Van_assignedDriverIdToUserProfile.dp,
            licenseNumber:
              van.UserProfile_Van_assignedDriverIdToUserProfile.DriverProfile
                ?.licenseId ?? null,
            licenseExpiry:
              van.UserProfile_Van_assignedDriverIdToUserProfile.DriverProfile
                ?.licenseExpiry ?? null,
            yearsOfExperience:
              van.UserProfile_Van_assignedDriverIdToUserProfile.DriverProfile
                ?.startedDriving
              ? new Date().getFullYear() -
                van.UserProfile_Van_assignedDriverIdToUserProfile.DriverProfile.startedDriving.getFullYear()
              : null,
            backgroundCheckStatus:
              van.UserProfile_Van_assignedDriverIdToUserProfile.DriverProfile
                ?.status ?? null,
          }
        : null,

      // Van assistant/helper info
      assistant: van.Assistant
        ? {
            id: van.Assistant.id,
            name: van.Assistant.name,
            contact: van.Assistant.contact,
            profilePicture: van.Assistant.profilePic,
          }
        : null,

      // Route information
      route: van.Path
        ? {
            id: van.Path.id,
            routeStart: routeStartName,
            routeEnd: routeEndName,
            totalDistance: van.Path.totalDistance,
            estimatedDuration: van.Path.estimatedDuration,
            waypoints: van.Path.WayPoint.map((wp) => ({
              id: wp.id,
              name: wp.name,
              latitude: wp.latitude,
              longitude: wp.longitude,
              order: wp.order,
              isStop: wp.isStop,
            })),
          }
        : null,

      // Recent service reviews only
      recentReviews: van.Review.map((review) => ({
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
      })),
    };

    console.log("Van details fetched successfully:", vanDetails);
    return NextResponse.json(vanDetails, { status: 200 });
  } catch (error) {
    console.error("Error fetching van details:", error);
    return NextResponse.json(
      { error: "Failed to fetch van details" },
      { status: 500 }
    );
  }
}