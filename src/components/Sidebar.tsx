import React from 'react';
import {
  LayoutDashboard,
  QrCode,
  FolderHeart,
  Layers,
  ScanLine,
  Palette,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  totalSaved: number;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'create', label: 'Create QR Code', icon: QrCode },
  { id: 'my-qrs', label: 'My QR Codes', icon: FolderHeart, badgeCount: true },
  { id: 'bulk', label: 'Bulk Generator', icon: Layers },
  { id: 'scanner', label: 'QR Scanner', icon: ScanLine },
  { id: 'templates', label: 'Templates', icon: Palette },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  totalSaved,
}) => {
  const content = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Mobile close button */}
        <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
              QR
            </div>
            <span className="font-bold text-slate-900 dark:text-white">QR Studio Pro</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspace
          </p>
          <div className="mt-2 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`h-4.5 w-4.5 shrink-0 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badgeCount && totalSaved > 0 && (
                    <span
                      className={`ml-auto font-mono text-xs tabular-nums px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {totalSaved}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Pro Plan / Local Engine Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100/60 p-3.5 dark:border-slate-800/80 dark:from-slate-900/60 dark:to-slate-900/30">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
          <span>Vector & Print Ready</span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Ultra-sharp SVG & 2048px exports with guaranteed phone camera readability.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white/70 dark:border-slate-800/80 dark:bg-slate-950/70 backdrop-blur-xl h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
};
