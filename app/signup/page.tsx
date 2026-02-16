'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { setUser, createUser } from '@/lib/mockUser';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const user = createUser({
      name: name || 'User',
      username: username ? (username.startsWith('@') ? username : `@${username}`) : '@user',
      email: email || 'user@example.com',
    });
    setUser(user);
    login();
    router.replace('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] animate-fade-in">
        <Card padding="lg" className="shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[16px]">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Start growing on X with repl.aiX
          </p>
          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-premium mt-1.5 w-full rounded-[12px] border-2 border-gray-200 bg-[#F7F8FA] px-4 py-2.5 text-[#1A1A1A] placeholder-gray-400 transition-all duration-300"
                placeholder="Martí"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                X username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-premium mt-1.5 w-full rounded-[12px] border-2 border-gray-200 bg-[#F7F8FA] px-4 py-2.5 text-[#1A1A1A] placeholder-gray-400 transition-all duration-300"
                placeholder="@martifons"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
              Create account
            </Button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-500">
            Demo: no real signup. User is stored in your browser.
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
