'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Redirects to /dashboard when user is logged in. Use on home page so
 * after X login users go straight to dashboard.
 */
export default function RedirectIfLoggedIn({ children }: { children: React.ReactNode }) {
  const { isLogged, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLogged) {
      router.replace('/dashboard');
    }
  }, [isLoading, isLogged, router]);

  if (!isLoading && isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <p className="text-[#333333]">Redirecting to dashboard…</p>
      </div>
    );
  }

  return <>{children}</>;
}
