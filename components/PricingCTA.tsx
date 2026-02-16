'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createCheckoutSession } from '@/lib/subscriptionApi';

type PlanSlug = 'Starter' | 'Growth' | 'Pro';

interface PricingCTAProps {
  plan: PlanSlug;
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
}

export function PricingCTA({ plan, variant = 'secondary', className = '', children }: PricingCTAProps) {
  const { user, isLogged } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const { url } = await createCheckoutSession(plan, user.email);
      if (url) window.location.href = url;
      else setError('No checkout URL received');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isPrimary = variant === 'primary';
  const baseClass =
    'mt-8 block w-full rounded-[12px] py-3.5 text-center text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0057FF] focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none';

  if (!isLogged) {
    return (
      <Link
        href="/signup"
        className={`${baseClass} ${
          isPrimary
            ? 'bg-[#0057FF] text-white shadow-[0_4px_16px_rgba(0,87,255,0.35)] hover:bg-[#0047dd] hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(0,87,255,0.4)]'
            : 'border-2 border-gray-300 text-[#333333] hover:border-[#0057FF] hover:bg-[#0057FF]/5 hover:text-[#0057FF] hover:translate-y-[-2px] hover:shadow-[0_4px_16px_rgba(0,87,255,0.2)]'
        } ${className}`}
      >
        {children ?? 'Get started'}
      </Link>
    );
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading}
        className={`${baseClass} ${
          isPrimary
            ? 'bg-[#0057FF] text-white shadow-[0_4px_16px_rgba(0,87,255,0.35)] hover:bg-[#0047dd] hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(0,87,255,0.4)] active:scale-[0.98]'
            : 'border-2 border-gray-300 text-[#333333] hover:border-[#0057FF] hover:bg-[#0057FF]/5 hover:text-[#0057FF] hover:translate-y-[-2px] hover:shadow-[0_4px_16px_rgba(0,87,255,0.2)] active:scale-[0.98]'
        } ${className}`}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Redirecting to checkout…
          </span>
        ) : (
          children ?? 'Subscribe'
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
