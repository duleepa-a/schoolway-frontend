import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');
    const vanId = searchParams.get('vanId');

    if (!driverId && !vanId) {
      return NextResponse.json(
        { error: 'Either driverId or vanId is required' },
        { status: 400 }
      );
    }

    let driverData = null;

    if (driverId) {
      // Get driver directly by ID
      const driver = await prisma.userProfile.findUnique({
        where: { id: driverId },
        include: {
          DriverProfile: {
            select: {
              id: true,
              licenseId: true,
              licenseExpiry: true,
              licenseFront: true,
              licenseBack: true,
              policeReport: true,
              startedDriving: true,
              status: true,
              bio: true,
              languages: true,
              licenseType: true,
              medicalReport: true,
              relocate: true,
              hasVan: true,
              averageRating: true,
              totalReviews: true
            }
          }
        }
      });

      if (!driver || !driver.DriverProfile) {
        return NextResponse.json(
          { error: 'Driver not found' },
          { status: 404 }
        );
      }

      driverData = {
        id: driver.id,
        firstname: driver.firstname,
        lastname: driver.lastname,
        email: driver.email,
        mobile: driver.mobile,
        profilePicture: driver.dp,
        driverProfile: {
          id: driver.DriverProfile.id,
          licenseId: driver.DriverProfile.licenseId,
          licenseExpiry: driver.DriverProfile.licenseExpiry,
          licenseFront: driver.DriverProfile.licenseFront,
          licenseBack: driver.DriverProfile.licenseBack,
          policeReport: driver.DriverProfile.policeReport,
          startedDriving: driver.DriverProfile.startedDriving,
          status: driver.DriverProfile.status,
          bio: driver.DriverProfile.bio,
          languages: driver.DriverProfile.languages,
          licenseType: driver.DriverProfile.licenseType,
          medicalReport: driver.DriverProfile.medicalReport,
          relocate: driver.DriverProfile.relocate,
          hasVan: driver.DriverProfile.hasVan,
          averageRating: driver.DriverProfile.averageRating,
          totalReviews: driver.DriverProfile.totalReviews,
          experience: driver.DriverProfile.startedDriving 
            ? `${new Date().getFullYear() - new Date(driver.DriverProfile.startedDriving).getFullYear()} years`
            : 'Not specified'
        }
      };
    } else if (vanId) {
      // Get driver through van assignment
      const van = await prisma.van.findUnique({
        where: { id: parseInt(vanId) },
        include: {
          UserProfile_Van_assignedDriverIdToUserProfile: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              mobile: true,
              dp: true,
              DriverProfile: {
                select: {
                  id: true,
                  licenseId: true,
                  licenseExpiry: true,
                  licenseFront: true,
                  licenseBack: true,
                  policeReport: true,
                  startedDriving: true,
                  status: true,
                  bio: true,
                  languages: true,
                  licenseType: true,
                  medicalReport: true,
                  relocate: true,
                  hasVan: true,
                  averageRating: true,
                  totalReviews: true
                }
              }
            }
          }
        }
      });

      if (!van) {
        return NextResponse.json(
          { error: 'Van not found' },
          { status: 404 }
        );
      }

      if (!van.UserProfile_Van_assignedDriverIdToUserProfile) {
        return NextResponse.json(
          { error: 'No driver assigned to this van' },
          { status: 404 }
        );
      }

      const driver = van.UserProfile_Van_assignedDriverIdToUserProfile;

      driverData = {
        id: driver.id,
        firstname: driver.firstname,
        lastname: driver.lastname,
        email: driver.email,
        mobile: driver.mobile,
        profilePicture: driver.dp,
        driverProfile: {
          id: driver.DriverProfile?.id,
          licenseId: driver.DriverProfile?.licenseId,
          licenseExpiry: driver.DriverProfile?.licenseExpiry,
          licenseFront: driver.DriverProfile?.licenseFront,
          licenseBack: driver.DriverProfile?.licenseBack,
          policeReport: driver.DriverProfile?.policeReport,
          startedDriving: driver.DriverProfile?.startedDriving,
          status: driver.DriverProfile?.status,
          bio: driver.DriverProfile?.bio,
          languages: driver.DriverProfile?.languages,
          licenseType: driver.DriverProfile?.licenseType,
          medicalReport: driver.DriverProfile?.medicalReport,
          relocate: driver.DriverProfile?.relocate,
          hasVan: driver.DriverProfile?.hasVan,
          averageRating: driver.DriverProfile?.averageRating,
          totalReviews: driver.DriverProfile?.totalReviews,
          experience: driver.DriverProfile?.startedDriving 
            ? `${new Date().getFullYear() - new Date(driver.DriverProfile?.startedDriving).getFullYear()} years`
            : 'Not specified'
        },
        van: {
          id: van.id,
          registrationNumber: van.registrationNumber,
          licensePlateNumber: van.licensePlateNumber,
          makeAndModel: van.makeAndModel,
          seatingCapacity: van.seatingCapacity,
          acCondition: van.acCondition,
          photoUrl: van.photoUrl
        }
      };
    }

    return NextResponse.json({
      driver: driverData
    });

  } catch (error) {
    console.error('Error fetching driver details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}









