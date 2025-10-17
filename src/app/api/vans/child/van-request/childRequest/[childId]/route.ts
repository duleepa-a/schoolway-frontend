// /app/api/van-requests/[childId]/route.ts
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: fetch van request for a child
export async function GET(req: Request, { params }: { params: Promise<{ childId: string }> }) {
  try {
    const resolvedParams = await params;
    const request = await prisma.vanRequest.findUnique({
      where: { childId: Number(resolvedParams.childId) },
      include: { van: true, child: true },
    });

    if (!request) return NextResponse.json(null, { status: 200 });

    return NextResponse.json(request);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE: cancel van request
export async function DELETE(req: Request, { params }: { params: Promise<{ childId: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.vanRequest.delete({
      where: { childId: Number(resolvedParams.childId) },
    });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
