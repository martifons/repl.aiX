'use client';

import { useMemo, useEffect, useState } from 'react';
import {
  getAnalyticsKPIs,
  getFollowersChartData,
  getRepliesOverTime,
  getEngagementOverTime,
  getBestHoursHeatmap,
} from '@/services/analyticsService';
import { useXAnalytics } from '@/hooks/useXAnalytics';
import RequirePlan from '@/components/RequirePlan';
import { Card } from '@/components/ui/Card';
import { PageContainer, PageHeader } from '@/components/ui/PageContainer';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function AnalyticsPageContent() {
  const [mounted, setMounted] = useState(false);
  const { data: xData, loading: xLoading } = useXAnalytics();
  useEffect(() => setMounted(true), []);

  const useReal = mounted && xData?.real && !xLoading;
  const kpis = useMemo(() => {
    if (useReal && xData) {
      return {
        followersGrowth: xData.followersGrowth,
        followersCurrent: xData.followersCurrent,
        repliesSentOverTime: xData.repliesSentOverTime,
        engagementReceivedOverTime: xData.engagementReceivedOverTime,
        replySuccessRate: xData.replySuccessRate,
        bestPostingHours: xData.bestPostingHours,
        topKeywords: xData.topKeywords?.length ? xData.topKeywords : [{ keyword: '—', count: 0, engagement: 0 }],
      };
    }
    return mounted ? getAnalyticsKPIs() : null;
  }, [mounted, useReal, xData]);
  const followersChart = useMemo(() => {
    if (useReal && xData?.followersChart?.length) return xData.followersChart;
    return mounted ? getFollowersChartData(30) : [];
  }, [mounted, useReal, xData]);
  const repliesChart = useMemo(() => {
    if (useReal && xData?.byDay14?.length) {
      return xData.byDay14.map((d) => ({ date: d.date, count: d.replies }));
    }
    return mounted ? getRepliesOverTime(14) : [];
  }, [mounted, useReal, xData]);
  const engagementChart = useMemo(() => {
    if (useReal && xData?.byDay14?.length) {
      return xData.byDay14.map((d) => ({ date: d.date, count: d.engagement }));
    }
    return mounted ? getEngagementOverTime(14) : [];
  }, [mounted, useReal, xData]);
  const heatmap = useMemo(() => (mounted ? getBestHoursHeatmap() : []), [mounted]);

  const maxFollowers = useMemo(() => Math.max(...followersChart.map((d) => d.followers), 1), [followersChart]);
  const minFollowers = useMemo(() => Math.min(...followersChart.map((d) => d.followers), 0), [followersChart]);
  const maxRepliesBar = Math.max(...repliesChart.map((d) => d.count), 1);
  const maxEngagementBar = Math.max(...engagementChart.map((d) => d.count), 1);
  const heatmapMax = useMemo(() => Math.max(...heatmap.map((c) => c.value), 1), [heatmap]);

  if (!kpis) {
    return (
      <PageContainer>
        <PageHeader title="Analytics" description="Your growth and engagement" />
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </PageContainer>
    );
  }

  const showTweetsPermissionBanner = Boolean(useReal && xData?.tweetsError === 403);

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        title="Analytics"
        description={useReal ? 'Live data from your X account' : 'Your growth and engagement over time'}
      />
      {showTweetsPermissionBanner && (
        <div
          className="rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900"
          role="alert"
        >
          <p className="font-medium">Respuestas y engagement en 0 por permisos</p>
          <p className="mt-1 text-amber-800">
            En <a href="https://developer.x.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">developer.x.com</a>, en tu app → User authentication settings → <strong>Read and write</strong>. Guarda, cierra sesión y vuelve a entrar.
          </p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Followers growth</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[#0057FF] tabular-nums">
            +{kpis.followersGrowth}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Current: {kpis.followersCurrent.toLocaleString()}</p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Replies sent (14d)</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
            {kpis.repliesSentOverTime.reduce((a, b) => a + b, 0)}
          </p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Engagement received</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
            {kpis.engagementReceivedOverTime.reduce((a, b) => a + b, 0)}
          </p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Reply success rate</p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-gray-900 tabular-nums">
            {kpis.replySuccessRate}%
          </p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Best posting hours</p>
          <p className="mt-1.5 text-sm font-semibold text-gray-900">
            {kpis.bestPostingHours.map((h) => `${h}:00`).join(', ')}
          </p>
        </Card>
        <Card padding="md" className="metric-card-hover">
          <p className="text-sm font-medium text-gray-500">Top keyword</p>
          <p className="mt-1.5 text-lg font-semibold text-gray-900">
            {kpis.topKeywords[0]?.keyword ?? '—'}
          </p>
          <p className="text-xs text-gray-400">{kpis.topKeywords[0]?.engagement ?? 0} engagement</p>
        </Card>
      </div>

      {/* Line chart - Followers growth */}
      <Card padding="lg">
        <h2 className="text-sm font-semibold text-gray-900">Followers growth</h2>
        <p className="mt-1 text-sm text-gray-500">Last 30 days</p>
        <div className="mt-6 h-52 w-full">
          <div className="flex h-full items-end gap-0.5">
            {followersChart.map((d) => (
              <div
                key={d.date}
                className="chart-bar-draw flex-1 rounded-t bg-[#0057FF]/80 transition-all duration-200 hover:bg-[#0057FF] hover:opacity-90"
                style={{
                  height: `${((d.followers - minFollowers) / (maxFollowers - minFollowers || 1)) * 100}%`,
                  minHeight: '4px',
                }}
                title={`${d.date}: ${d.followers} followers`}
                data-tooltip={`${d.date}: ${d.followers}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <span>{followersChart[0]?.date}</span>
            <span>{followersChart[followersChart.length - 1]?.date}</span>
          </div>
        </div>
      </Card>

      {/* Bar charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-900">Replies per day</h2>
          <p className="mt-1 text-sm text-gray-500">Last 14 days</p>
          <div className="mt-6 flex items-end gap-1 h-44">
            {repliesChart.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="chart-bar-draw w-full rounded-t bg-[#0057FF] transition-all duration-200 hover:bg-[#0047dd] hover:opacity-90"
                  style={{
                    height: `${(d.count / maxRepliesBar) * 100}%`,
                    minHeight: d.count ? '6px' : '0',
                  }}
                  data-tooltip={`${d.date}: ${d.count} replies`}
                />
                <span className="text-[10px] text-gray-400 truncate max-w-full" title={d.date}>
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card padding="lg">
          <h2 className="text-sm font-semibold text-gray-900">Engagement received over time</h2>
          <p className="mt-1 text-sm text-gray-500">Last 14 days</p>
          <div className="mt-6 flex items-end gap-1 h-44">
            {engagementChart.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="chart-bar-draw w-full rounded-t bg-gray-700 transition-all duration-200 hover:bg-gray-600 hover:opacity-90"
                  style={{
                    height: `${(d.count / maxEngagementBar) * 100}%`,
                    minHeight: d.count ? '6px' : '0',
                  }}
                  data-tooltip={`${d.date}: ${d.count} engagement`}
                />
                <span className="text-[10px] text-gray-400 truncate max-w-full" title={d.date}>
                  {d.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Heatmap - Best posting hours */}
      <Card padding="lg">
        <h2 className="text-sm font-semibold text-gray-900">Best posting hours</h2>
        <p className="mt-1 text-sm text-gray-500">Engagement by hour and day of week (higher = better)</p>
        <div className="mt-4 overflow-x-auto">
          <div className="inline-block min-w-[520px]">
            <div className="grid gap-0.5 text-center" style={{ gridTemplateColumns: '32px repeat(7, 1fr)' }}>
              <div />
              {DAY_LABELS.map((d) => (
                <div key={d} className="rounded bg-gray-100 py-1 text-xs font-medium text-gray-600">
                  {d}
                </div>
              ))}
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="contents">
                  <div className="flex items-center justify-end pr-1 text-xs text-gray-500">
                    {hour}h
                  </div>
                  {DAY_LABELS.map((_, dayOfWeek) => {
                    const cell = heatmap.find((c) => c.hour === hour && c.dayOfWeek === dayOfWeek);
                    const v = cell?.value ?? 0;
                    const pct = Math.round((v / heatmapMax) * 100);
                    return (
                      <div
                        key={dayOfWeek}
                        className="h-6 w-full rounded-sm transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: `rgba(0, 87, 255, ${0.15 + (pct / 100) * 0.85})`,
                        }}
                        title={`${DAY_LABELS[dayOfWeek]} ${hour}:00 — ${v}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-0.5">
            {[0, 25, 50, 75, 100].map((p) => (
              <div
                key={p}
                className="h-3 w-4 rounded-sm"
                style={{ backgroundColor: `rgba(0, 87, 255, ${0.15 + (p / 100) * 0.85})` }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </Card>

      {/* Top keywords */}
      <Card padding="lg">
        <h2 className="text-sm font-semibold text-gray-900">Top keywords performance</h2>
        <p className="mt-1 text-sm text-gray-500">Engagement by topic</p>
        <ul className="mt-4 space-y-2">
          {kpis.topKeywords.map((kw, i) => (
            <li key={kw.keyword} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2">
              <span className="font-medium text-gray-900">#{i + 1} {kw.keyword}</span>
              <span className="text-sm text-gray-500">{kw.count} replies · {kw.engagement} engagement</span>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}

export default function AnalyticsPage() {
  return (
    <RequirePlan>
      <AnalyticsPageContent />
    </RequirePlan>
  );
}
