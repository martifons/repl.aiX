import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getXToken } from '@/lib/getXTokenServer';

const X_API_BASE = 'https://api.twitter.com/2';

export async function GET() {
  try {
    const supabase = await createClient();
    const token = await getXToken(supabase);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    const meRes = await fetch(`${X_API_BASE}/users/me?user.fields=profile_image_url`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!meRes.ok) return NextResponse.json({ items: [] }, { status: meRes.status });
    const meData = await meRes.json();
    const userId = meData.data?.id;
    if (!userId) return NextResponse.json({ items: [] });

    const params = new URLSearchParams({
      max_results: '100',
      'tweet.fields': 'public_metrics,created_at,referenced_tweets',
      exclude: 'retweets',
    });
    const tweetsRes = await fetch(`${X_API_BASE}/users/${userId}/tweets?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!tweetsRes.ok) return NextResponse.json({ items: [] });

    const tweetsData = await tweetsRes.json().catch(() => ({}));
    const tweets = tweetsData.data || [];
    const replyTweets = tweets.filter((t: { referenced_tweets?: Array<{ type: string; id: string }> }) =>
      t.referenced_tweets?.some((r: { type: string }) => r.type === 'replied_to')
    );
    if (replyTweets.length === 0) return NextResponse.json({ items: [] });

    const parentIds = replyTweets
      .map((t: { referenced_tweets?: Array<{ type: string; id: string }> }) =>
        t.referenced_tweets?.find((r: { type: string }) => r.type === 'replied_to')?.id
      )
      .filter(Boolean) as string[];
    const uniqueIds = [...new Set(parentIds)].slice(0, 100);

    let parentTweets: Record<string, { text?: string; author_id?: string }> = {};
    let parentUsers: Record<string, { name?: string; username?: string; profile_image_url?: string }> = {};

    if (uniqueIds.length > 0) {
      const idsParam = uniqueIds.slice(0, 100).join(',');
      const parentRes = await fetch(
        `${X_API_BASE}/tweets?ids=${idsParam}&tweet.fields=public_metrics,created_at,author_id&user.fields=profile_image_url&expansions=author_id`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (parentRes.ok) {
        const parentData = await parentRes.json().catch(() => ({}));
        (parentData.data || []).forEach((t: { id: string; text?: string; author_id?: string }) => {
          parentTweets[t.id] = { text: t.text, author_id: t.author_id };
        });
        (parentData.includes?.users || []).forEach((u: { id: string; name?: string; username?: string; profile_image_url?: string }) => {
          parentUsers[u.id] = { name: u.name, username: u.username, profile_image_url: u.profile_image_url };
        });
      }
    }

    const items = replyTweets.map((t: { id: string; text?: string; public_metrics?: Record<string, number>; created_at?: string; referenced_tweets?: Array<{ type: string; id: string }> }) => {
      const parentId = t.referenced_tweets?.find((r: { type: string }) => r.type === 'replied_to')?.id;
      const parent = parentId ? parentTweets[parentId] : null;
      const author = parent?.author_id ? parentUsers[parent.author_id] : null;
      const m = t.public_metrics || {};
      const engagement = (m.like_count || 0) + (m.reply_count || 0) * 2 + (m.retweet_count || 0) * 2;
      return {
        id: t.id,
        replyText: t.text || '',
        replyId: t.id,
        postedAt: t.created_at || new Date().toISOString(),
        likesReceived: m.like_count ?? 0,
        repliesReceived: m.reply_count ?? 0,
        retweetsReceived: m.retweet_count ?? 0,
        engagementScore: engagement,
        originalTweet: {
          id: parentId,
          text: parent?.text || '',
          author: author?.name || 'Unknown',
          username: author?.username ? `@${author.username}` : '@user',
          avatar: author?.profile_image_url || '',
        },
      };
    });

    items.sort((a: { engagementScore: number }, b: { engagementScore: number }) => b.engagementScore - a.engagementScore);

    return NextResponse.json({ items: items.slice(0, 50) });
  } catch (e) {
    console.error('x/top-performing error:', e);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
