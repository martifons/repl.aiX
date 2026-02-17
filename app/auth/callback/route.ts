import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next')?.trim();
  const next = nextParam && nextParam.startsWith('/') ? nextParam : '/dashboard';

  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host');
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (forwardedHost ? `https://${forwardedHost}` : requestUrl.origin);

  const base = baseUrl.replace(/\/$/, '');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      const response = NextResponse.redirect(`${base}${next}`);
      if (data.session.provider_token) {
        response.cookies.set(X_TOKEN_COOKIE, data.session.provider_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: COOKIE_MAX_AGE,
        });
      }
      return response;
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
