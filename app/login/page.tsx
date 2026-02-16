'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = useMemo(() => searchParams.get('error') === 'auth', [searchParams]);

  useEffect(() => {
    if (!isLoading && isLogged) {
      router.replace('/dashboard');
    }
  }, [isLoading, isLogged, router]);

  const handleSignInWithX = async () => {
    const supabase = createClient();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: {
        redirectTo: `${origin}/auth/callback`,
        scopes: 'tweet.read tweet.write users.read follows.read offline.access',
      },
    });
    if (error) {
      console.error('OAuth error:', error);
      return;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <p className="text-[#333333]">Loading…</p>
      </div>
    );
  }

  if (isLogged) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] animate-fade-in">
        <Card padding="lg" className="shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[16px]">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#333333]">
            Sign in with your X account to use repl.aiX
          </p>
          {authError && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              Sign in failed. Please try again.
            </p>
          )}
          <div className="mt-8">
            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(0,87,255,0.35)]"
              onClick={handleSignInWithX}
            >
              Sign in with X
            </Button>
          </div>
          <p className="mt-6 text-center text-xs text-gray-500">
            We use your X account to show your timeline and post replies. We never post without your approval.
          </p>
          <p className="mt-4 text-center text-sm text-[#333333]">
            Don&apos;t have an account? Signing in with X will create one.
          </p>
          <p className="mt-3 text-center">
            <Link href="/" className="text-sm text-[#333333] hover:text-[#0057FF] transition-colors duration-300">
              Back to home
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
