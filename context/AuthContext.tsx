'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';
import { getHighResAvatarUrl } from '@/lib/avatarUtils';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  email: string;
  plan: 'Starter' | 'Pro' | 'Growth';
  repliesUsedToday: number;
  repliesLimit: number;
  joinDate: string;
  avatar: string;
  /** Token de X para llamadas API (desde provider_token si existe) */
  providerToken?: string;
}

interface AuthContextType {
  user: AppUser | null;
  isLogged: boolean;
  isLoading: boolean;
  login: (user?: AppUser) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const X_TOKEN_KEY = 'replaix_x_token';

function mapSessionToAppUser(session: Session): AppUser {
  const u = session.user;
  const meta = u.user_metadata ?? {};
  const name = meta.name ?? meta.full_name ?? meta.user_name ?? u.email ?? 'User';
  const username = meta.user_name ? `@${meta.user_name}` : '@user';
  const rawAvatar = meta.avatar_url ?? meta.profile_image_url_https ?? meta.picture ?? '';
  let providerToken = session.provider_token ?? undefined;
  if (typeof window !== 'undefined') {
    if (providerToken) {
      try {
        localStorage.setItem(`${X_TOKEN_KEY}_${u.id}`, providerToken);
      } catch (_) { /* ignore */ }
    } else {
      try {
        const stored = localStorage.getItem(`${X_TOKEN_KEY}_${u.id}`);
        if (stored) providerToken = stored;
      } catch (_) { /* ignore */ }
    }
  }
  return {
    id: u.id,
    name: String(name),
    username,
    email: u.email ?? '',
    plan: 'Starter',
    repliesUsedToday: 0,
    repliesLimit: 15,
    joinDate: new Date().toISOString().slice(0, 10),
    avatar: getHighResAvatarUrl(String(rawAvatar)) || String(rawAvatar),
    providerToken,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUserState(mapSessionToAppUser(session));
    } else {
      setUserState(null);
    }
  }, [supabase.auth]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUserState(mapSessionToAppUser(session));
      } else {
        setUserState(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserState(mapSessionToAppUser(session));
      } else {
        setUserState(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const login = useCallback((u?: AppUser) => {
    if (u) setUserState(u);
  }, []);

  const logout = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k?.startsWith(X_TOKEN_KEY + '_')) keysToRemove.push(k);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        await fetch('/api/auth/clear-x-token', { method: 'POST', credentials: 'include' });
      } catch (_) { /* ignore */ }
    }
    await supabase.auth.signOut();
    setUserState(null);
  }, [supabase.auth]);

  const isLogged = !!user;

  return (
    <AuthContext.Provider value={{ user, isLogged, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
