import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { profile } from 'console';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { driverId: string } }
) {
  const { driverId } = await params;
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');

  if (!driverId) {
    return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 });
  }

  try {
    let data;

    switch (section) {
      case 'vaninfo':
        data = await getDriverVehicleInfo(driverId);
        break;
      case 'assistant':
        data = await getAssistantInfo(driverId);
        break;
      case 'students':
        data = await getAssignedStudents(driverId);
        break;
      case 'route':
        data = await getRouteAndSchools(driverId);
        break;
      default:
        return NextResponse.json({ error: 'Invalid section parameter' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Function to get location name from coordinates using Google Maps API
async function getLocationName(lat: number, lng: number): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === 'OK' && data.results.length > 0) {
    return data.results[0].formatted_address;
  }
  return 'Unknown Location';
}

// Function to get basic vehicle info (always loaded)
async function getDriverVehicleInfo(driverId: string) {
  try {
    const van = await prisma.van.findFirst({
      where: {
        assignedDriverId: driverId
      },
      include: {
        UserProfile: true,
        Child: {
          include: {
            School: true
          }
        },
        Path: {
          include: {
            WayPoint: {
              orderBy: {
                order: "asc"
              }
            }
          }
        },
        Assistant: true,
        // Include the van owner's VanService
        UserProfile: {
          include: {
            VanService: true
          }
        }
      }
    });

    if (!van) {
      return NextResponse.json({ error: 'No van assigned to this driver' }, { status: 404 });
    }

    // --- Get routeStart and routeEnd coordinates from geometry columns ---
    let startLocation = 'Unknown Start';
    let endLocation = 'Unknown End';
    if (van.Path?.id) {
      const coords = await getRouteStartEndCoords(van.Path.id);
      console.log('Route coordinates:', coords);
      if (coords?.start_lat && coords?.start_lng) {
        startLocation = await getLocationName(coords.start_lat, coords.start_lng);
      }
      if (coords?.end_lat && coords?.end_lng) {
        endLocation = await getLocationName(coords.end_lat, coords.end_lng);
      }
    }

    // Get unique schools from children
    const schools = van.Child.reduce((acc, child) => {
      const school = child.School;
      if (!acc.find(s => s.id === school.id)) {
        acc.push(school);
      }
      return acc;
    }, [] as any[]);

    return {
      id: van.registrationNumber,
      model: van.makeAndModel,
      licensePlate: van.licensePlateNumber,
      status: van.status === 1 ? 'active' : 'inactive',
      image: van.photoUrl || null,
      ownerName: `${van.UserProfile.firstname || ''} ${van.UserProfile.lastname || ''}`.trim() || 'Unknown Owner',
      capacity: van.seatingCapacity,
      year: new Date(van.createdAt).getFullYear(),
      fuelType: 'Diesel',
      route: {
        startLocation,
        endLocation
      },
      stats: {
        studentCount: van.Child.length,
        schoolCount: schools.length,
        rating: van.UserProfile.VanService?.averageRating || 0.0
      }
    };
  } catch (error) {
    console.error('Database error in getDriverVehicleInfo:', error);
    throw error;
  }
}

// Function to get assistant info (lazy loaded)
async function getAssistantInfo(driverId: string) {
  try {
    // First get the van associated with the driver to get the assistant
    const van = await prisma.van.findFirst({
      where: {
        assignedDriverId: driverId
      },
      include: {
        Assistant: true
      }
    });

    if (!van || !van.Assistant) {
      return {
        error: 'No assistant assigned to this van',
        status: 404
      };
    }

    const assistant = van.Assistant;

    return {
      id: assistant.id,
      fullName: assistant.name,
      phone: assistant.contact,
      // nic: assistant.nic,
      profilePic: assistant.profilePic || null,
      // Keeping the mock data for fields not in DB schema
      experience: '3 years',
      // certifications: ['First Aid', 'Child Safety'],  
      // joinDate: new Date().toISOString().split('T')[0] // Current date as join date
    };

    //  return {
    //   fullName: 'Maria Santos',
    //   phone: '+1 (555) 123-4567',
    //   experience: '3 years',
    //   emergencyContact: '+1 (555) 987-6543',
    //   certifications: ['First Aid', 'Child Safety'],
    //   joinDate: '2021-08-15'
    // };

  } catch (error) {
    console.error('Error fetching assistant info:', error);
    throw error;
  }
}

// Function to get assigned students (lazy loaded)
async function getAssignedStudents(driverId: string) {
  try {
    // First get the van associated with the driver
    const van = await prisma.van.findFirst({
      where: {
        assignedDriverId: driverId
      },
      include: {
        Child: {
          include: {
            School: true,
            UserProfile: true // This gets the parent info
          }
        }
      }
    });

    if (!van) {
      return {
        error: 'No van assigned to this driver',
        status: 404
      };
    }

    // Transform the data to match the required format
    const students = van.Child.map(child => ({
      id: child.id.toString(),
      name: child.name,
      grade: `Grade ${child.grade}`,
      pickupLocation: child.pickupAddress,
      dropoffLocation: child.School.schoolName,
      parentContact: child.UserProfile?.mobile || 'No contact provided',
      profilePic: child.profilePicture || null
    }));

    // console.log(`Found `, students);
    return students;

  } catch (error) {
    console.error('Error fetching assigned students:', error);
    throw error;
  }
}

// Function to get route and schools (lazy loaded)
async function getRouteAndSchools(driverId: string) {
  // TODO: Replace with actual database query
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    route: {
      id: 'ROUTE001',
      name: 'North District Route',
      totalDistance: '25.3 km',
      estimatedDuration: '45 minutes',
      stops: [
        { location: 'Main Terminal', time: '07:00 AM', type: 'start' },
        { location: '123 Oak Street', time: '07:08 AM', type: 'pickup' },
        { location: '456 Pine Avenue', time: '07:15 AM', type: 'pickup' },
        { location: 'Lincoln Elementary', time: '07:25 AM', type: 'dropoff' },
        { location: 'Jefferson Middle School', time: '07:35 AM', type: 'dropoff' },
        { location: 'Washington Primary', time: '07:45 AM', type: 'dropoff' }
      ]
    },
    schools: [
      {
        id: 'SCH001',
        name: 'Lincoln Elementary School',
        address: '100 School Street',
        contact: '+1 (555) 200-0001',
        studentCount: 5
      },
      {
        id: 'SCH002',
        name: 'Jefferson Middle School',
        address: '200 Education Ave',
        contact: '+1 (555) 200-0002',
        studentCount: 4
      },
      {
        id: 'SCH003',
        name: 'Washington Primary School',
        address: '300 Learning Blvd',
        contact: '+1 (555) 200-0003',
        studentCount: 3
      }
    ]
  };
}

// This query assumes your DB is PostgreSQL with PostGIS enabled
async function getRouteStartEndCoords(pathId: string) {
  const result = await prisma.$queryRawUnsafe<
    Array<{ start_lat: number, start_lng: number, end_lat: number, end_lng: number }>
  >
  (
    `
    SELECT
      ST_Y("routeStart") as start_lat,
      ST_X("routeStart") as start_lng,
      ST_Y("routeEnd") as end_lat,
      ST_X("routeEnd") as end_lng
    FROM "Path"
    WHERE id = $1
    `,
    pathId
  );
  return result[0];
}