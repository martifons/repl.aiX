import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userEmail = body.userEmail ?? body.email;
    const customerId = body.customerId ?? body.stripeCustomerId;

    let stripeCustomerId = customerId;

    const stripe = getStripe();
    if (!stripeCustomerId && userEmail) {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });
      const customer = customers.data[0];
      if (!customer) {
        return NextResponse.json(
          { error: 'No Stripe customer found for this email. Subscribe first.' },
          { status: 404 }
        );
      }
      stripeCustomerId = customer.id;
    }

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: 'userEmail or customerId is required' },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${frontendUrl}/dashboard/profile`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error('create-portal error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Portal failed' },
      { status: 500 }
    );
  }
}
