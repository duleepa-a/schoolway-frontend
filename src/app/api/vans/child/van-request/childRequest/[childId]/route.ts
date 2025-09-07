// /app/api/van-requests/[childId]/route.ts
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET: fetch van request for a child
export async function GET(req: Request, { params }: { params: { childId: string } }) {
  try {
    const request = await prisma.vanRequest.findUnique({
      where: { childId: Number(params.childId) },
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
export async function DELETE(req: Request, { params }: { params: { childId: string } }) {
  try {
    await prisma.vanRequest.delete({
      where: { childId: Number(params.childId) },
    });

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
