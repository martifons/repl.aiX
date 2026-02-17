'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAnalyticsKPIs } from '@/services/analyticsService';
import { useXAnalytics, type XActivityItem } from '@/hooks/useXAnalytics';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import { mockActivity } from '@/lib/mockActivity';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageContainer, PageHeader } from '@/components/ui/PageContainer';

function DashboardContent() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { data: xData, loading: xLoading, refetch: refetchX } = useXAnalytics();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);
  const kpis = useMemo(() => {
    if (xData?.real && !xLoading) {
      return {
        followersGrowth: xData.followersGrowth,
        followersCurrent: xData.followersCurrent,
        repliesSentOverTime: xData.repliesSentOverTime,
        engagementReceivedOverTime: xData.engagementReceivedOverTime,
      };
    }
    return getAnalyticsKPIs();
  }, [xData, xLoading]);
  const useReal = xData?.real && !xLoading;
  const repliesArray = kpis.repliesSentOverTime;
  const engagementArray = kpis.engagementReceivedOverTime;
  const last7Replies = useReal && repliesArray.length >= 7 ? repliesArray.slice(-7) : repliesArray;
  const last7Engagement = useReal && engagementArray.length >= 7 ? engagementArray.slice(-7) : engagementArray;
  const repliesThisWeek = last7Replies.reduce((a, b) => a + b, 0);
  const engagementGained = last7Engagement.reduce((a, b) => a + b, 0);
  const { data: subscription, loading: subscriptionLoading } = useSubscriptionStatus(user?.email);
  const [activities, setActivities] = useState<XActivityItem[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    setActivityLoading(true);
    const headers: HeadersInit = {};
    if (user?.providerToken) headers['x-provider-token'] = user.providerToken;
    fetch('/api/x/activity', { headers, credentials: 'include' })
      .then((res) => (res.ok ? res.json() : { activities: [] }))
      .then((data) => {
        if (!cancelled && Array.isArray(data.activities) && data.activities.length > 0) {
          setActivities(data.activities);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setActivityLoading(false); });
    return () => { cancelled = true; };
  }, [user?.providerToken]);

  useEffect(() => {
    if (!xLoading && user && !xData?.real && xData === null) {
      const t = setTimeout(() => refetchX(), 1500);
      return () => clearTimeout(t);
    }
  }, [user, xLoading, xData, refetchX]);

  const displayActivity = activities.length > 0 ? activities : mockActivity;
  const isDev = process.env.NODE_ENV === 'development';
  const hasPlan = subscription?.hasSubscription === true || isDev;
  const showUpgradeBanner = !subscriptionLoading && !hasPlan;

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true);
      window.history.replaceState({}, '', '/dashboard');
      const t = setTimeout(() => setPaymentSuccess(false), 6000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  return (
    <PageContainer className="space-y-8">
      {paymentSuccess && (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          role="status"
        >
          Payment successful. Your plan is now active.
        </div>
      )}
      {showUpgradeBanner && (
        <div className="rounded-xl border-2 border-[#0057FF]/30 bg-[#0057FF]/5 px-4 py-4 text-center">
          <p className="text-sm font-medium text-[#1A1A1A]">You&apos;re on the free view.</p>
          <p className="mt-1 text-sm text-gray-600">Upgrade to unlock Tweets, Analytics and Top Performing.</p>
          <Link href="/#pricing" className="mt-3 inline-block rounded-[12px] bg-[#0057FF] px-4 py-2.5 text-sm font-medium text-white shadow-[0_4px_16px_rgba(0,87,255,0.35)] hover:bg-[#0047dd] transition-colors">
            View plans
          </Link>
        </div>
      )}
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name ?? 'User'}`}
      />

      {/* Stats */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Replies this week</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
            <AnimatedCounter value={repliesThisWeek} />
          </p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Engagement gained</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
            <AnimatedCounter value={engagementGained} />
          </p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Followers growth</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#0057FF] tabular-nums">
            +<AnimatedCounter value={kpis.followersGrowth} />
          </p>
        </Card>
      </div>

      {/* Activity + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="none">
          <CardHeader className="px-5 pt-5">
            <h2 className="text-sm font-semibold text-gray-900">Recent activity</h2>
          </CardHeader>
          <ul className="divide-y divide-gray-100">
            {(activityLoading && activities.length === 0 ? mockActivity : displayActivity).map((item) => (
              <li key={item.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#0057FF]/5 transition-colors duration-200 rounded-lg">
                <span
                  className={`mt-1.5 flex h-2 w-2 shrink-0 rounded-full ${
                    item.type === 'reply' ? 'bg-[#0057FF]' : item.type === 'likes' ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                />
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate sm:whitespace-normal sm:break-words">{item.text}</p>
                  {item.meta && <p className="mt-0.5 text-xs text-gray-500">{item.meta}</p>}
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-900">Quick actions</h2>
          <p className="mt-1 text-sm text-gray-500">Find tweets and generate AI replies</p>
          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/dashboard/tweets"
              className="flex items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-sm font-medium text-gray-900 hover:border-[#0057FF]/30 hover:bg-[#0057FF]/8 hover:shadow-[0_0_24px_rgba(0,87,255,0.08)] transition-all duration-300"
            >
              <span>Go to Tweets feed</span>
              <span className="text-[#0057FF]">→</span>
            </Link>
            <Link
              href="/dashboard/top-performing"
              className="flex items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-sm font-medium text-gray-900 hover:border-[#0057FF]/30 hover:bg-[#0057FF]/8 hover:shadow-[0_0_24px_rgba(0,87,255,0.08)] transition-all duration-300"
            >
              <span>Top performing replies</span>
              <span className="text-[#0057FF]">→</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className="flex items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-sm font-medium text-gray-900 hover:border-[#0057FF]/30 hover:bg-[#0057FF]/8 hover:shadow-[0_0_24px_rgba(0,87,255,0.08)] transition-all duration-300"
            >
              <span>View analytics</span>
              <span className="text-[#0057FF]">→</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 py-3 text-sm font-medium text-gray-900 hover:border-[#0057FF]/30 hover:bg-[#0057FF]/8 hover:shadow-[0_0_24px_rgba(0,87,255,0.08)] transition-all duration-300"
            >
              <span>Edit profile</span>
              <span className="text-[#0057FF]">→</span>
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <PageContainer>
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </PageContainer>
    }>
      <DashboardContent />
    </Suspense>
  );
}
