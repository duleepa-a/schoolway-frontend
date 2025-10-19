import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
        UserProfile_Van_ownerIdToUserProfile: {
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
            reviewType: "VAN_SERVICE", // Filter for VAN_SERVICE reviews only
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
      owner: van.UserProfile_Van_ownerIdToUserProfile
        ? {
            id: van.UserProfile_Van_ownerIdToUserProfile.id,
            name: `${van.UserProfile_Van_ownerIdToUserProfile.firstname} ${van.UserProfile_Van_ownerIdToUserProfile.lastname}`,
            email: van.UserProfile_Van_ownerIdToUserProfile.email,
            mobile: van.UserProfile_Van_ownerIdToUserProfile.mobile,
            profilePicture: van.UserProfile_Van_ownerIdToUserProfile.dp,
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