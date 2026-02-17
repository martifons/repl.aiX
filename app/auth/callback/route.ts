import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
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
      const token = data.session.provider_token;
      const userId = data.session.user?.id;

      if (token && userId) {
        const admin = createAdminClient();
        if (admin) {
          try {
            await admin.from('user_x_tokens').upsert(
              { user_id: userId, x_access_token: token, updated_at: new Date().toISOString() },
              { onConflict: 'user_id' }
            );
          } catch (_) {
            // Table may not exist yet; cookie/cookie still used
          }
        }
      }

      const response = NextResponse.redirect(`${base}${next}`);
      if (token) {
        response.cookies.set(X_TOKEN_COOKIE, token, {
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
