import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { fare } = await request.json();
        const { id } = params;
        if (!id || fare == null) {
            return NextResponse.json({ error: 'Missing id or fare' }, { status: 400 });
        }
        const updated = await prisma.privateHire.update({
            where: { id },
            data: {
                finalFare: fare,
                status: 'ACCEPTED',
                updatedAt: new Date(),
            },
        });
        return NextResponse.json({ hire: updated }, { status: 200 });
    } catch (error) {
        console.error('Update Hire Fare Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
