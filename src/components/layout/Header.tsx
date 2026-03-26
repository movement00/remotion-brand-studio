'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-6 border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actions}
        <button
          className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center transition-all"
        >
          <Bell size={18} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </header>
  );
}
