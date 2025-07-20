//Get all school names with IDs
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all schools from the database, selecting only id and name
    const schools = await prisma.school.findMany({
      select: {
        id: true,
        schoolName: true,
        address: true
      },
      orderBy: {
        schoolName: 'asc' // Order alphabetically by name
      }
    });

    if (!schools || schools.length === 0) {
      return NextResponse.json({ 
        message: 'No schools found',
        schools: []
      });
    }

    // Return the list of schools with id and name
    return NextResponse.json({
      schools: schools.map(school => ({
        id: school.id,
        name: school.schoolName,
        address: school.address || ''
      }))
    });
  } catch (error) {
    console.error('Error fetching school names:', error);
    return NextResponse.json({ 
      error: 'Error fetching school names', 
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined 
    }, { status: 500 });
  }
}
