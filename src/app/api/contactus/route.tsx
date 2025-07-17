import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    
    const body = await request.json();
    const { name, email, subject, message, userType } = body;

    if (!name || !email || !subject || !message || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newContactUs = await prisma.contactUs.create({
      data: {
        name,
        email,
        subject,
        message,
        userType: userType,
        status: 'Pending',
      },
    });
    
    return NextResponse.json({ message: 'Inquiry submitted', contactMessage: newContactUs }, { status: 201 });
  } catch (error) {

    console.error('[CONTACT_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}