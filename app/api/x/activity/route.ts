import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const X_API_BASE = 'https://api.twitter.com/2';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const sec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)} min ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return date.toLocaleDateString();
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.provider_token;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    const meRes = await fetch(`${X_API_BASE}/users/me?user.fields=id`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) return NextResponse.json({ error: 'Failed to get user' }, { status: meRes.status });
    const meData = await meRes.json();
    const userId = meData.data?.id;
    if (!userId) return NextResponse.json({ activities: [] });

    const params = new URLSearchParams({
      max_results: '50',
      'tweet.fields': 'public_metrics,created_at,in_reply_to_user_id',
      exclude: 'retweets',
    });
    const res = await fetch(`${X_API_BASE}/users/${userId}/tweets?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return NextResponse.json({ activities: [] });

    const data = await res.json();
    const tweets = data.data || [];

    const activities: { id: string; type: 'reply' | 'likes' | 'tweet_found'; text: string; time: string; meta?: string }[] = [];

    for (const t of tweets) {
      const isReply = !!t.in_reply_to_user_id;
      if (!isReply) continue;
      const created = t.created_at ? new Date(t.created_at) : new Date();
      const metrics = t.public_metrics || {};
      const likes = metrics.like_count || 0;
      const textSnippet = (t.text || '').replace(/\s+/g, ' ').trim().slice(0, 45);
      const displayText = textSnippet.length >= 45 ? `${textSnippet}…` : textSnippet;
      activities.push({
        id: t.id,
        type: 'reply',
        text: displayText ? `You replied: "${displayText}"` : 'You sent a reply',
        time: formatTimeAgo(created),
        meta: likes > 0 ? `${likes} like${likes !== 1 ? 's' : ''}` : undefined,
      });
    }

    activities.sort((a, b) => {
      const timeOrder = (x: typeof activities[0]) => {
        if (x.time.includes('min') || x.time === 'Just now') return 0;
        if (x.time.includes('h')) return 1;
        if (x.time.includes('d')) return 2;
        return 3;
      };
      return timeOrder(a) - timeOrder(b);
    });

    return NextResponse.json({ activities: activities.slice(0, 15) });
  } catch (e) {
    console.error('x/activity error:', e);
    return NextResponse.json({ activities: [] });
  }
}
