// app/api/vanowner/enrolled-students/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  const ownerId = session?.user?.id ?? null;
  if (!ownerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find all vans owned by this user
    const vans = await prisma.van.findMany({
      where: { ownerId },
      select: { id: true },
    });
    const vanIds = vans.map(v => v.id);
    if (vanIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch children assigned to those vans
    const children = await prisma.child.findMany({
      where: { vanID: { in: vanIds } },
      include: {
        Van: {
          select: { id: true, makeAndModel: true, licensePlateNumber: true, registrationNumber: true }
        },
        UserProfile: {
          select: { id: true, firstname: true, email: true, dp: true , mobile: true }
        },
        School: {
          select: { id: true, schoolName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const payload = children.map(c => ({
      id: c.id,
      name: c.name,
      grade: c.grade,
      profilePicture: c.profilePicture ?? '/Images/male_pro_pic_placeholder.png',
      van: c.Van ? { id: c.Van.id, name: c.Van.makeAndModel, plateNumber: c.Van.licensePlateNumber } : null,
      contactParent: c.UserProfile ? (c.UserProfile.mobile ?? c.UserProfile.email) : null,
      joinedDate: c.createdAt,
      pickupAddress: c.pickupAddress,
      specialNotes: c.specialNotes,
      status: c.status === 'INACTIVE' ? 'Inactive' : 'Active', 
    }));

    return NextResponse.json(payload);
  } catch (err) {
    console.error('GET enrolled students error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
