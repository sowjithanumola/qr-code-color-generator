import React from 'react';
import { SavedQRCode, ScanLog } from '../types/qr';
import {
  QrCode,
  Zap,
  ArrowRight,
  TrendingUp,
  Layers,
  ScanLine,
  FolderHeart,
  Globe,
  Wifi,
  Contact,
  CreditCard,
  Plus,
} from 'lucide-react';

interface DashboardViewProps {
  savedCodes: SavedQRCode[];
  scanLogs: ScanLog[];
  onNavigate: (view: string) => void;
  onEditCode: (code: SavedQRCode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  savedCodes,
  scanLogs,
  onNavigate,
  onEditCode,
}) => {
  const totalScans = savedCodes.reduce((acc, c) => acc + (c.totalScans || 0), 0) + scanLogs.length;
  const dynamicCount = savedCodes.filter((c) => c.isDynamic).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner adhering to strict anti-slop guidelines */}
      <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span>Next-Gen QR Studio</span>
            <span aria-hidden="true">·</span>
            <span>Vector & Print Ready</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-balance">
            Create. Customize. Scan.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Design beautiful, high-reliability QR codes with custom dots, brand logos, vibrant gradients, and dynamic analytics. Built for packaging, business cards, and digital marketing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create New QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('scanner')}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <ScanLine className="h-4 w-4" />
              <span>Scan QR Code</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Generated</span>
            <QrCode className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {savedCodes.length}
          </div>
          <p className="text-xs text-slate-400 mt-1">Saved custom designs</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Scans</span>
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalScans}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across all campaigns</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Dynamic Codes</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {dynamicCount}
          </div>
          <p className="text-xs text-slate-400 mt-1">Editable destinations</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Reliability Score</span>
            <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">98%</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            Optimal
          </div>
          <p className="text-xs text-slate-400 mt-1">Camera readability index</p>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Quick Creation Shortcuts
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('templates')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-1"
          >
            <span>View All Templates</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Website URL</p>
              <p className="text-[11px] text-slate-400">Instant web link</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Wi-Fi Connect</p>
              <p className="text-[11px] text-slate-400">Zero-typing network</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform shrink-0">
              <Contact className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Digital vCard</p>
              <p className="text-[11px] text-slate-400">Full contact info</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('create')}
            className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-400 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">UPI / Payment</p>
              <p className="text-[11px] text-slate-400">Scan & pay checkout</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent QR Codes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderHeart className="h-4 w-4 text-slate-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recently Saved QR Codes
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('my-qrs')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center gap-1"
          >
            <span>View All Library</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {savedCodes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800 bg-white dark:bg-slate-900">
            <QrCode className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No QR Codes Saved Yet
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Create your first custom QR code using the studio and save it to your library.
            </p>
            <button
              onClick={() => onNavigate('create')}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Create QR Code
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedCodes.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="uppercase font-semibold tracking-wider">{item.type}</span>
                    {item.isDynamic && (
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Dynamic
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-400 font-mono tabular-nums">
                    {item.totalScans} scans
                  </div>
                  <button
                    onClick={() => onEditCode(item)}
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Open in Studio
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
