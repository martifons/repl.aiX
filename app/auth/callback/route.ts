import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
