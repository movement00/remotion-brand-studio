'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Film,
  LayoutGrid,
  Sparkles,
  Video,
  PlusCircle,
} from 'lucide-react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/brands', icon: Palette, label: 'Markalar' },
  { href: '/create', icon: PlusCircle, label: 'Video Oluştur' },
  { href: '/templates', icon: LayoutGrid, label: 'Şablonlar' },
  { href: '/topics', icon: Sparkles, label: 'AI Konular' },
  { href: '/videos', icon: Video, label: 'Videolarım' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col border-r"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-amber))' }}
          >
            <Film size={20} color="white" />
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              Brand Studio
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Video Pipeline</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="glass rounded-xl p-4">
          <p className="text-xs font-medium" style={{ color: 'var(--accent-amber)' }}>
            Remotion Powered
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            AI Video Generation Pipeline
          </p>
        </div>
      </div>
    </aside>
  );
}
