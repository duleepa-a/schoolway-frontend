// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { schoolId: string } }
// ): Promise<NextResponse> {
//   try {
//     const schoolId = params.schoolId;

//     if (!schoolId) {
//       return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
//     }

//     const guardians = await prisma.schoolGuardian.findMany({
//       where: { schoolId: Number(schoolId) },
//       select: {
//         guardianId: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//       },
//     });

//     return NextResponse.json({ guardians }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching guardians:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch guardians', details: String(error) },
//       { status: 500 }
//     );
//   }
// }
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