import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 

export async function GET(
  req: NextRequest,
  { params }: { params: { driverId: string } }
) {
  try {
    const { driverId } = params;

    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    const driver = await prisma.driverProfile.findFirst({
      where: {
        userId: driverId,
      },
      select: {
        licenseId: true,
        licenseExpiry: true,
        licenseType: true,
        licenseFront: true,
        licenseBack: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Calculate days until expiration
    const today = new Date();
    const expiryDate = driver.licenseExpiry;
    const daysUntilExpiry = expiryDate 
      ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Determine license status
    let status = 'valid';
    if (!expiryDate) {
      status = 'unknown';
    } else if (daysUntilExpiry && daysUntilExpiry <= 0) {
      status = 'expired';
    } else if (daysUntilExpiry && daysUntilExpiry <= 30) {
      status = 'expiring-soon';
    }

    return NextResponse.json({
      license: {
        id: driver.licenseId,
        expiryDate: driver.licenseExpiry?.toISOString(),
        daysUntilExpiry,
        status,
        type: driver.licenseType,
        images: {
          front: driver.licenseFront,
          back: driver.licenseBack
        }
      }
    });

  } catch (error) {
    console.error('Error fetching driver license info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license information' },
      { status: 500 }
    );
  }
}