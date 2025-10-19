import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/van-details?driverId=xxx
export async function GET(req: NextRequest) {
  try {
    const driverId = req.nextUrl.searchParams.get("driverId");

    if (!driverId) {
      return NextResponse.json({ error: "driverId is required" }, { status: 400 });
    }

    // Find the driver profile and linked van
    const driver = await prisma.driverProfile.findUnique({
      where: { userId: driverId },
      include: {
        UserProfile: true,
      },
    });

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    const van = await prisma.van.findFirst({
        where : {
            assignedDriverId : driverId
        },
        include : {
            UserProfile : true,
            Assistant : true
        }
    })

    // Format the response neatly
    const responseData = {
      driver: {
        id: driver.id,
        name: `${driver.UserProfile.firstname || ""} ${driver.UserProfile.lastname || ""}`.trim(),
        email: driver.UserProfile.email,
        contact: driver.UserProfile.mobile,
        bio: driver.bio,
        rating: driver.averageRating,
        totalReviews: driver.totalReviews,
        licenseType: driver.licenseType,
        profilePic: driver.UserProfile.dp,
      },
      van: van
        ? {
            id: van,
            registrationNumber: van.registrationNumber,
            makeAndModel: van.makeAndModel,
            seatingCapacity: van.seatingCapacity,
            photoUrl: van.photoUrl,
            acCondition: van.acCondition,
            hasAssistant: van.hasAssistant,
            owner: {
              id: van.UserProfile.id,
              name: `${van.UserProfile.firstname || ""} ${van.UserProfile.lastname || ""}`.trim(),
              contact: van.UserProfile.mobile,
            },
            assistant: van.Assistant
              ? {
                  name: van.Assistant.name,
                  contact: van.Assistant.contact,
                  nic: van.Assistant.nic,
                }
              : null,
          }
        : null,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver/van details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
