'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface RequirePlanProps {
  children: React.ReactNode;
}

const isDev = process.env.NODE_ENV === 'development';

export default function RequirePlan({ children }: RequirePlanProps) {
  const { user } = useAuth();
  const { data: subscription, loading } = useSubscriptionStatus(user?.email);
  const hasPlan = subscription?.hasSubscription === true || isDev;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0057FF] border-t-transparent" />
      </div>
    );
  }

  if (!hasPlan) {
    return (
      <div className="mx-auto max-w-lg py-12">
        <Card padding="lg" className="text-center shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">
            You need a plan to access this
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Upgrade to Starter, Growth or Pro to unlock Tweets, Analytics and Top Performing.
          </p>
          <div className="mt-6">
            <Link href="/#pricing">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                View plans
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            You can still use your Profile with a free account.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
