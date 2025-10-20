import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }
        const updated = await prisma.privateHire.update({
            where: { id },
            data: {
                status: 'REJECTED',
                updatedAt: new Date(),
            },
        });
        return NextResponse.json({ hire: updated }, { status: 200 });
    } catch (error) {
        console.error('Accept Hire Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
