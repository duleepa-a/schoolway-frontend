import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; 
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vanOwnerId = session.user.id;

  try {
    const requests = await prisma.driverVanJobRequest.findMany({
      where: {
        vanOwnerId,
      },
      include: {
        UserProfile_DriverVanJobRequest_driverIdToUserProfile: true,
        Van: true,
      },
    });

    const formatted = requests.map((req) => ({
      name: `${req.UserProfile_DriverVanJobRequest_driverIdToUserProfile.firstname ?? ''} ${req.UserProfile_DriverVanJobRequest_driverIdToUserProfile.lastname ?? ''}`,
      van: req.Van?.makeAndModel ?? 'Unnamed Van',
      status: req.status,
      avatar: req.UserProfile_DriverVanJobRequest_driverIdToUserProfile.dp ?? '/Images/male_pro_pic_placeholder.png',
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
