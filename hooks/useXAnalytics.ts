'use client';

import { useState, useEffect, useCallback } from 'react';

export interface XAnalyticsData {
  real: boolean;
  followersCurrent: number;
  followersGrowth: number;
  tweetCount?: number;
  totalReplies?: number;
  totalEngagement?: number;
  /** Replies sent today (from X) for plan usage */
  repliesToday?: number;
  repliesSentOverTime: number[];
  engagementReceivedOverTime: number[];
  replySuccessRate: number;
  bestPostingHours: number[];
  topKeywords: { keyword: string; count: number; engagement: number }[];
  byDay14: { date: string; replies: number; engagement: number }[];
  followersChart: { date: string; followers: number }[];
}

export interface XActivityItem {
  id: string;
  type: 'reply' | 'likes' | 'tweet_found';
  text: string;
  time: string;
  meta?: string;
}

export function useXAnalytics() {
  const [data, setData] = useState<XAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/x/analytics');
      if (!res.ok) {
        if (res.status === 401) {
          setData(null);
          return;
        }
        throw new Error(await res.text());
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export interface XMeData {
  id: string;
  name?: string;
  username?: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count?: number;
    following_count?: number;
    tweet_count?: number;
    listed_count?: number;
  };
}

export function useXMe() {
  const [data, setData] = useState<XMeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/x/me');
      if (!res.ok) {
        if (res.status === 401) {
          setData(null);
          return;
        }
        throw new Error(await res.text());
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load profile');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
