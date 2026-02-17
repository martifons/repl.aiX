'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, ButtonLink } from '@/components/ui/Button';

export default function Navbar() {
  const pathname = usePathname();
  const { isLogged, isLoading, logout } = useAuth();
  const router = useRouter();

  if (pathname?.startsWith('/dashboard')) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <nav className="h-14 sm:h-16 border-b border-[rgba(0,0,0,0.05)] bg-[#FFFFFF]">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-semibold text-[#0057FF]">repl.aiX</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="h-14 sm:h-16 border-b border-[rgba(0,0,0,0.05)] bg-[#FFFFFF] safe-area-padding-x">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -m-2 text-lg font-semibold tracking-tight text-[#0057FF] hover:text-[#0047dd] transition-colors duration-300 shrink-0"
        >
          repl.aiX
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            href="/dashboard"
            className="min-h-[44px] inline-flex items-center rounded-[12px] px-3 py-2.5 text-sm font-medium text-[#333333] hover:bg-[#F7F8FA] hover:text-[#0057FF] transition-colors duration-300 touch-manipulation"
          >
            Dashboard
          </Link>
          {!isLogged ? (
            <ButtonLink href="/login" variant="primary" size="md" className="min-h-[44px] touch-manipulation">
              Get Started
            </ButtonLink>
          ) : (
            <Button variant="ghost" size="md" onClick={handleLogout} className="min-h-[44px] touch-manipulation">
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
