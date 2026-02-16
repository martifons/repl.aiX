export interface SubscriptionStatus {
  hasSubscription: boolean;
  plan: string | null;
  status: string | null;
  currentPeriodEnd: number | null;
  customerId: string | null;
  trialEnd: number | null;
}

export async function fetchSubscriptionStatus(
  email: string
): Promise<SubscriptionStatus> {
  const params = new URLSearchParams({ email });
  const res = await fetch(`/api/subscription/status?${params}`);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

export async function createCheckoutSession(plan: string, userEmail: string): Promise<{ url: string }> {
  const res = await fetch('/api/subscription/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, userEmail }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'Checkout failed');
  }
  return data;
}

export async function createPortalSession(userEmail: string, customerId?: string): Promise<{ url: string }> {
  const res = await fetch('/api/subscription/create-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userEmail, customerId }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'Portal failed');
  }
  return data;
}
