/**
 * Twitter / X API layer.
 * Uses real /api/x/feed and /api/x/post-reply when available.
 */

import type { Tweet } from '@/types';
import { mockTweets } from '@/lib/mockTweets';

export async function getTweets(_query?: string): Promise<Tweet[]> {
  try {
    const res = await fetch('/api/x/feed', { credentials: 'include' });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const tweets = data.tweets || [];
    if (tweets.length > 0) {
      return tweets.map((t: Record<string, unknown>) => ({
        id: t.id,
        author: t.author,
        username: t.username,
        avatar: t.avatar || '',
        followers: Number(t.followers) || 0,
        text: t.text,
        likes: Number(t.likes) || 0,
        replies: Number(t.replies) || 0,
        retweets: Number(t.retweets) || 0,
        timestamp: t.timestamp || '',
        createdAt: t.createdAt,
        url: typeof t.url === 'string' ? t.url : undefined,
      })) as Tweet[];
    }
  } catch (_) {
    // Fallback to mock
  }
  const withDates = mockTweets.map((t, i) => ({
    ...t,
    createdAt: getCreatedAtForTweet(i),
  }));
  return withDates as Tweet[];
}

function getCreatedAtForTweet(index: number): string {
  const d = new Date();
  d.setHours(d.getHours() - (index + 1) * 2);
  return d.toISOString();
}

export async function postReply(tweetId: string, replyText: string): Promise<{ success: boolean; tweetId?: string }> {
  try {
    const res = await fetch('/api/x/post-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: replyText, inReplyToTweetId: tweetId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || String(res.status));
    return { success: true, tweetId: data.tweetId };
  } catch (e) {
    console.error('postReply error:', e);
    return { success: false };
  }
}

export async function getTweetById(_tweetId: string): Promise<Tweet | null> {
  const tweets = await getTweets();
  return tweets.find((t) => t.id === _tweetId) ?? null;
}
