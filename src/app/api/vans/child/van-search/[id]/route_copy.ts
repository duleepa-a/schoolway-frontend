import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const childId = parseInt(params.id);

    // 1️⃣ Fetch the child's pickup + school locations
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        School: true,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const pickupLat = child.pickupLat;
    const pickupLng = child.pickupLng;

    // NOTE: If you have school location data in a separate geometry field, adjust accordingly.
    const schoolLocation = await prisma.school.findUnique({
      where: { id: child.schoolID },
    });

    if (!schoolLocation) {
      return NextResponse.json({ error: "School not found" }, { status: 404 });
    }

    // You’ll need to ensure you have lat/lng for school — here we’ll assume you have
    // school.latitude and school.longitude columns or can derive them.
    // For now, if you store in address, you can geocode it:
    const schoolAddress = schoolLocation.address;

    // 2️⃣ Fetch all vans
    const vans = await prisma.van.findMany({
      include: {
        UserProfile_Van_ownerIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true
          }
        },
        UserProfile_Van_assignedDriverIdToUserProfile: {
          select: {
            firstname: true,
            lastname: true
          }
        },
        Path: true,
      },
    });

    // 3️⃣ Use Google Distance Matrix API to get distance (in meters)
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickupLat},${pickupLng}&destinations=${encodeURIComponent(
      schoolAddress
    )}&key=${GOOGLE_MAPS_API_KEY}`;


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

    // 4️⃣ Calculate estimated fare per van
    const vansWithEstimate = vans.map((van) => ({
      ...van,
      estimatedFare: Math.round(distanceInKm * van.studentRating * 100) / 100,
    }));
console.log("Vans with estimates:", vansWithEstimate);
    // 5️⃣ Return combined response
    return NextResponse.json(vansWithEstimate, { status: 200 });
  } catch (error) {
    console.error("Error fetching vans", error);
    return NextResponse.json(
      { error: "Failed to fetch vans" },
      { status: 500 }
    );
  }
}
