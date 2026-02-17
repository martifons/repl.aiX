import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';

export async function POST() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.id) {
    try {
      await supabase.from('user_x_tokens').delete().eq('user_id', session.user.id);
    } catch (_) { /* ignore */ }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(X_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
