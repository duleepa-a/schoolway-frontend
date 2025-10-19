import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-08-16' });

export async function POST(request: Request) {
  try {
    const { tripId, userId, ownerId, tripFare, serviceFee } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'lkr', // or 'usd', etc.
            product_data: {
              name: `Private Hire Trip ${tripId}`,
              description: `Payment for trip by user ${userId} to owner ${ownerId}`,
            },
            unit_amount: Math.round((tripFare + serviceFee) * 100), // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://schoolway-frontend.vercel.app/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://schoolway-frontend.vercel.app/payments/cancel`,
      metadata: {
        tripId,
        userId,
        ownerId,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}