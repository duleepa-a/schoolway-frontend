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
          driverProfile: {
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

      if (!driver || !driver.driverProfile) {
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
          id: driver.driverProfile.id,
          licenseId: driver.driverProfile.licenseId,
          licenseExpiry: driver.driverProfile.licenseExpiry,
          licenseFront: driver.driverProfile.licenseFront,
          licenseBack: driver.driverProfile.licenseBack,
          policeReport: driver.driverProfile.policeReport,
          startedDriving: driver.driverProfile.startedDriving,
          status: driver.driverProfile.status,
          bio: driver.driverProfile.bio,
          languages: driver.driverProfile.languages,
          licenseType: driver.driverProfile.licenseType,
          medicalReport: driver.driverProfile.medicalReport,
          relocate: driver.driverProfile.relocate,
          hasVan: driver.driverProfile.hasVan,
          averageRating: driver.driverProfile.averageRating,
          totalReviews: driver.driverProfile.totalReviews,
          experience: driver.driverProfile.startedDriving 
            ? `${new Date().getFullYear() - new Date(driver.driverProfile.startedDriving).getFullYear()} years`
            : 'Not specified'
        }
      };
    } else if (vanId) {
      // Get driver through van assignment
      const van = await prisma.van.findUnique({
        where: { id: parseInt(vanId) },
        include: {
          UserProfile_assignedDriverIdToUserProfile: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              mobile: true,
              dp: true,
              driverProfile: {
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

      if (!van.UserProfile_assignedDriverIdToUserProfile) {
        return NextResponse.json(
          { error: 'No driver assigned to this van' },
          { status: 404 }
        );
      }

      const driver = van.UserProfile_assignedDriverIdToUserProfile;

      driverData = {
        id: driver.id,
        firstname: driver.firstname,
        lastname: driver.lastname,
        email: driver.email,
        mobile: driver.mobile,
        profilePicture: driver.dp,
        driverProfile: {
          id: driver.driverProfile.id,
          licenseId: driver.driverProfile.licenseId,
          licenseExpiry: driver.driverProfile.licenseExpiry,
          licenseFront: driver.driverProfile.licenseFront,
          licenseBack: driver.driverProfile.licenseBack,
          policeReport: driver.driverProfile.policeReport,
          startedDriving: driver.driverProfile.startedDriving,
          status: driver.driverProfile.status,
          bio: driver.driverProfile.bio,
          languages: driver.driverProfile.languages,
          licenseType: driver.driverProfile.licenseType,
          medicalReport: driver.driverProfile.medicalReport,
          relocate: driver.driverProfile.relocate,
          hasVan: driver.driverProfile.hasVan,
          averageRating: driver.driverProfile.averageRating,
          totalReviews: driver.driverProfile.totalReviews,
          experience: driver.driverProfile.startedDriving 
            ? `${new Date().getFullYear() - new Date(driver.driverProfile.startedDriving).getFullYear()} years`
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






