import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;

      await prisma.payment.update({
        where: { id: Number(paymentId) },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("⚠️ Webhook Error:", error);
    return new NextResponse("Webhook Error", { status: 400 });
  }
}
