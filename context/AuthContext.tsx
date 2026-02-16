'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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

function mapSessionToAppUser(session: Session): AppUser {
  const u = session.user;
  const meta = u.user_metadata ?? {};
  const name = meta.name ?? meta.full_name ?? meta.user_name ?? u.email ?? 'User';
  const username = meta.user_name ? `@${meta.user_name}` : '@user';
  const avatar = meta.avatar_url ?? meta.profile_image_url_https ?? meta.picture ?? '';
  return {
    id: u.id,
    name: String(name),
    username,
    email: u.email ?? '',
    plan: 'Starter',
    repliesUsedToday: 0,
    repliesLimit: 15,
    joinDate: new Date().toISOString().slice(0, 10),
    avatar: String(avatar),
    providerToken: session.provider_token ?? undefined,
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
