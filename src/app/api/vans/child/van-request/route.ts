// /app/api/van-requests/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log('Creating van request');
    const {vanId, childId , estimatedFare} = await req.json();

    const childID = parseInt(childId as string);
    const vanID = parseInt(vanId as string);
    const estimatedFareNum = parseFloat(estimatedFare as string);

    if (!vanID || !childID) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log('Van ID:', vanID);
    console.log('Child ID:', childID);
    console.log('Estimated Fare:', estimatedFareNum);

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
        estimatedFare: estimatedFareNum,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (err: any) {
    console.error("Error creating van request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
