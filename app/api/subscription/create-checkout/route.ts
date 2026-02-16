import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, PLANS_PRICE_IDS, PLANS_PRODUCTS, type PlanSlug } from '@/lib/stripe';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const validPlanSlugs = ['Starter', 'Growth', 'Pro'] as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userEmail = body.userEmail ?? body.email;
    const planFromBody = (body.plan as string)?.trim();
    const planPriceIdFromBody = (body.planPriceId as string)?.trim();

    if (!userEmail || typeof userEmail !== 'string') {
      return NextResponse.json(
        { error: 'userEmail is required' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    let trialPeriodDays: number;
    const plan = planFromBody && validPlanSlugs.includes(planFromBody as typeof validPlanSlugs[number]) ? (planFromBody as PlanSlug) : 'Starter';

    if (planPriceIdFromBody && planPriceIdFromBody.startsWith('price_')) {
      lineItems = [{ price: planPriceIdFromBody, quantity: 1 }];
      trialPeriodDays = plan === 'Starter' ? 7 : 14;
    } else if (planFromBody && validPlanSlugs.includes(planFromBody as typeof validPlanSlugs[number])) {
      const planSlug = planFromBody as PlanSlug;
      let priceId = PLANS_PRICE_IDS[planSlug];
      if (!priceId) {
        const config = PLANS_PRODUCTS[planSlug];
        const product = await stripe.products.retrieve(config.productId, { expand: ['default_price'] });
        const defaultPrice = product.default_price;
        if (defaultPrice && typeof defaultPrice === 'object' && defaultPrice.id) {
          priceId = defaultPrice.id;
        } else if (defaultPrice && typeof defaultPrice === 'string') {
          priceId = defaultPrice;
        }
        if (!priceId) {
          return NextResponse.json(
            { error: `El producto "${planSlug}" no tiene un precio por defecto en Stripe. Crea un precio en Dashboard → Products → ${planSlug}.` },
            { status: 400 }
          );
        }
      }
      lineItems = [{ price: priceId, quantity: 1 }];
      trialPeriodDays = PLANS_PRODUCTS[planSlug].trialDays;
    } else {
      return NextResponse.json(
        { error: 'Invalid plan. Send plan: "Starter" | "Growth" | "Pro", or planPriceId: "price_...".' },
        { status: 400 }
      );
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      customer_email: userEmail,
      line_items: lineItems,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: trialPeriodDays,
        metadata: { plan: String(plan) },
      },
      metadata: { plan: String(plan), userEmail },
      success_url: `${frontendUrl}/dashboard?payment=success`,
      cancel_url: `${frontendUrl}/#pricing?payment=canceled`,
    };
    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed';
    const isStripeAccountSetup = typeof message === 'string' && message.includes('account or business name');
    if (isStripeAccountSetup) {
      console.error('create-checkout: Stripe account incomplete.', err);
      return NextResponse.json(
        {
          error: 'Stripe requiere completar la cuenta. Entra en https://dashboard.stripe.com/account y añade un nombre de cuenta o negocio (puedes usar tu nombre si eres particular).',
        },
        { status: 400 }
      );
    }
    const stripeError = err && typeof err === 'object' && 'type' in err && (err as { type?: string }).type === 'StripeError'
      ? (err as { message?: string }).message
      : null;
    const finalMessage = stripeError ?? message;
    console.error('create-checkout error:', err);
    return NextResponse.json({ error: finalMessage }, { status: 500 });
  }
}
