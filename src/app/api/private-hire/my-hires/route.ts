import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateDistance } from '@/utils/calculateDistance';

// GET: expects ?userId=...
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
        }
        const hires = await prisma.privateHire.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                Van: {
                    select: {
                        ownerId: true,
                    },
                },
            },
        });
        // Add tripDistance to each hire
        const hiresWithDistance = hires.map(hire => ({
            ...hire,
            tripDistance:
                (typeof hire.pickupLat === 'number' && typeof hire.pickupLng === 'number' && typeof hire.destinationLat === 'number' && typeof hire.destinationLng === 'number')
                    ? calculateDistance(hire.pickupLat, hire.pickupLng, hire.destinationLat, hire.destinationLng)
                    : null
        }));

        return NextResponse.json({ hires: hiresWithDistance }, { status: 200 });
    } catch (error: unknown) {
        console.error('Fetch My Hires Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}



