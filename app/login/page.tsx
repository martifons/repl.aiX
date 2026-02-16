'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { setUser, createUser } from '@/lib/mockUser';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = createUser({ email: email || 'user@example.com' });
    setUser(user);
    login();
    router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] animate-fade-in">
        <Card padding="lg" className="shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[16px]">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A]">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-[#333333]">
            Sign in to your repl.aiX account
          </p>
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333333]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium mt-1.5 w-full rounded-[12px] border-2 border-gray-200 bg-[#F7F8FA] px-4 py-2.5 text-[#1A1A1A] placeholder-gray-400 transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#333333]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium mt-1.5 w-full rounded-[12px] border-2 border-gray-200 bg-[#F7F8FA] px-4 py-2.5 text-[#1A1A1A] placeholder-gray-400 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(0,87,255,0.35)]">
              Sign in
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-500">
            Demo: any email/password works. User is stored in browser.
          </p>
          <p className="mt-4 text-center text-sm text-[#333333]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-[#0057FF] hover:underline transition-colors">
              Sign up
            </Link>
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
