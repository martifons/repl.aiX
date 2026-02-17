/**
 * Reply generation and editing.
 * Uses mock AI responses. Swap for real /api/generateReply or OpenAI when ready.
 */

import type { ReplyVersion } from '@/types';
import {
  getSavedReplyByTweetId,
  saveReply,
  addPerformedReply,
  getSavedRepliesList,
  clearSavedReplyForTweet,
} from '@/lib/mockStore';
import { generateFakeReply } from '@/lib/fakeReply';
import type { Tweet } from '@/types';

const REPLY_POOL_IMPROVE = [
  (t: string) => t.replace(/\.$/, '!') + ' So glad you shared this.',
  (t: string) => `Really appreciate this perspective. ${t}`,
  (t: string) => t + ' Thanks for the insight.',
];
const REPLY_POOL_SHORTEN = (t: string) => {
  const s = t.split(/[.!?]/)[0];
  return (s?.length && s.length < 200 ? s : t.slice(0, 120)) + (t.length > 100 ? '…' : '');
};
const REPLY_POOL_ENGAGING = [
  (t: string) => `${t} What’s been your experience with this?`,
  (t: string) => `This. ${t} Curious how others are applying it.`,
];
const REPLY_POOL_QUESTION = [
  (t: string) => `${t} How long have you been seeing these results?`,
  (t: string) => `${t} What would you do differently if you started again?`,
];

export async function generateReply(tweetText: string, _tweetId?: string): Promise<string> {
  try {
    const res = await fetch('/api/generateReply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tweet: tweetText, content: tweetText }),
    });
    const data = await res.json().catch(() => ({}));
    const reply = (data as { reply?: string }).reply;
    if (reply && typeof reply === 'string') return reply.slice(0, 280);
  } catch (_) {
    // Fallback to fake
  }
  await new Promise((r) => setTimeout(r, 400));
  return generateFakeReply(tweetText).slice(0, 280);
}

export async function improveTone(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  const fn = REPLY_POOL_IMPROVE[Math.floor(Math.random() * REPLY_POOL_IMPROVE.length)];
  return fn(text).slice(0, 280);
}

export async function shortenReply(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400));
  return REPLY_POOL_SHORTEN(text).slice(0, 280);
}

export async function makeMoreEngaging(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 500));
  const fn = REPLY_POOL_ENGAGING[Math.floor(Math.random() * REPLY_POOL_ENGAGING.length)];
  return fn(text).slice(0, 280);
}

export async function addQuestionToReply(text: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 400));
  const fn = REPLY_POOL_QUESTION[Math.floor(Math.random() * REPLY_POOL_QUESTION.length)];
  return fn(text).slice(0, 280);
}

export function getSavedReply(tweetId: string) {
  return getSavedReplyByTweetId(tweetId);
}

export function saveReplyForTweet(
  tweetId: string,
  tweet: Tweet,
  originalText: string,
  currentText: string,
  versions: ReplyVersion[]
) {
  return saveReply({ tweetId, tweet, originalText, currentText, versions });
}

export function getReplyVersions(tweetId: string): ReplyVersion[] {
  const saved = getSavedReplyByTweetId(tweetId);
  return saved?.versions ?? [];
}

export function recordPostReply(
  tweetId: string,
  tweet: Tweet,
  replyText: string,
  realMetrics?: { likesReceived: number; repliesReceived: number; retweetsReceived: number }
) {
  const likes = realMetrics?.likesReceived ?? Math.floor(3 + Math.random() * 35);
  const replies = realMetrics?.repliesReceived ?? Math.floor(Math.random() * 8);
  const retweets = realMetrics?.retweetsReceived ?? Math.floor(Math.random() * 6);
  return addPerformedReply({
    tweetId,
    tweet,
    replyText,
    postedAt: new Date().toISOString(),
    likesReceived: likes,
    repliesReceived: replies,
    retweetsReceived: retweets,
    engagementScore: likes * 2 + replies * 3 + retweets * 4,
  });
}

export function getAllSavedReplies() {
  return getSavedRepliesList();
}

export function clearSavedReply(tweetId: string) {
  clearSavedReplyForTweet(tweetId);
}
