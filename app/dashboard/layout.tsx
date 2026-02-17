'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import ProtectedRoute from '@/components/ProtectedRoute';
import { SidebarItem } from '@/components/ui/SidebarItem';
import { DashboardThemeProvider } from '@/context/DashboardThemeContext';

const navAll = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/tweets', label: 'Tweets' },
  { href: '/dashboard/top-performing', label: 'Top Performing' },
  { href: '/dashboard/analytics', label: 'Analytics' },
  { href: '/dashboard/profile', label: 'Profile' },
];

const navFree = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/profile', label: 'Profile' },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { data: subscription } = useSubscriptionStatus(user?.email);
  const isDev = process.env.NODE_ENV === 'development';
  const hasPlan = subscription?.hasSubscription === true || isDev;
  const nav = hasPlan ? navAll : navFree;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [planDropdownOpen, setPlanDropdownOpen] = useState(false);
  const planDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!planDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (planDropdownRef.current && !planDropdownRef.current.contains(e.target as Node)) {
        setPlanDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [planDropdownOpen]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const goToPlans = () => {
    setPlanDropdownOpen(false);
    router.push('/#pricing');
  };

  return (
    <DashboardThemeProvider>
      <div className="flex min-h-screen">
        {/* Overlay móvil */}
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className={`fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        <aside
          className={`fixed left-0 top-0 z-40 h-screen w-60 border-r border-white/30 dashboard-glass transition-transform duration-300 ease-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/40 px-5">
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="text-lg font-semibold tracking-tight text-[#0057FF] hover:text-[#0047dd] transition-colors duration-300"
            >
              repl.aiX
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-white/50 hover:text-gray-700 lg:hidden transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-0.5 p-3">
            {nav.map((item) => (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
            <div className="mt-4 pt-4 border-t border-white/40">
              <button
                onClick={handleLogout}
                className="w-full rounded-[12px] px-3 py-2.5 text-left text-sm font-medium text-[#333333] hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </nav>
        </aside>

        <div className="ml-0 flex flex-1 flex-col min-w-0 lg:ml-60">
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/30 dashboard-glass px-4 sm:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-white/50 hover:text-gray-900 lg:hidden transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex flex-1 justify-end items-center gap-3 sm:gap-4">
              {/* Plan dropdown */}
              <div className="relative" ref={planDropdownRef}>
                <button
                  type="button"
                  onClick={() => setPlanDropdownOpen((o) => !o)}
                  className="rounded-full bg-[#0057FF]/10 px-2.5 py-1.5 text-xs font-medium text-[#0057FF] transition-all duration-200 hover:bg-[#0057FF]/15 hover:shadow-[0_0_16px_rgba(0,87,255,0.12)] active:scale-[0.98] flex items-center gap-1"
                  aria-expanded={planDropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.plan ?? '—'}
                  <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${planDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`absolute right-0 top-full mt-1.5 min-w-[180px] rounded-xl border border-white/60 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-all duration-200 origin-top ${
                    planDropdownOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <div className="p-2">
                    <p className="px-3 py-1.5 text-xs text-gray-500">Current plan</p>
                    <button
                      type="button"
                      onClick={goToPlans}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#0057FF] hover:bg-[#0057FF]/10 transition-colors"
                    >
                      View plans & upgrade
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile link */}
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 -mr-2 transition-all duration-200 hover:bg-white/50 hover:shadow-[0_0_12px_rgba(0,87,255,0.06)] active:scale-[0.98]"
              >
                <span className="text-sm font-medium text-[#1A1A1A] hidden sm:inline">{user?.name ?? 'User'}</span>
                <div className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/60 bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 hover:border-[#0057FF]/30 hover:shadow-[0_2px_12px_rgba(0,87,255,0.12)]">
                  {user?.avatar && (
                    <Image src={user.avatar} alt="" width={36} height={36} className="object-cover" />
                  )}
                </div>
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </DashboardThemeProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoute>
  );
}
