// app/api/private-hire/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      userId,
      vanId,
      pickupLat,
      pickupLng,
      destinationLat,
      destinationLng,
      departureDate,
      returnDate,
      noOfPassengers,
      fare,
      notes,
      status,
    } = body;

    // Basic field validation
    if (
      !userId ||
      pickupLat == null ||
      pickupLng == null ||
      destinationLat == null ||
      destinationLng == null ||
      !departureDate ||
      noOfPassengers == null ||
      fare == null ||
      !status
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userExists = await prisma.userProfile.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Optional: Check if van exists if vanId is provided
    if (vanId !== null) {
      const vanExists = await prisma.van.findUnique({
        where: { id: vanId },
      });

      if (!vanExists) {
        return NextResponse.json(
          { error: 'Van not found' },
          { status: 404 }
        );
      }
    }

    // Create the private hire request
    const hire = await prisma.privateHire.create({
      data: {
        userId,
        pickupLat,
        pickupLng,
        destinationLat,
        destinationLng,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        noOfPassengers,
        fare,
        notes,
        status,
        updatedAt: new Date(),
        ...(vanId && { vanId }), // optional relation
      },
      include: {
        Van: true,
        UserProfile: true,
      },
    });

    return NextResponse.json(hire, { status: 201 });
  } catch (error: any) {
    console.error('Error creating private hire:', error);
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
