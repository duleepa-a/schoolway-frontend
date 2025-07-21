//Get all schools
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all schools from the database, selecting only id and name
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        schoolName: true,
      },
      orderBy: {
        schoolName: 'asc'
      }
    });

    // Map schools to a simpler format with just id and name
    const processedSchools = schools.map(school => ({
      id: school.id,
      name: school.schoolName
    }));

    return NextResponse.json({
      schools: processedSchools
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({ 
      error: 'Error fetching schools', 
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      schools: []
    }, { status: 500 });
  }
}
