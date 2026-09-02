'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white transition-colors';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/feed" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <Globe className="h-6 w-6 text-indigo-500 animate-pulse" />
            <span>SocialSphere</span>
          </Link>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/feed" className={isActive('/feed')}>
            Feed
          </Link>
          <Link href="/about" className={isActive('/about')}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
