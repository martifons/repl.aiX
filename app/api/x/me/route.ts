import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const X_API_BASE = 'https://api.twitter.com/2';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.provider_token;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated with X' }, { status: 401 });
    }

    const res = await fetch(`${X_API_BASE}/users/me?user.fields=public_metrics,profile_image_url,description`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || 'X API error', status: res.status },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data.data || data);
  } catch (e) {
    console.error('x/me error:', e);
    return NextResponse.json({ error: 'Failed to fetch X profile' }, { status: 500 });
  }
}
