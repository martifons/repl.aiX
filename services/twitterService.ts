/**
 * Twitter / X API layer.
 * Currently returns mock data. Replace with real X API calls when ready.
 */

import type { Tweet } from '@/types';
import { mockTweets } from '@/lib/mockTweets';

export async function getTweets(_query?: string): Promise<Tweet[]> {
  // TODO: replace with real API e.g. GET /api/twitter/search?q=...
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

export async function postReply(_tweetId: string, _replyText: string): Promise<{ success: boolean }> {
  // TODO: replace with real X API POST reply
  await new Promise((r) => setTimeout(r, 800));
  return { success: true };
}

export async function getTweetById(_tweetId: string): Promise<Tweet | null> {
  // TODO: replace with real API
  const tweets = await getTweets();
  return tweets[0] ?? null;
}
