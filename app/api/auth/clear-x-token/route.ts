import { NextResponse } from 'next/server';
import { X_TOKEN_COOKIE } from '@/lib/xAuth';

export async function POST() {
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
