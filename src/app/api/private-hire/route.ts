import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDistance } from '@/utils/calculateDistance';

export async function POST(request: Request) {
  try {
    const {
      userId,
      pickupLat,
      pickupLng,
      destinationLat,
      destinationLng,
      departureDate,
      returnDate,
      noOfPassengers,
      notes,
      status,
      vanId
    } = await request.json();

    if (
      !userId ||
      pickupLat == null ||
      pickupLng == null ||
      destinationLat == null ||
      destinationLng == null ||
      !departureDate ||
      !noOfPassengers ||
      !vanId
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate tripDistance
    const tripDistance = calculateDistance(pickupLat, pickupLng, destinationLat, destinationLng);
    // Get van's privateRating
    const van = await prisma.van.findUnique({ where: { id: vanId } });
    const privateRating = van?.privateRating ?? 1;
    // Calculate fare
    const fare = privateRating * tripDistance * 2;

    // Save the hire
    const hire = await prisma.privateHire.create({
      data: {
        userId,
        vanId,
        pickupLat,
        pickupLng,
        destinationLat,
        destinationLng,
        departureDate: new Date(departureDate),
        returnDate: returnDate ? new Date(returnDate) : null,
        noOfPassengers,
        notes: notes || null,
        status: status || 'PENDING',
        fare,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({ hire }, { status: 201 });
  } catch (error) {
    console.error('Create Hire Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}