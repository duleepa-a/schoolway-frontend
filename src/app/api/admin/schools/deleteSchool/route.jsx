//Delete school
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request) {
  try {
    // Get the school ID from the URL search params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ 
        error: 'Missing school ID', 
        message: 'School ID is required for deletion'
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

    // First check if the school exists
    const existingSchool = await prisma.school.findUnique({
      where: { id: schoolId }
    });

    if (!existingSchool) {
      return NextResponse.json({ 
        error: 'School not found', 
        message: `No school found with ID ${schoolId}`
      }, { status: 404 });
    }

    // Delete the school
    await prisma.school.delete({
      where: { id: schoolId }
    });
    
    return NextResponse.json({
      success: true,
      message: `School with ID ${schoolId} has been deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json({ 
      error: 'Error deleting school', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
