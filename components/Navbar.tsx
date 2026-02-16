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
      <nav className="h-16 border-b border-[rgba(0,0,0,0.05)] bg-[#FFFFFF]">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-semibold text-[#0057FF]">repl.aiX</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="h-16 border-b border-[rgba(0,0,0,0.05)] bg-[#FFFFFF]">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[#0057FF] hover:text-[#0047dd] transition-colors duration-300"
        >
          repl.aiX
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-[12px] px-3 py-2 text-sm font-medium text-[#333333] hover:bg-[#F7F8FA] hover:text-[#0057FF] transition-colors duration-300"
          >
            Dashboard
          </Link>
          {!isLogged ? (
            <ButtonLink href="/login" variant="primary" size="md">
              Get Started
            </ButtonLink>
          ) : (
            <Button variant="ghost" size="md" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
