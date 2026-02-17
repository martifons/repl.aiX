import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';

const X_API_BASE = 'https://api.twitter.com/2';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    let token = session?.provider_token
      || request.headers.get('x-provider-token')?.trim()
      || (await cookies()).get(X_TOKEN_COOKIE)?.value?.trim()
      || undefined;
    if (!token && session?.user?.id) {
      const { data: row } = await supabase.from('user_x_tokens').select('x_access_token').eq('user_id', session.user.id).single();
      if (row?.x_access_token) token = row.x_access_token;
    }
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    // Get current user id first
    const meRes = await fetch(`${X_API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) {
      return NextResponse.json({ error: 'Failed to get user' }, { status: meRes.status });
    }
    const meData = await meRes.json();
    const userId = meData.data?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User id not found' }, { status: 500 });
    }

    const params = new URLSearchParams({
      max_results: '100',
      'tweet.fields': 'public_metrics,created_at,in_reply_to_user_id',
      exclude: 'retweets',
    });
    const tweetsRes = await fetch(`${X_API_BASE}/users/${userId}/tweets?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!tweetsRes.ok) {
      const err = await tweetsRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || 'X API error' },
        { status: tweetsRes.status >= 400 ? tweetsRes.status : 500 }
      );
    }

    const tweetsData = await tweetsRes.json();
    const tweets = tweetsData.data || [];
    const now = new Date();

    const byDay: Record<string, { replies: number; engagement: number }> = {};
    let totalReplies = 0;
    let totalEngagement = 0;
    let replyTweets = 0;

    for (const t of tweets) {
      const created = t.created_at ? new Date(t.created_at) : null;
      const day = created ? created.toISOString().slice(0, 10) : null;
      const metrics = t.public_metrics || {};
      const engagement = (metrics.like_count || 0) + (metrics.reply_count || 0) + (metrics.retweet_count || 0) + (metrics.quote_count || 0);
      const isReply = !!t.in_reply_to_user_id;

      if (day) {
        if (!byDay[day]) byDay[day] = { replies: 0, engagement: 0 };
        byDay[day].engagement += engagement;
        if (isReply) {
          byDay[day].replies += 1;
          replyTweets += 1;
        }
      }
      totalEngagement += engagement;
      if (isReply) totalReplies += 1;
    }

    const days14: { date: string; replies: number; engagement: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const day = byDay[dateStr] || { replies: 0, engagement: 0 };
      days14.push({ date: dateStr, replies: day.replies, engagement: day.engagement });
    }

    return NextResponse.json({
      totalTweets: tweets.length,
      totalReplies,
      totalEngagement,
      replyTweets,
      byDay14: days14,
    });
  } catch (e) {
    console.error('x/tweets error:', e);
    return NextResponse.json({ error: 'Failed to fetch tweets' }, { status: 500 });
  }
}
