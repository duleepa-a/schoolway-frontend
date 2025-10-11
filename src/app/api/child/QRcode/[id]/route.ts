import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const child = await prisma.child.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 })
    }

    return NextResponse.json(child)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error fetching child' }, { status: 500 })
  }
}
