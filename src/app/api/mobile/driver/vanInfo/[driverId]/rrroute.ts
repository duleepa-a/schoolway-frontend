import { NextRequest, NextResponse } from 'next/server';

// Mock data functions - replace with your actual data fetching logic
async function getUserData(driverId: string) {
  // Replace with actual database call
  return { driverId, name: 'Driver Name', license: 'ABC123' };
}

async function getDriverVehicleData(driverId: string) {
  // Replace with actual database call
  return { driverId, vehicleId: 'VAN001', model: 'Toyota Hiace', plateNumber: 'XYZ789' };
}

async function getDriverAssistantData(driverId: string) {
  // Replace with actual database call
  return { driverId, assistantName: 'Assistant Name', phone: '+1234567890' };
}

async function getDriverStudents(driverId: string) {
  // Replace with actual database call
  return [
    { id: 1, name: 'Student 1', grade: '5A' },
    { id: 2, name: 'Student 2', grade: '5B' }
  ];
}

async function getDriverRoute(driverId: string) {
  // Replace with actual database call
  return {
    driverId,
    route: 'Route A',
    schools: ['School 1', 'School 2'],
    stops: ['Stop 1', 'Stop 2', 'Stop 3']
  };
}

async function getAllDriverData(driverId: string) {
  const [profile, vanInfo, assistant, students, route] = await Promise.all([
    getUserData(driverId),
    getDriverVehicleData(driverId),
    getDriverAssistantData(driverId),
    getDriverStudents(driverId),
    getDriverRoute(driverId)
  ]);

  return {
    profile,
    vanInfo,
    assistant,
    students,
    route
  };
}

async function getBatchDriverData(driverId: string, sections: string[]) {
  const data: any = {};
  
  const promises = sections.map(async (section) => {
    switch (section) {
      case 'profile':
        data.profile = await getUserData(driverId);
        break;
      case 'vaninfo':
        data.vanInfo = await getDriverVehicleData(driverId);
        break;
      case 'assistant':
        data.assistant = await getDriverAssistantData(driverId);
        break;
      case 'students':
        data.students = await getDriverStudents(driverId);
        break;
      case 'route':
        data.route = await getDriverRoute(driverId);
        break;
    }
  });

  await Promise.all(promises);
  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { driverId: string } }
) {
  try {
    const { driverId } = params;
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'profile';
    const includes = searchParams.get('includes');

    // Handle batch requests
    if (section === 'batch' && includes) {
      const sections = includes.split(',').map(s => s.trim());
      const data = await getBatchDriverData(driverId, sections);
      return NextResponse.json(data);
    }

    // Handle individual section requests
    switch (section) {
      case 'profile':
        const userData = await getUserData(driverId);
        return NextResponse.json(userData);
        
      case 'vaninfo':
        const vanData = await getDriverVehicleData(driverId);
        return NextResponse.json(vanData);
        
      case 'assistant':
        const assistantData = await getDriverAssistantData(driverId);
        return NextResponse.json(assistantData);
        
      case 'students':
        const students = await getDriverStudents(driverId);
        return NextResponse.json(students);
        
      case 'route':
        const routeData = await getDriverRoute(driverId);
        return NextResponse.json(routeData);
        
      case 'complete':
        const allData = await getAllDriverData(driverId);
        return NextResponse.json(allData);
        
      default:
        const defaultData = await getUserData(driverId);
        return NextResponse.json(defaultData);
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}