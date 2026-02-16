'use client';

import { ReactNode } from 'react';
import { useDashboardTheme } from '@/context/DashboardThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  premium?: boolean;
  glass?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({ children, className = '', padding = 'md', premium = true, glass }: CardProps) {
  const isDashboard = useDashboardTheme();
  const useGlass = glass ?? isDashboard;

  return (
    <div
      className={`rounded-[16px] border transition-all duration-300 ${
        useGlass
          ? 'card-dashboard'
          : premium
            ? 'card-premium border-[rgba(0,0,0,0.06)] bg-white hover:border-[rgba(0,0,0,0.08)]'
            : 'bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]'
      } ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-100/80 pb-4 ${className}`}>
      {children}
    </div>
  );
}
