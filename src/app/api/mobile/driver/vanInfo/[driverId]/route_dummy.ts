import { NextRequest, NextResponse } from 'next/server';

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

// Function to get basic vehicle info (always loaded)
async function getDriverVehicleInfo(driverId: string) {
  // TODO: Replace with actual database query
  return {
    id: 'VAN001',
    model: 'Toyota Hiace 2023',
    licensePlate: 'ABC-1234',
    status: 'active',
    image: null, // Will use dummy image
    ownerName: 'SchoolWay Transport Co.',
    capacity: 15,
    year: 2023,
    fuelType: 'Diesel',
    route: {
      startLocation: 'Main Terminal',
      endLocation: 'Central School District'
    },
    stats: {
      studentCount: 12,
      schoolCount: 3,
      rating: 4.8
    }
  };
}

// Function to get assistant info (lazy loaded)
async function getAssistantInfo(driverId: string) {
  // TODO: Replace with actual database query
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    fullName: 'Maria Santos',
    phone: '+1 (555) 123-4567',
    experience: '3 years',
    emergencyContact: '+1 (555) 987-6543',
    certifications: ['First Aid', 'Child Safety'],
    joinDate: '2021-08-15'
  };
}

// Function to get assigned students (lazy loaded)
async function getAssignedStudents(driverId: string) {
  // TODO: Replace with actual database query
  // Simulate loading time
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return [
    {
      id: 'STU001',
      name: 'Alex Johnson',
      grade: 'Grade 5',
      pickupLocation: '123 Oak Street',
      dropoffLocation: 'Lincoln Elementary',
      parentContact: '+1 (555) 111-2222'
    },
    {
      id: 'STU002',
      name: 'Sarah Williams',
      grade: 'Grade 7',
      pickupLocation: '456 Pine Avenue',
      dropoffLocation: 'Jefferson Middle School',
      parentContact: '+1 (555) 333-4444'
    },
    {
      id: 'STU003',
      name: 'Michael Brown',
      grade: 'Grade 3',
      pickupLocation: '789 Elm Drive',
      dropoffLocation: 'Washington Primary',
      parentContact: '+1 (555) 555-6666'
    },
    {
      id: 'STU004',
      name: 'Emma Davis',
      grade: 'Grade 6',
      pickupLocation: '321 Maple Lane',
      dropoffLocation: 'Roosevelt Elementary',
      parentContact: '+1 (555) 777-8888'
    }
  ];
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