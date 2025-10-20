import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");

    if (!driverId) {
      return NextResponse.json(
        { success: false, message: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Fetch driver profile with related data
    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: driverId },
      include: {
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            dp: true,
            mobile: true,
            address: true,
          },
        },
      },
    });

    if (!driverProfile) {
      return NextResponse.json(
        { success: false, message: "Driver not found" },
        { status: 404 }
      );
    }

    // Fetch assigned van with service details
    const van = await prisma.van.findFirst({
      where: { assignedDriverId: driverId },
      include: {
        UserProfile: {
          include: {
            VanService: true,
          },
        },
      },
    });

    // Fetch reviews for the driver
    const driverReviews = await prisma.review.findMany({
      where: {
        targetId: driverId,
        reviewType: "DRIVER",
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        Child: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Fetch van reviews if van exists
    const vanReviews = van
      ? await prisma.review.findMany({
          where: {
            vanId: van.id,
            reviewType: "VAN_SERVICE",
          },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            Child: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        })
      : [];

    // Calculate average ratings
    const driverAvgRating =
      driverReviews.length > 0
        ? (driverReviews.reduce((sum, r) => sum + r.rating, 0) /
            driverReviews.length).toFixed(1)
        : "N/A";

    const vanAvgRating =
      vanReviews.length > 0
        ? (vanReviews.reduce((sum, r) => sum + r.rating, 0) / vanReviews.length)
            .toFixed(1)
        : "N/A";

    return NextResponse.json(
      {
        success: true,
        data: {
          driver: {
            id: driverProfile.userId,
            firstname: driverProfile.UserProfile.firstname,
            lastname: driverProfile.UserProfile.lastname,
            dp: driverProfile.UserProfile.dp,
            mobile: driverProfile.UserProfile.mobile,
            address: driverProfile.UserProfile.address,
            bio: driverProfile.bio,
            languages: driverProfile.languages,
            licenseType: driverProfile.licenseType,
            averageRating: parseFloat(driverAvgRating as string),
            totalReviews: driverReviews.length,
            startedDriving: driverProfile.startedDriving,
            reviews: driverReviews,
          },
          van: van
            ? {
                id: van.id,
                registrationNumber: van.registrationNumber,
                licensePlateNumber: van.licensePlateNumber,
                makeAndModel: van.makeAndModel,
                seatingCapacity: van.seatingCapacity,
                acCondition: van.acCondition,
                photoUrl: van.photoUrl,
                averageRating: parseFloat(vanAvgRating as string),
                totalReviews: vanReviews.length,
                reviews: vanReviews,
              }
            : null,
          vanService: van?.UserProfile?.VanService
            ? {
                id: van.UserProfile.VanService.id,
                serviceName:
                  van.UserProfile.VanService
                    .serviceName,
                contactNo:
                  van.UserProfile.VanService.contactNo,
                averageRating:
                  van.UserProfile.VanService
                    .averageRating,
                totalReviews:
                  van.UserProfile.VanService
                    .totalReviews,
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching driver profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}