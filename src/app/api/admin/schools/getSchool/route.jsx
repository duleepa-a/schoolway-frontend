//Get school by ID
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Get the school ID from the URL search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Missing school ID', 
        message: 'School ID is required'
      }, { status: 400 });
    }
    
    // Parse ID as integer
    const schoolId = parseInt(id);
    
    if (isNaN(schoolId)) {
      return NextResponse.json({ 
        error: 'Invalid school ID', 
        message: 'School ID must be a valid integer'
      }, { status: 400 });
    }

    // Fetch the school from the database
    const school = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!school) {
      return NextResponse.json({ 
        error: 'School not found', 
        message: `No school found with ID ${schoolId}`
      }, { status: 404 });
    }

    // Return the school data
    return NextResponse.json({
      ...school,
    });
  } catch (error) {
    console.error('Error fetching school:', error);
    return NextResponse.json({
      error: 'Error fetching school',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
