import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
		});
		return NextResponse.json({ hires }, { status: 200 });
	} catch (error: unknown) {
		console.error('Fetch My Hires Error:', error);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}



