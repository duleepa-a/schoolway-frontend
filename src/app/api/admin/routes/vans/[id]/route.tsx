import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/routes/vans/:id
// Returns van summary including owner (UserProfile), van service and children (students)
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const van = await prisma.van.findUnique({
      where: { id: Number(id) },
      include: {
        // owner
        UserProfile: { include: { VanService: true } },
        // assigned driver (nullable)
        UserProfile_Van_assignedDriverIdToUserProfile: true,
        Child: true,
        Path: true,
      },
    });

    if (!van)
      return NextResponse.json({ error: "Van not found" }, { status: 404 });

    // Convert Dates to ISO strings for safe JSON transfer
    const serialize = (obj: unknown) =>
      JSON.parse(
        JSON.stringify(obj, (k, v) => (v instanceof Date ? v.toISOString() : v))
      ) as unknown;

    const serializedVan = serialize(van);

    // owner name and driver name (if available)
    const ownerName = van?.UserProfile
      ? [van.UserProfile.firstname, van.UserProfile.lastname]
          .filter(Boolean)
          .join(" ")
      : null;

    const driverProfile = van?.UserProfile_Van_assignedDriverIdToUserProfile;
    const driverName = driverProfile
      ? [driverProfile.firstname, driverProfile.lastname]
          .filter(Boolean)
          .join(" ")
      : null;

    return NextResponse.json({
      van: {
        ...serializedVan,
        ownerName,
        driverName,
      },
    });
  } catch (error) {
    console.error("Error fetching van summary", error);
    return NextResponse.json({ error: "Failed to fetch van" }, { status: 500 });
  }
}
