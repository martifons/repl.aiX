'use client';

import Link from 'next/link';

interface SidebarItemProps {
  href: string;
  label: string;
  active?: boolean;
}

export function SidebarItem({ href, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`block rounded-[12px] px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
        active
          ? 'sidebar-item-active'
          : 'text-[#333333] hover:bg-[#0057FF]/8 hover:text-[#0057FF]'
      }`}
    >
      {label}
    </Link>
  );
}
