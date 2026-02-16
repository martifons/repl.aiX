import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { error: 'email query param is required' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({
        hasSubscription: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        customerId: null,
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      expand: ['data.items.data.price.product'],
    });

    const active = subscriptions.data.find(
      (s) => s.status === 'active' || s.status === 'trialing'
    );

    if (!active) {
      return NextResponse.json({
        hasSubscription: false,
        plan: null,
        status: null,
        currentPeriodEnd: null,
        customerId: customer.id,
      });
    }

    const firstItem = active.items.data[0];
    const product = firstItem?.price?.product;
    const productName =
      typeof product === 'object' && product && 'name' in product
        ? (product as { name?: string }).name
        : null;
    const plan =
      active.metadata?.plan ||
      productName ||
      firstItem?.price?.nickname ||
      null;
    const currentPeriodEnd = firstItem?.current_period_end ?? null;
    const trialEnd = active.trial_end ?? null;

    return NextResponse.json({
      hasSubscription: true,
      plan,
      status: active.status,
      currentPeriodEnd,
      customerId: customer.id,
      trialEnd,
    });
  } catch (err) {
    console.error('subscription status error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Status failed' },
      { status: 500 }
    );
  }
}
