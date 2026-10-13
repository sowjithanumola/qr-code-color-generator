import React from 'react';
import { QrCode, Sun, Moon, Plus, Menu } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="flex h-16 items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <QrCode className="h-5 w-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                QR Studio Pro
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'create'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => onNavigate('my-qrs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'my-qrs'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            My QR Codes
          </button>
          <button
            type="button"
            onClick={() => onNavigate('scanner')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'scanner'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Scanner
          </button>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'analytics'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create QR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
