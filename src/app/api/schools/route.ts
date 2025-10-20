import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch schools along with their gates
    const schoolsWithGates = await prisma.school.findMany({
      include: {
        Gate: true, // Include all gates for each school
      },
    });

    // Flatten the data: one record per gate
    const result = schoolsWithGates.flatMap((school) =>
      school.Gate.map((gate) => ({
        id: gate.id,
        schoolId: school.id,
        schoolName: school.schoolName,
        email: school.email,
        contact: school.contact,
        address: school.address,
        gateId: gate.id,
        gateName: gate.gateName,
        description: gate.description,
        placeName: gate.placeName,
        addressLine: gate.address,
        isActive: gate.isActive,
        latitude: gate.latitude,
        longitude: gate.longitude,
        gateCreatedAt: gate.createdAt,
      }))
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error fetching schools with gates:', error);
    return NextResponse.json({ error: 'Failed to fetch schools with gates' }, { status: 500 });
  }
}
