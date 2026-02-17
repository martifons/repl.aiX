import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';

const X_API_BASE = 'https://api.twitter.com/2';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const headerToken = request.headers.get('x-provider-token')?.trim();
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(X_TOKEN_COOKIE)?.value?.trim();
    const token = session?.provider_token || headerToken || cookieToken || undefined;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    const meRes = await fetch(`${X_API_BASE}/users/me?user.fields=public_metrics,profile_image_url`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!meRes.ok) {
      return NextResponse.json({ error: 'Failed to get X profile' }, { status: meRes.status });
    }
    const meData = await meRes.json();
    const user = meData.data;
    const metrics = user?.public_metrics || {};
    const followersCurrent = metrics.followers_count ?? 0;
    const tweetCount = metrics.tweet_count ?? 0;
    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({
        real: true,
        followersCurrent,
        tweetCount,
        followersGrowth: 0,
        totalReplies: 0,
        totalEngagement: 0,
        repliesToday: 0,
        repliesSentOverTime: [],
        engagementReceivedOverTime: [],
        replySuccessRate: 0,
        byDay14: [],
        followersChart: Array.from({ length: 30 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (29 - i));
          return { date: d.toISOString().slice(0, 10), followers: followersCurrent };
        }),
      });
    }

    const byDay: Record<string, { replies: number; engagement: number }> = {};
    let totalReplies = 0;
    let totalEngagement = 0;
    const now = new Date();
    const authHeader = { Authorization: `Bearer ${token}` };
    let nextToken: string | null = null;
    const maxPages = 5;

    for (let page = 0; page < maxPages; page++) {
      const params = new URLSearchParams({
        max_results: '100',
        'tweet.fields': 'public_metrics,created_at,in_reply_to_user_id',
        exclude: 'retweets',
      });
      if (nextToken) params.set('pagination_token', nextToken);
      const tweetsRes = await fetch(`${X_API_BASE}/users/${userId}/tweets?${params}`, {
        headers: authHeader,
      });

      if (!tweetsRes.ok) break;

      const tweetsData = await tweetsRes.json();
      const tweets = tweetsData.data || [];
      for (const t of tweets) {
        const created = t.created_at ? new Date(t.created_at) : null;
        const day = created ? created.toISOString().slice(0, 10) : null;
        const m = t.public_metrics || {};
        const engagement = (m.like_count || 0) + (m.reply_count || 0) + (m.retweet_count || 0) + (m.quote_count || 0);
        const isReply = !!t.in_reply_to_user_id;
        if (day) {
          if (!byDay[day]) byDay[day] = { replies: 0, engagement: 0 };
          byDay[day].engagement += engagement;
          if (isReply) {
            byDay[day].replies += 1;
            totalReplies += 1;
          }
        }
        totalEngagement += engagement;
      }

      nextToken = tweetsData.meta?.next_token ?? null;
      if (!nextToken || tweets.length === 0) break;
    }

    const byDay14: { date: string; replies: number; engagement: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const day = byDay[dateStr] || { replies: 0, engagement: 0 };
      byDay14.push({ date: dateStr, replies: day.replies, engagement: day.engagement });
    }

    const todayStr = now.toISOString().slice(0, 10);
    const repliesToday = byDay[todayStr]?.replies ?? 0;

    const repliesSentOverTime = byDay14.map((d) => d.replies);
    const engagementReceivedOverTime = byDay14.map((d) => d.engagement);
    const replySuccessRate = totalReplies > 0
      ? Math.round((totalReplies / Math.min(tweetCount || totalReplies, 100)) * 100)
      : 0;

    const followersChart = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return { date: d.toISOString().slice(0, 10), followers: followersCurrent };
    });

    return NextResponse.json({
      real: true,
      followersCurrent,
      followersGrowth: 0,
      tweetCount,
      totalReplies,
      totalEngagement,
      repliesToday,
      repliesSentOverTime,
      engagementReceivedOverTime,
      replySuccessRate: Math.min(100, replySuccessRate),
      bestPostingHours: [9, 14, 18],
      topKeywords: [],
      byDay14,
      followersChart,
    });
  } catch (e) {
    console.error('x/analytics error:', e);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
