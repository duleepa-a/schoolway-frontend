import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import dayjs from "dayjs";


export async function GET() {
  const month = dayjs().format("MMMM YYYY"); // e.g. "October 2025"

  const children = await prisma.child.findMany({
    where: { 
        status: {
            not: "NOT_ASSIGNED"
        }
    },
  });

  for (const child of children) {
    const existing = await prisma.payment.findFirst({
      where: { childId: child.id, month },
    });

    if (!child.vanID) {
        throw new Error(`Child ${child.id} does not have a van assigned.`);
    }

    if (!existing) {
      await prisma.payment.create({
        data: {
          childId: child.id,
          parentId: child.parentId || '',
          vanId: child.vanID,
          amount: child.feeAmount, 
          month,
        },
      });
    }
  }

  return NextResponse.json({ message: `✅ Monthly payments created for ${month}` });
}


/*

After deployed, In your vercel.json, add the following under the "crons" section:
{
  "crons": [
    {
      "path": "/api/payments/generate",
      "schedule": "0 0 1 * *"
    }
  ]
}

*/