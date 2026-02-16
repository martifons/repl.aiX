'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLogged) {
      router.replace('/dashboard');
    }
  }, [isLoading, isLogged, router]);

  const handleSignInWithX = async () => {
    const supabase = createClient();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'x',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
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
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Sign in with X to start using repl.aiX
          </p>
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
            One click with your X account. We’ll use it to show your timeline and post replies (only when you approve).
          </p>
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-[#0057FF] hover:underline">
              Sign in
            </Link>
          </p>
          <p className="mt-3 text-center">
            <Link href="/" className="text-sm text-[#333333] hover:text-[#0057FF] transition-colors">
              Back to home
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
