import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getXToken } from '@/lib/getXTokenServer';

const X_API_BASE = 'https://api.twitter.com/2';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const token = await getXToken(supabase, request);
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const text = (body.text ?? body.replyText ?? '').trim();
    const inReplyToTweetId = (body.inReplyToTweetId ?? body.tweetId ?? '').trim();

    if (!text || text.length > 280) {
      return NextResponse.json({ error: 'Invalid reply text (max 280 characters)' }, { status: 400 });
    }
    if (!inReplyToTweetId) {
      return NextResponse.json({ error: 'Missing tweet ID to reply to' }, { status: 400 });
    }

    const res = await fetch(`${X_API_BASE}/tweets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        in_reply_to_tweet_id: inReplyToTweetId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const message = (err as { detail?: string }).detail || `HTTP ${res.status}`;
      return NextResponse.json({ error: message }, { status: res.status >= 400 ? res.status : 500 });
    }

    const data = await res.json().catch(() => ({}));
    const newTweetId = (data as { data?: { id?: string } }).data?.id;
    return NextResponse.json({ success: true, tweetId: newTweetId });
  } catch (e) {
    console.error('x/post-reply error:', e);
    return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 });
  }
}
