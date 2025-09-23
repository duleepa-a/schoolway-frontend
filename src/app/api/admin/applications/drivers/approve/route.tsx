import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { renderDriverApprovalEmail, sendEmail } from '@/lib/email';

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const updated = await prisma.driverProfile.update({
      where: { userId: userId },
      data: {
        status: 1, // mark as approved/active
      },
    });

    // Fetch user profile to get email and first name
    const user = await prisma.userProfile.findUnique({
      where: { id: userId },
      select: { email: true, firstname: true },
    })

    if (user?.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Your driver application has been approved',
          html: renderDriverApprovalEmail(user.firstname ?? 'there'),
        })
      } catch (emailErr) {
        console.error('Failed to send approval email:', emailErr)
        // Do not fail the API because of email issues
      }
    }

    return NextResponse.json({ message: 'Driver approved', user: updated });
  } catch (error) {
    console.error('Error approving driver:', error);
    return NextResponse.json({ error: 'Error approving driver' }, { status: 500 });
  }
}
