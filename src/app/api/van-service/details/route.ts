import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vanId = searchParams.get('vanId');
    const vanServiceId = searchParams.get('vanServiceId');

    if (!vanId && !vanServiceId) {
      return NextResponse.json(
        { error: 'Either vanId or vanServiceId is required' },
        { status: 400 }
      );
    }

    let vanServiceData = null;

    if (vanId) {
      // Get van service through van owner
      const van = await prisma.van.findUnique({
        where: { id: parseInt(vanId) },
        include: {
          UserProfile: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              mobile: true,
              dp: true,
              vanService: {
                select: {
                  id: true,
                  serviceName: true,
                  contactNo: true,
                  serviceRegNumber: true,
                  businessDocument: true,
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

      if (!van.UserProfile?.vanService) {
        return NextResponse.json(
          { error: 'Van service not found for this van' },
          { status: 404 }
        );
      }

      vanServiceData = {
        id: van.UserProfile.vanService.id,
        serviceName: van.UserProfile.vanService.serviceName,
        contactNo: van.UserProfile.vanService.contactNo,
        serviceRegNumber: van.UserProfile.vanService.serviceRegNumber,
        businessDocument: van.UserProfile.vanService.businessDocument,
        averageRating: van.UserProfile.vanService.averageRating,
        totalReviews: van.UserProfile.vanService.totalReviews,
        owner: {
          id: van.UserProfile.id,
          firstname: van.UserProfile.firstname,
          lastname: van.UserProfile.lastname,
          email: van.UserProfile.email,
          mobile: van.UserProfile.mobile,
          profilePicture: van.UserProfile.dp
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
    } else if (vanServiceId) {
      // Get van service directly by ID
      const vanService = await prisma.vanService.findUnique({
        where: { id: vanServiceId },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
              mobile: true,
              dp: true
            }
          }
        }
      });

      if (!vanService) {
        return NextResponse.json(
          { error: 'Van service not found' },
          { status: 404 }
        );
      }

      vanServiceData = {
        id: vanService.id,
        serviceName: vanService.serviceName,
        contactNo: vanService.contactNo,
        serviceRegNumber: vanService.serviceRegNumber,
        businessDocument: vanService.businessDocument,
        averageRating: vanService.averageRating,
        totalReviews: vanService.totalReviews,
        owner: {
          id: vanService.user.id,
          firstname: vanService.user.firstname,
          lastname: vanService.user.lastname,
          email: vanService.user.email,
          mobile: vanService.user.mobile,
          profilePicture: vanService.user.dp
        }
      };
    }

    return NextResponse.json({
      vanService: vanServiceData
    });

  } catch (error) {
    console.error('Error fetching van service details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

