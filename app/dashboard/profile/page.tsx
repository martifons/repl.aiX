'use client';

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getHighResAvatarUrl } from '@/lib/avatarUtils';
import { getUserProfile, getGrowthSummaryMessage } from '@/services/analyticsService';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { useXMe, useXAnalytics } from '@/hooks/useXAnalytics';
import { createPortalSession } from '@/lib/subscriptionApi';
import type { UserProfile } from '@/types';
import { Card } from '@/components/ui/Card';
import { PageContainer, PageHeader } from '@/components/ui/PageContainer';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const { data: subscription, loading: subLoading, refetch: refetchSub } = useSubscriptionStatus(authUser?.email);
  const { data: xMe } = useXMe();
  const { data: xAnalytics } = useXAnalytics();
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fullProfile = useMemo(() => {
    if (!mounted || !authUser) return null;
    return getUserProfile(authUser);
  }, [mounted, authUser]);

  useEffect(() => {
    setProfile(fullProfile);
  }, [fullProfile]);

  const pct = profile ? Math.round((profile.repliesUsedToday / profile.repliesLimit) * 100) : 0;

  if (!authUser) return null;

  const displayPlan = subscription?.plan ?? authUser?.plan ?? 'Trial';
  const planToLimit: Record<string, number> = { Starter: 15, Trial: 15, Pro: 30, Growth: 50 };
  const repliesLimitFromPlan = planToLimit[subscription?.plan ?? authUser?.plan ?? 'Starter'] ?? 15;
  const baseDisplay = profile ?? {
    name: authUser.name,
    username: authUser.username,
    email: authUser.email,
    avatar: authUser.avatar,
    plan: displayPlan as UserProfile['plan'],
    followers: 0,
    joinDate: authUser.joinDate,
    repliesUsedToday: authUser.repliesUsedToday,
    repliesLimit: authUser.repliesLimit,
    totalRepliesSent: 0,
    totalEngagementReceived: 0,
  };
  const display = {
    ...baseDisplay,
    followers: xMe?.public_metrics?.followers_count ?? baseDisplay.followers,
    totalRepliesSent: xAnalytics?.real && xAnalytics.totalReplies != null ? xAnalytics.totalReplies : baseDisplay.totalRepliesSent,
    totalEngagementReceived: xAnalytics?.real && xAnalytics.totalEngagement != null ? xAnalytics.totalEngagement : baseDisplay.totalEngagementReceived,
    repliesUsedToday: xAnalytics?.real && xAnalytics.repliesToday != null ? xAnalytics.repliesToday : baseDisplay.repliesUsedToday,
    repliesLimit: subscription?.plan ? repliesLimitFromPlan : baseDisplay.repliesLimit,
  };
  const growthMessage = xAnalytics?.real && display.totalEngagementReceived != null
    ? `Your replies generated ${display.totalEngagementReceived.toLocaleString()} engagements. Keep going!`
    : (mounted && authUser ? getGrowthSummaryMessage(authUser) : '');

  const handleManageSubscription = async () => {
    if (!authUser?.email) {
      setPortalError('Add an email to your X account to manage subscription.');
      return;
    }
    setPortalLoading(true);
    setPortalError(null);
    try {
      const { url } = await createPortalSession(authUser.email, subscription?.customerId ?? undefined);
      if (url) window.location.href = url;
      else setPortalError('Could not open billing portal');
    } catch (e) {
      setPortalError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        title="Profile"
        description="Your account and growth summary"
      />

      <Card padding="none" className="overflow-hidden">
        <div className="h-28 bg-gradient-to-br from-[#0057FF] to-[#66B2FF]" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col sm:flex-row sm:items-end sm:gap-6">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-2 ring-[#0057FF]/20 ring-offset-2 transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(0,87,255,0.15)]">
              <Image src={getHighResAvatarUrl(display.avatar) || display.avatar} alt="" width={96} height={96} className="object-cover" />
            </div>
            <div className="mt-4 sm:mt-0 sm:pb-1">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{display.name}</h2>
              <p className="text-gray-600">{display.username}</p>
              <p className="mt-0.5 text-sm text-gray-500">{display.email || '—'}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-medium text-gray-700">
                  {display.followers?.toLocaleString() ?? '—'} followers
                </span>
                <span className="rounded-full bg-[#0057FF]/10 px-2.5 py-0.5 font-medium text-[#0057FF]">
                  {subscription?.plan ?? display.plan}
                </span>
                <span className="text-gray-500">
                  Member since {new Date(display.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {growthMessage && (
        <Card padding="lg" className="border-[#0057FF]/20 bg-gradient-to-br from-[#0057FF]/5 to-transparent">
          <h3 className="text-sm font-semibold text-gray-900">Growth Summary</h3>
          <p className="mt-2 text-base text-gray-700">{growthMessage}</p>
        </Card>
      )}

      <Card padding="lg">
        <h3 className="text-sm font-semibold text-gray-900">Stats</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/60 bg-white/50 p-4 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,87,255,0.08)] hover:border-[#0057FF]/20">
            <p className="text-sm font-medium text-gray-500">Total replies sent</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
              {display.totalRepliesSent ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/50 p-4 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,87,255,0.08)] hover:border-[#0057FF]/20">
            <p className="text-sm font-medium text-gray-500">Total engagement received</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-[#0057FF]">
              {(display.totalEngagementReceived ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h3 className="text-sm font-semibold text-gray-900">Plan & usage</h3>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#0057FF]/10 px-3 py-1 text-sm font-medium text-[#0057FF]">
            {subscription?.plan ?? display.plan}
          </span>
          <span className="text-sm text-gray-500">
            Member since {new Date(display.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          {subscription?.currentPeriodEnd && (
            <span className="text-sm text-gray-500">
              Renews {new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {subscription?.trialEnd && subscription.status === 'trialing' && (
            <span className="text-sm text-amber-600">
              Trial ends {new Date(subscription.trialEnd * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
        {subscription?.hasSubscription && (
          <div className="mt-4">
            {authUser?.email ? (
              <>
                <button
                  type="button"
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                  className="rounded-[12px] border-2 border-[#0057FF] bg-white px-4 py-2.5 text-sm font-medium text-[#0057FF] transition-all duration-200 hover:bg-[#0057FF]/10 active:scale-[0.98] disabled:opacity-70"
                >
                  {portalLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Opening…
                    </span>
                  ) : (
                    'Manage subscription'
                  )}
                </button>
                {portalError && (
                  <p className="mt-2 text-sm text-red-600" role="alert">{portalError}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">Add an email to your X account to manage subscription here.</p>
            )}
          </div>
        )}
        <div className="mt-5">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">Replies today</span>
            <span className="tabular-nums text-gray-600">
              {display.repliesUsedToday} / {display.repliesLimit}
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#0057FF] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Daily limit resets at midnight. Upgrade your plan for more replies.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
