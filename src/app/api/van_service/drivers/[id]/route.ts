import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Get driver profile with user data
    const driver = await prisma.driverProfile.findFirst({
      where: {
        userId: id,
        user: {
          activeStatus: true,
          role: 'DRIVER'
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            district: true,
            mobile: true,
            city: true,
            nic: true,
            dp: true,
            activeStatus: true,
          }
        }
      }
    });

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Calculate experience based on startedDriving
    const startedDriving = driver.startedDriving;
    let experience = 0;
    
    if (startedDriving) {
      const now = new Date();
      const startDate = new Date(startedDriving);
      const diffInMs = now.getTime() - startDate.getTime();
      const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
      experience = Math.max(0, Math.floor(diffInYears));
    }

    const fullName = `${driver.user.firstname || ''} ${driver.user.lastname || ''}`.trim();

    // Transform the data to match the frontend format
    const transformedDriver = {
      id: driver.user.id,
      name: fullName || 'No name provided',
      profilePic: driver.user.dp || '/Images/male_pro_pic_placeholder.png',
      city: driver.user.city || 'City not provided',
      district: driver.user.district || 'District not provided',
      contactNumber: driver.user.mobile || 'Contact not provided',
      nic: driver.user.nic || 'NIC not provided',
      licenseNumber: driver.licenseId,
      licenseExpiryDate: driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Not provided',
      experience: experience === 0 ? 'New driver' : `${experience} year${experience !== 1 ? 's' : ''}`,
      rating: Math.max(0, Math.min(5, driver.rating)) || 0,
      totalReviews: Math.max(0, driver.ratingCount),
      email: driver.user.email,
      // Document URLs (if they exist in your schema, otherwise keep as mock)
      documents: {
        driverLicense: driver.licenseFront || '/documents/driver_license_placeholder.pdf',
        policeReport: driver.policeReport || '/documents/police_report_placeholder.pdf',
        medicalReport: '/documents/medical_report_placeholder.pdf' // Keep as mock since not in schema
      }
    };

    console.log(`Fetched driver details for ID: ${id}`);

    return NextResponse.json({
      driver: transformedDriver
    });
  } catch (error) {
    console.error('Error fetching driver details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch driver details' },
      { status: 500 }
    );
  }
}