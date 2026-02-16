import Link from 'next/link';
import { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center rounded-[12px] font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0057FF] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 btn-premium-active';

const variants: Record<Variant, string> = {
  primary:
    'bg-[#0057FF] text-white shadow-[0_2px_8px_rgba(0,87,255,0.25)] hover:bg-[#0047dd] hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(0,87,255,0.35)] active:translate-y-0 active:scale-[0.98]',
  secondary:
    'border border-gray-300 bg-white text-[#333333] hover:border-[#0057FF] hover:bg-[#0057FF]/5 hover:text-[#0057FF] hover:shadow-[0_0_20px_rgba(0,87,255,0.08)] active:bg-[#0057FF]/10 active:scale-[0.98]',
  ghost:
    'text-gray-600 hover:bg-[#F7F8FA] hover:text-gray-900 active:bg-gray-200 active:scale-[0.98]',
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

const sizeMap = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${base} ${variants[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
