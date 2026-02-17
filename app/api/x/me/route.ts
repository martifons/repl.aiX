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
