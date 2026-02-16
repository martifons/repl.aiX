'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getUser as getStoredUser, setUser, logout as logoutStorage, MockUser } from '@/lib/mockUser';

interface AuthContextType {
  user: MockUser | null;
  isLogged: boolean;
  isLoading: boolean;
  login: (user?: MockUser) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(() => {
    if (typeof window === 'undefined') return;
    setUserState(getStoredUser());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setUserState(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = useCallback((u?: MockUser) => {
    if (typeof window === 'undefined') return;
    const toSet = u ?? getStoredUser();
    if (!toSet) return;
    setUser(toSet);
    setUserState(toSet);
  }, []);

  const logout = useCallback(() => {
    if (typeof window === 'undefined') return;
    logoutStorage();
    setUserState(null);
  }, []);

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
