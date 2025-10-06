// /app/api/van-requests/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log('Creating van request');
    const {vanId, childId } = await req.json();

    const childID = parseInt(childId as string);
    const vanID = parseInt(vanId as string);

    if (!vanID || !childID) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log('Van ID:', vanID);
    console.log('Child ID:', childID);

    // Check if child already has a request
    const existing = await prisma.vanRequest.findUnique({
      where: { childId : childID  },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This child already has a pending/active request." },
        { status: 400 }
      );
    }

    const request = await prisma.vanRequest.create({
      data: {
        vanId: vanID,
        childId: childID,
      },
    });

    const updated = await prisma.child.update({
          where: { id: childID },
          data: {
            status: "REQUESTED", 
          },
    });

    if (!updated) {
        return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    return NextResponse.json(request, { status: 201 });
  } catch (err: any) {
    console.error("Error creating van request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
