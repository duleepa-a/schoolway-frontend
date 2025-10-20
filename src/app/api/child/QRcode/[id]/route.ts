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

    if(!child.qrCode || child.qrCode.startsWith('QR')){
      const qrImageDataUrl = await QRCode.toDataURL('http://localhost:3000/childInfo/' + child.id.toString());
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
