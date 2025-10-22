// File: /app/api/mobile/driver/qr/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import QRCode from 'qrcode';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId: id },
      include: { UserProfile: true },
    });

    if (!driverProfile) {
      return NextResponse.json({ success: false, message: 'Driver not found' }, { status: 404 });
    }

    // If QR code is not stored yet, generate it
    if (
        driverProfile.Qrcode?.startsWith('LO') || driverProfile.Qrcode?.startsWith('DE') || !driverProfile.Qrcode
    )
    {

      const baseUrl = (driverProfile.Qrcode?.startsWith('DE') || process.env.NODE_ENV === 'production' )
          ? 'https://schoolway-frontend.vercel.app/guardian/driverInfo/'
          : 'http://localhost:3000/guardian/driverInfo/';

      const qrDataUrl = await QRCode.toDataURL(baseUrl + driverProfile.userId.toString());

      const updatedDriver = await prisma.driverProfile.update({
        where: { id: driverProfile.id },
        data: { Qrcode: qrDataUrl },
      });

      return NextResponse.json({ success: true, qrCode: updatedDriver.Qrcode });
    }

    return NextResponse.json({ success: true, qrCode: driverProfile.Qrcode });
  } catch (error) {
    console.error('Error generating driver QR:', error);
    return NextResponse.json({ success: false, message: 'Error fetching driver QR' }, { status: 500 });
  }
}
