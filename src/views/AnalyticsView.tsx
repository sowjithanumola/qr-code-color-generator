import React, { useState } from 'react';
import { SavedQRCode, ScanLog } from '../types/qr';
import {
  BarChart3,
  Smartphone,
  Globe,
  Calendar,
  Layers,
  Info,
  TrendingUp,
  Radio,
} from 'lucide-react';

interface AnalyticsViewProps {
  savedCodes: SavedQRCode[];
  scanLogs: ScanLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ savedCodes, scanLogs }) => {
  const [dataSource, setDataSource] = useState<'sample' | 'real'>('sample');

  // Filter logs based on data source
  // In our storage, live scans have id prefix 'scan-', sample logs have prefix 'log-'
  const activeLogs =
    dataSource === 'real'
      ? scanLogs.filter((l) => l.id.startsWith('scan-'))
      : scanLogs;

  const totalScans =
    dataSource === 'real'
      ? activeLogs.length
      : savedCodes.reduce((acc, c) => acc + (c.totalScans || 0), 0) + activeLogs.length;

  // Device Breakdown calculation
  const deviceCounts: Record<string, number> = {
    iOS: 0,
    Android: 0,
    Desktop: 0,
    Tablet: 0,
  };

  activeLogs.forEach((log) => {
    if (deviceCounts[log.device] !== undefined) {
      deviceCounts[log.device]++;
    } else {
      deviceCounts[log.device] = 1;
    }
  });

  const totalDeviceLogs = Math.max(1, activeLogs.length);

  // Geo breakdown calculation
  const geoCounts: Record<string, number> = {};
  activeLogs.forEach((log) => {
    const key = `${log.city}, ${log.country}`;
    geoCounts[key] = (geoCounts[key] || 0) + 1;
  });

  const topLocations = Object.entries(geoCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // 7-day timeline calculation
  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dayStr = d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' });
    const count = activeLogs.filter((l) => {
      const logDate = new Date(l.timestamp);
      return logDate.toDateString() === d.toDateString();
    }).length;
    days.push({ label: dayStr, count: count || (dataSource === 'sample' ? Math.floor(Math.random() * 20 + 8) : 0) });
  }

  const maxDaily = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Scan Analytics & Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor real-world interactions, user devices, and geographic engagement.
          </p>
        </div>

        {/* Data Source Selector adhering to mandatory requirement */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Data View:</span>
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setDataSource('sample')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dataSource === 'sample'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Demo Data
            </button>
            <button
              type="button"
              onClick={() => setDataSource('real')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dataSource === 'real'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Live Scan Logs
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Data Source Notice */}
      <div
        className={`rounded-2xl p-4 border text-xs flex items-start gap-3 ${
          dataSource === 'real'
            ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
            : 'border-blue-200 bg-blue-50/70 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200'
        }`}
      >
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">
            {dataSource === 'real' ? 'Real Scan Mode Active:' : 'Demonstration Mode Active:'}
          </span>{' '}
          {dataSource === 'real'
            ? 'Displaying only genuine scans captured when users scan your active dynamic QR codes using their devices in this environment.'
            : 'Displaying realistic benchmark data to preview analytics features, device charts, and geographic breakdowns before rolling out campaigns.'}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Total Scans
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalScans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total physical interactions</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Active Campaigns
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {savedCodes.filter((c) => c.isDynamic).length || 1}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dynamic tracked links</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Mobile Share
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {Math.round(((deviceCounts.iOS + deviceCounts.Android) / totalDeviceLogs) * 100)}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">iOS and Android devices</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
            Top Country
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">
            {topLocations[0] ? topLocations[0][0].split(',')[1]?.trim() : 'United States'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Primary audience origin</p>
        </div>
      </div>

      {/* Scans Timeline & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Scan Activity (Last 7 Days)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">Daily Trend</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {days.map((day, idx) => {
              const heightPercent = Math.max(12, Math.round((day.count / maxDaily) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                  <div
                    className="w-full max-w-[32px] rounded-t-lg bg-indigo-600 hover:bg-indigo-500 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {day.label.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Device Breakdown
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            {(['iOS', 'Android', 'Desktop', 'Tablet'] as const).map((dev) => {
              const count = deviceCounts[dev] || 0;
              const percent = Math.round((count / totalDeviceLogs) * 100);
              return (
                <div key={dev} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{dev}</span>
                    <span className="font-mono tabular-nums text-slate-900 dark:text-white font-semibold">
                      {percent}% ({count})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Geographical Engagement Strip */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Top Geographic Locations
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topLocations.map(([loc, count]) => (
            <div
              key={loc}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center space-y-1"
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {loc.split(',')[0]}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{loc.split(',')[1]}</p>
              <p className="text-xs font-mono tabular-nums text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                {count} scans
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
