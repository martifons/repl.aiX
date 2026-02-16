/**
 * Persistent mock store for saved replies and performed replies.
 * Replace with real API calls (e.g. Supabase) when backend is ready.
 */

import type { Tweet, PerformedReply, SavedReply } from '@/types';

const SAVED_REPLIES_KEY = 'replaix_saved_replies';
const PERFORMED_REPLIES_KEY = 'replaix_performed_replies';

function getSavedReplies(): SavedReply[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_REPLIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setSavedReplies(data: SavedReply[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAVED_REPLIES_KEY, JSON.stringify(data));
}

function getPerformedReplies(): PerformedReply[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PERFORMED_REPLIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setPerformedReplies(data: PerformedReply[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERFORMED_REPLIES_KEY, JSON.stringify(data));
}

export function getSavedReplyByTweetId(tweetId: string): SavedReply | null {
  return getSavedReplies().find((r) => r.tweetId === tweetId) ?? null;
}

export function saveReply(reply: Omit<SavedReply, 'id' | 'createdAt' | 'updatedAt'>): SavedReply {
  const list = getSavedReplies();
  const now = new Date().toISOString();
  const existing = list.find((r) => r.tweetId === reply.tweetId);
  const newReply: SavedReply = {
    ...reply,
    id: existing?.id ?? `sr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const next = list.filter((r) => r.tweetId !== reply.tweetId);
  next.push(newReply);
  setSavedReplies(next);
  return newReply;
}

export function addPerformedReply(reply: Omit<PerformedReply, 'id'>): PerformedReply {
  const list = getPerformedReplies();
  const newItem: PerformedReply = {
    ...reply,
    id: `pr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  };
  list.unshift(newItem);
  setPerformedReplies(list);
  return newItem;
}

export function getPerformedRepliesList(): PerformedReply[] {
  return getPerformedReplies();
}

export function getSavedRepliesList(): SavedReply[] {
  return getSavedReplies();
}

export function clearSavedReplyForTweet(tweetId: string): void {
  setSavedReplies(getSavedReplies().filter((r) => r.tweetId !== tweetId));
}
