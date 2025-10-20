import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get driver profile with user data
    const driver = await prisma.driverProfile.findFirst({
      where: {
        userId: id,
        UserProfile: {
          activeStatus: true,
          role: 'DRIVER'
        }
      },
      include: {
        UserProfile: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            district: true,
            mobile: true,
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

    // Update the transformedDriver object to use UserProfile instead of user
    const fullName = `${driver.UserProfile.firstname || ''} ${driver.UserProfile.lastname || ''}`.trim();

    // Transform the data to match the frontend format
    const transformedDriver = {
      id: driver.UserProfile.id,
      name: fullName || 'No name provided',
      profilePic: driver.UserProfile.dp || '/Images/male_pro_pic_placeholder.png',
      city: 'City not provided',
      district: driver.UserProfile.district || 'District not provided',
      contactNumber: driver.UserProfile.mobile || 'Contact not provided',
      nic: driver.UserProfile.nic || 'NIC not provided',
      licenseNumber: driver.licenseId,
      licenseExpiryDate: driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Not provided',
      experience: experience === 0 ? 'New driver' : `${experience} year${experience !== 1 ? 's' : ''}`,
      rating: Math.max(0, Math.min(5, driver.averageRating)) || 0,
      totalReviews: Math.max(0, driver.totalReviews),
      email: driver.UserProfile.email,
      hasVan: driver.hasVan === 1,  // Add this field
      documents: {
        driverLicense: driver.licenseFront || '/documents/driver_license_placeholder.pdf',
        policeReport: driver.policeReport || '/documents/police_report_placeholder.pdf',
        medicalReport: '/documents/medical_report_placeholder.pdf'
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