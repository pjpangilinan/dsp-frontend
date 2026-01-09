import React from 'react';
import type { PageView } from '../types';

interface HeaderProps {
  page: PageView;
  fileName: string | null;
  onNavigate: (page: PageView) => void;
}

export const Header: React.FC<HeaderProps> = ({ page, fileName, onNavigate }) => (
  <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-surface-border px-6 md:px-12 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md">
    <button 
      onClick={() => onNavigate('home')}
      className="flex items-center gap-4 text-slate-900 dark:text-white hover:opacity-80 transition-opacity cursor-pointer group"
      aria-label="Go to Home"
    >
      <div className="size-9 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
        <span className="material-symbols-outlined text-3xl">verified_user</span>
      </div>
    </button>

    {/* Center: Filename Display (Only in Analysis Mode) */}
    {page === 'analysis' && fileName && (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2 px-4 py-1.5 bg-slate-100 dark:bg-surface-border/50 rounded-full border border-gray-200 dark:border-surface-border/50">
        <span className="material-symbols-outlined text-sm text-slate-500">draft</span>
        <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
          {fileName}
        </span>
      </div>
    )}

    <div className="flex items-center gap-8">
      <button 
        onClick={() => onNavigate('about')}
        className="text-sm font-medium hover:text-primary transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
      >
        About
      </button>
    </div>
  </header>
);