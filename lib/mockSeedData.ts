/**
 * Seeds realistic mock data so the product feels like it has been running for weeks.
 * Generates performed replies with coherent engagement and dates in the past.
 */

import type { PerformedReply, Tweet } from '@/types';
import { mockTweets } from '@/lib/mockTweets';

const SAMPLE_REPLIES = [
  "This is so true. We've seen the same pattern while building repl.aiX.",
  'Consistency compounds more than people think.',
  "Building in public changed everything for us. Couldn't recommend it more.",
  "Same. We're 6 months in and the accountability alone is worth it.",
  "Love this. It's the small daily actions that add up.",
  "Couldn't agree more. AI is a lever, not a replacement.",
  "We hit our first $1k MRR the same way. One reply at a time.",
  "The best marketing is genuinely being helpful. This is it.",
  "100%. We're seeing this with our users every day.",
  "We're doing this right now. Day 47 and already seeing results.",
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function seededEngagement(seed: number): { likes: number; replies: number; retweets: number } {
  const s = Math.sin(seed * 0.7) * 0.5 + 0.5;
  const likes = Math.max(2, Math.floor(5 + s * 45));
  const replies = Math.max(0, Math.floor(s * 12));
  const retweets = Math.max(0, Math.floor(s * 8));
  return { likes, replies, retweets };
}

export function seedPerformedRepliesIfNeeded(): PerformedReply[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('replaix_performed_replies');
  if (stored && JSON.parse(stored).length >= 5) return JSON.parse(stored);

  const tweets = mockTweets.slice(0, 12) as Tweet[];
  const performed: PerformedReply[] = [];
  const now = Date.now();

  tweets.forEach((tweet, i) => {
    const daysBack = 1 + (i % 14) + Math.floor(i / 4);
    const postedAt = daysAgo(daysBack);
    const { likes, replies, retweets } = seededEngagement(i + tweet.id.charCodeAt(0));
    const engagementScore = likes * 2 + replies * 3 + retweets * 4;

    performed.push({
      id: `pr_seed_${i}_${now}`,
      tweetId: tweet.id,
      tweet: { ...tweet, createdAt: daysAgo(daysBack + 1) },
      replyText: SAMPLE_REPLIES[i % SAMPLE_REPLIES.length],
      postedAt,
      likesReceived: likes,
      repliesReceived: replies,
      retweetsReceived: retweets,
      engagementScore,
    });
  });

  performed.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  localStorage.setItem('replaix_performed_replies', JSON.stringify(performed));
  return performed;
}
