import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function getUserIdFromReq(req: NextRequest): Promise<string | null> {

  const session = await getServerSession(authOptions);
  return session?.user?.id ?? null;
}

export async function GET(req: NextRequest) {
  const ownerId = await getUserIdFromReq(req);
  if (!ownerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const requests = await prisma.vanRequest.findMany({
      where: {
        status: 'PENDING',
        van: {
          ownerId: ownerId,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        child: {
          include: {
            UserProfile: true, 
            School: true,
          },
        },
        van: true,
      },
    });

    const payload = requests.map((r) => ({
      id: r.id,
      status: r.status,
      estimatedFare: r.estimatedFare,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      van: {
        id: r.vanId,
        registrationNumber: r.van?.registrationNumber ?? null,
        makeAndModel: r.van?.makeAndModel ?? null,
        licensePlateNumber: r.van?.licensePlateNumber ?? null,
      },
      child: {
        id: r.child.id,
        name: r.child.name,
        grade: r.child.grade,
        profilePicture: r.child.profilePicture,
        pickupAddress: r.child.pickupAddress,
        specialNotes: r.child.specialNotes,
        school: r.child.School ? { id: r.child.School.id, name: r.child.School.schoolName } : null,
        parent: r.child.UserProfile
          ? { id: r.child.UserProfile.id, email: r.child.UserProfile.email, firstname: r.child.UserProfile.firstname }
          : null,
      },
    }));

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error fetching van requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
