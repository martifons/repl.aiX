import Stripe from 'stripe';

function getSecret() {
  const s = process.env.STRIPE_SECRET_KEY;
  if (!s) throw new Error('Missing STRIPE_SECRET_KEY');
  return s;
}

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(getSecret());
  return _stripe;
}

/** Price IDs (opcional). Si no están definidos, se usan STRIPE_PRODUCT_* con price_data. */
export const PLANS_PRICE_IDS = {
  Starter: process.env.STRIPE_PRICE_STARTER ?? '',
  Growth: process.env.STRIPE_PRICE_GROWTH ?? '',
  Pro: process.env.STRIPE_PRICE_PRO ?? '',
} as const;

/** Product IDs y precios mensuales (cents). Usados cuando no hay Price ID configurado. */
export const PLANS_PRODUCTS: Record<keyof typeof PLANS_PRICE_IDS, { productId: string; amountCents: number; trialDays: number }> = {
  Starter: {
    productId: process.env.STRIPE_PRODUCT_STARTER ?? 'prod_TyMiMIxiBL54GD',
    amountCents: 1500, // $15/mo
    trialDays: 7,
  },
  Growth: {
    productId: process.env.STRIPE_PRODUCT_GROWTH ?? 'prod_TyMjQ1ndndZESA',
    amountCents: 2900, // $29/mo
    trialDays: 14,
  },
  Pro: {
    productId: process.env.STRIPE_PRODUCT_PRO ?? 'prod_TyMkOWUFDQetxi',
    amountCents: 4900, // $49/mo
    trialDays: 14,
  },
};

export type PlanSlug = keyof typeof PLANS_PRICE_IDS;
