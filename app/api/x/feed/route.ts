import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getXToken } from '@/lib/getXTokenServer';

const X_API_BASE = 'https://api.twitter.com/2';

function formatTimestamp(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return d.toLocaleDateString();
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const token = await getXToken(supabase, request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    const meRes = await fetch(`${X_API_BASE}/users/me?user.fields=profile_image_url,public_metrics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: meRes.status });
    }
    const meData = await meRes.json();
    const me = meData.data;
    const userId = me?.id;
    if (!userId) return NextResponse.json({ tweets: [], source: 'none' });

    const authHeader = { Authorization: `Bearer ${token}` };

    // 1) Try mentions (tweets that mention the user – good for replying)
    const mentionsParams = new URLSearchParams({
      max_results: '50',
      'tweet.fields': 'public_metrics,created_at,author_id',
      'user.fields': 'profile_image_url,public_metrics',
      expansions: 'author_id',
    });
    const mentionsRes = await fetch(
      `${X_API_BASE}/users/${userId}/mentions?${mentionsParams}`,
      { headers: authHeader }
    );

    if (mentionsRes.ok) {
      const mentionsData = await mentionsRes.json().catch(() => ({}));
      const tweets = mentionsData.data || [];
      const users = (mentionsData.includes?.users || []) as Array<{
        id: string;
        name?: string;
        username?: string;
        profile_image_url?: string;
        public_metrics?: { followers_count?: number };
      }>;
      const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

      const feed = tweets.map((t: { id: string; text?: string; author_id?: string; public_metrics?: Record<string, number>; created_at?: string }) => {
        const author = userMap[t.author_id || ''] || {};
        const metrics = t.public_metrics || {};
        return {
          id: t.id,
          text: t.text || '',
          author: author.name || 'Unknown',
          username: `@${author.username || 'user'}`,
          avatar: author.profile_image_url || '',
          followers: author.public_metrics?.followers_count ?? 0,
          likes: metrics.like_count ?? 0,
          replies: metrics.reply_count ?? 0,
          retweets: metrics.retweet_count ?? 0,
          timestamp: t.created_at ? formatTimestamp(t.created_at) : '',
          createdAt: t.created_at,
          url: `https://x.com/i/status/${t.id}`,
        };
      });

      return NextResponse.json({ tweets: feed, source: 'mentions' });
    }

    // 2) Fallback: user's own tweets (so something real always shows)
    const ownParams = new URLSearchParams({
      max_results: '50',
      'tweet.fields': 'public_metrics,created_at',
      exclude: 'retweets',
    });
    const ownRes = await fetch(`${X_API_BASE}/users/${userId}/tweets?${ownParams}`, { headers: authHeader });
    if (!ownRes.ok) {
      return NextResponse.json({ tweets: [], source: 'none', error: ownRes.status });
    }

    const ownData = await ownRes.json().catch(() => ({}));
    const ownTweets = ownData.data || [];
    const metrics = me?.public_metrics || {};
    const feed = ownTweets.map((t: { id: string; text?: string; public_metrics?: Record<string, number>; created_at?: string }) => {
      const m = t.public_metrics || {};
      return {
        id: t.id,
        text: t.text || '',
        author: me.name || 'You',
        username: me.username ? `@${me.username}` : '@user',
        avatar: me.profile_image_url || '',
        followers: metrics.followers_count ?? 0,
        likes: m.like_count ?? 0,
        replies: m.reply_count ?? 0,
        retweets: m.retweet_count ?? 0,
        timestamp: t.created_at ? formatTimestamp(t.created_at) : '',
        createdAt: t.created_at,
        url: `https://x.com/i/status/${t.id}`,
      };
    });

    return NextResponse.json({ tweets: feed, source: 'own' });
  } catch (e) {
    console.error('x/feed error:', e);
    return NextResponse.json({ tweets: [], source: 'none' }, { status: 500 });
  }
}
