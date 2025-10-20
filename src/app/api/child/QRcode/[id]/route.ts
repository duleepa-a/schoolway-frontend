import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import QRCode from 'qrcode';


export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const child = await prisma.child.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    if(child.qrCode.startsWith('LO') || child.qrCode.startsWith('DE') || !child.qrCode ){

      console.log('hello');

      const baseUrl = child.qrCode?.startsWith('DE')
        ? 'https://schoolway-frontend.vercel.app/childInfo/'
        : 'http://localhost:3000/childInfo/';

      // Generate QR
      const qrImageDataUrl = await QRCode.toDataURL(baseUrl + child.id.toString());


      const updatedChild = await prisma.child.update({
            where: { id: child.id },
            data: { qrCode: qrImageDataUrl },
      });
      return NextResponse.json(updatedChild)
    }

    return NextResponse.json(child)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching child' }, { status: 500 })
  }
}
