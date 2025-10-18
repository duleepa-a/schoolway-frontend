import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createFirebaseSession } from '@/lib/firebase-admin';
import { randomUUID } from 'crypto';

// Define RouteType manually since it's not exported by Prisma
type RouteType = 'MORNING_PICKUP' | 'EVENING_DROPOFF';

export async function POST(request: NextRequest) {
  try {
    const { driverId } = await request.json();

    // Validate driver
    if (!driverId) {
      return NextResponse.json(
        { success: false, error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    // Get driver's van
    const driver = await prisma.userProfile.findUnique({
      where: { id: driverId },
      include: {
        Van_Van_assignedDriverIdToUserProfile: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        { success: false, error: 'Driver not found' },
        { status: 404 }
      );
    }

    const vanList = driver.Van_Van_assignedDriverIdToUserProfile ?? [];

    if (vanList.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Driver has no assigned van' },
        { status: 404 }
      );
    }

    const van = vanList[0];

    
    console.log(`Driver ${driverId} assigned to van ${van.id}`);
    // Determine route type based on current time
    const now = new Date();
    const currentHour = now.getHours();
    const routeType: RouteType = currentHour < 10 ? 'MORNING_PICKUP' : 'EVENING_DROPOFF';

    // Check if session already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingSession = await prisma.transportSession.findFirst({
      where: {
        vanId: van.id,
        routeType,
        sessionDate: {
          gte: today,
          lt: tomorrow,
        },
        status: {
          in: ['PENDING', 'ACTIVE'],
        },
      },
    });

    if (existingSession) {
      return NextResponse.json(
        { 
          success: true, 
          message: `${routeType === 'MORNING_PICKUP' ? 'Morning' : 'Evening'} session already exists for today`,
          sessionId: existingSession.id,
          session: {
            id: existingSession.id,
            routeType,
            startedAt: existingSession.startedAt,
            status: existingSession.status,
          },
          sessionExists: true,
        }     
      );
    }

    // Get assigned children, excluding absent ones
    const todayDate = today.toISOString().split('T')[0];
    
    const children = await prisma.child.findMany({
      where: {
        vanID: van.id,
        status: {
          in: ['ON_VAN', 'AT_HOME', 'AT_SCHOOL']
        }, // Or whatever status indicates active enrollment
        NOT: {
          attendance: {
            some: {
              absenceDate: new Date(todayDate),
              routeType: {
                in: [routeType, 'BOTH'],
              },
            },
          },
        },
      },
      include: {
        School: {
          select: {
            schoolName: true,
            address: true,
          },
        },
        UserProfile: {
          select: {
            firstname: true,
            lastname: true,
            mobile: true,
          },
        },
        Gate: true,
      },
      orderBy: {
        name: 'asc', // Simple ordering for now, will optimize with Google Maps later
      },
    });

    if (children.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No children assigned or all marked absent for today',
          children: [],
        },
        { status: 200 }
      );
    }

    console.log('children assigned to van:', children);

    // Create transport session in PostgreSQL
    const session = await prisma.transportSession.create({
      data: {
        vanId: van.id,
        driverId: driver.id,
        routeType,
        sessionDate: today,
        status: 'PENDING', 
        startedAt: now,
      },
    });
    // Create session_students records
    const sessionStudents = await Promise.all(
      children.map((child, index) =>
        prisma.sessionStudent.create({
          data: {
            sessionId: session.id,
            childId: child.id,
            isPresent: true,
            pickupOrder: index + 1,
            pickupStatus: 'PENDING',
          },
        })
      )
    );

    // Prepare data for Firebase
    const firebaseStudents: Record<string, any> = {};
    children.forEach((child, index) => {
      firebaseStudents[child.id.toString()] = {
        name: child.name,
        pickupOrder: index + 1,
        status: 'pending',
        pickedUpAt: null,
        droppedOffAt: null,
        homeLocation: {
          latitude: parseFloat(child.pickupLat.toString()),
          longitude: parseFloat(child.pickupLng.toString()),
          address: child.pickupAddress,
        },
        schoolLocation: {
          name: child.School.schoolName,
          address: child.School.address,
          latitude : child.Gate?.latitude != null ? parseFloat(child.Gate.latitude.toString()) : null,
          longitude : child.Gate?.longitude != null ? parseFloat(child.Gate.longitude.toString()) : null,
        },
        parentName: child.UserProfile 
          ? `${child.UserProfile.firstname} ${child.UserProfile.lastname}` 
          : 'Unknown',
        parentMobile: child.UserProfile?.mobile || '',
      };
    });

    // Initialize Firebase session
    await createFirebaseSession(session.id, {
      vanId: van.id,
      driverId: driver.id,
      driverName: `${driver.firstname} ${driver.lastname}`,
      routeType,
      status: 'pending',
      startedAt: now.getTime(),
      currentLocation: null, // Will be updated when tracking starts
      students: firebaseStudents,
      vanDetails: {
        registrationNumber: van.registrationNumber,
        licensePlateNumber: van.licensePlateNumber,
        makeAndModel: van.makeAndModel,
      },
    });

    // Update session with Firebase ID
    await prisma.transportSession.update({
      where: { id: session.id },
      data: { firebaseSessionId: session.id },
    });

    // Format response
    const studentList = children.map((child, index) => ({
      id: child.id,
      name: child.name,
      age: child.age,
      grade: child.grade,
      profilePicture: child.profilePicture,
      pickupOrder: index + 1,
      pickupLocation: {
        latitude: parseFloat(child.pickupLat.toString()),
        longitude: parseFloat(child.pickupLng.toString()),
        address: child.pickupAddress,
      },
      DropoffLocation: (() => {
        const gate = child.Gate;
        return {
          latitude: gate?.latitude != null ? parseFloat(gate.latitude.toString()) : null,
          longitude: gate?.longitude != null ? parseFloat(gate.longitude.toString()) : null,
          address: gate?.address || null,
        };
      })(),
      school: {
        name: child.School.schoolName,
        address: child.School.address,
      },
      schoolStartTime: child.schoolStartTime,
      schoolEndTime: child.schoolEndTime,
      specialNotes: child.specialNotes,
      parentName: child.UserProfile 
        ? `${child.UserProfile.firstname} ${child.UserProfile.lastname}` 
        : 'Unknown',
      parentMobile: child.UserProfile?.mobile || '',
      status: 'pending',
    }));

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        routeType,
        startedAt: session.startedAt,
        status: session.status,
      },
      sessionExists: false,
      students: studentList,
      message: `${routeType === 'MORNING_PICKUP' ? 'Morning pickup' : 'Evening dropoff'} session started with ${studentList.length} student(s)`,
    });

  } catch (error) {
    console.error('Session start error:', error);
  }
}