//Create school 
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
    console.log(Object.keys(prisma)); 

  try {
    const body = await request.json();
    console.log(body);
    const school = await prisma.school.create({
      data: {
        schoolName: body.schoolName,
        email: body.email,
        contact: body.contact,
        address: body.address
      }
    });

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json({ 
      error: 'Error creating school', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}
