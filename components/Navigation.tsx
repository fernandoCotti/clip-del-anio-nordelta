'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/setup')) {
    return null;
  }

  return (
    <nav className="bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 shadow-lg mb-8 border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transition-all"
          >
            Inicio
          </Link>
          <div className="flex gap-4">
            <Link
              href="/rounds"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Rondas
            </Link>
            <Link
              href="/bracket"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Bracket
            </Link>
            <Link
              href="/admin/login"
              className="text-white/70 hover:text-white/90 font-medium transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
