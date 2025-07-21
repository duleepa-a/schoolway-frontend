import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const schools = await prisma.school.findMany();
        return NextResponse.json(schools);
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch schools: ${error}` }, { status: 500 });
    }
}