/**
 * Analytics and KPIs.
 * Returns mock data that evolves. Replace with real analytics API when ready.
 */

import type {
  AnalyticsKPIs,
  FollowersChartPoint,
  RepliesChartPoint,
  HeatmapCell,
  UserProfile,
  TimeRange,
  PerformedReply,
} from '@/types';
import { getPerformedRepliesList } from '@/lib/mockStore';
import { seedPerformedRepliesIfNeeded } from '@/lib/mockSeedData';
import { getUser } from '@/lib/mockUser';

// Deterministic but varied data based on "time"
function seeded(seed: number, max: number) {
  return Math.floor((Math.sin(seed) * 0.5 + 0.5) * max) + 1;
}

export function getAnalyticsKPIs(_timeRange?: TimeRange): AnalyticsKPIs {
  if (typeof window !== 'undefined') seedPerformedRepliesIfNeeded();
  const performed = getPerformedRepliesList();
  const totalReplies = performed.length || 24;
  const totalEngagement = performed.reduce((s, p) => s + p.engagementScore, 0) || 340;
  const successReplies = Math.floor(totalReplies * (0.6 + Math.random() * 0.2));

  return {
    followersGrowth: 42 + seeded(1, 30),
    followersCurrent: 2840 + seeded(2, 200),
    repliesSentOverTime: [12, 18, 14, 22, 19, 8, 15],
    engagementReceivedOverTime: [240, 320, 180, 410, 350, 120, 280],
    replySuccessRate: Math.round((successReplies / totalReplies) * 100) || 72,
    bestPostingHours: [9, 14, 18, 20],
    topKeywords: [
      { keyword: 'SaaS', count: 18, engagement: 420 },
      { keyword: 'building in public', count: 14, engagement: 380 },
      { keyword: 'indie', count: 12, engagement: 290 },
      { keyword: 'AI', count: 10, engagement: 210 },
      { keyword: 'MRR', count: 8, engagement: 180 },
    ],
  };
}

export function getFollowersChartData(days: number = 30): FollowersChartPoint[] {
  const points: FollowersChartPoint[] = [];
  let followers = 2750;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    followers += seeded(i * 7, 4);
    points.push({
      date: d.toISOString().slice(0, 10),
      followers,
    });
  }
  return points;
}

export function getRepliesOverTime(days: number = 14): RepliesChartPoint[] {
  const points: RepliesChartPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = seeded(i * 3, 8) + 5;
    points.push({
      date: d.toISOString().slice(0, 10),
      count,
    });
  }
  return points;
}

export function getEngagementOverTime(days: number = 14): RepliesChartPoint[] {
  const points: RepliesChartPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = seeded(i * 5, 80) + 40;
    points.push({
      date: d.toISOString().slice(0, 10),
      count,
    });
  }
  return points;
}

export function getBestHoursHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const value = hour >= 8 && hour <= 22 ? seeded(day * 24 + hour, 100) : seeded(day + hour, 20);
      cells.push({ hour, dayOfWeek: day, value });
    }
  }
  return cells;
}

export function getUserProfile(): UserProfile | null {
  const user = getUser();
  if (!user) return null;
  if (typeof window !== 'undefined') seedPerformedRepliesIfNeeded();
  const performed = getPerformedRepliesList();
  const totalEngagement = performed.reduce((s, p) => s + p.engagementScore, 0);

  const plan = user.plan === 'Starter' ? 'Trial' : user.plan === 'Pro' || user.plan === 'Growth' ? 'Active' : 'Trial';

  return {
    ...user,
    plan: plan as 'Trial' | 'Active',
    followers: 2840 + Math.floor(Math.random() * 200),
    totalRepliesSent: performed.length || 47,
    totalEngagementReceived: totalEngagement || 892,
  };
}

export function getGrowthSummaryMessage(): string {
  const profile = getUserProfile();
  if (!profile) return 'Keep going!';
  const { totalEngagementReceived } = profile;
  return `Your replies generated ${totalEngagementReceived.toLocaleString()} engagements this month. Keep going!`;
}

export function getTopPerformingReplies(timeRange: TimeRange): PerformedReply[] {
  if (typeof window !== 'undefined') seedPerformedRepliesIfNeeded();
  let list = getPerformedRepliesList();
  const now = new Date();
  const cutoff =
    timeRange === '7d'
      ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      : timeRange === '30d'
        ? new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        : null;
  if (cutoff) list = list.filter((p) => new Date(p.postedAt) >= cutoff);
  return list.sort((a, b) => b.engagementScore - a.engagementScore);
}
