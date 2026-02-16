'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SubscriptionStatus } from '@/lib/subscriptionApi';
import { fetchSubscriptionStatus } from '@/lib/subscriptionApi';

export function useSubscriptionStatus(email: string | undefined) {
  const [data, setData] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(!!email);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const status = await fetchSubscriptionStatus(email);
      setData(status);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (!email) {
      setData(null);
      setLoading(false);
      return;
    }
    refetch();
  }, [email, refetch]);

  return { data, loading, error, refetch };
}
