import React, { useState } from 'react';
import { AppSettings, loadSavedQRCodes, saveSettings } from '../utils/storage';
import { SavedQRCode } from '../types/qr';
import {
  Settings,
  Download,
  Upload,
  Trash2,
  Check,
  Moon,
  Sun,
  Shield,
  FileCode,
} from 'lucide-react';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onReloadSavedCodes: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onReloadSavedCodes,
}) => {
  const [savedStatus, setSavedStatus] = useState(false);

  const update = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    onUpdateSettings(updated);
    saveSettings(updated);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const codes = loadSavedQRCodes();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(codes, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qr_studio_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const current = loadSavedQRCodes();
          const combined = [...imported, ...current.filter((c) => !imported.some((i) => i.id === c.id))];
          localStorage.setItem('qr_studio_saved_codes_v1', JSON.stringify(combined));
          onReloadSavedCodes();
          alert(`Successfully imported ${imported.length} QR code designs!`);
        }
      } catch {
        alert('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all saved QR codes? This action cannot be undone.')) {
      localStorage.removeItem('qr_studio_saved_codes_v1');
      onReloadSavedCodes();
      alert('All saved QR codes have been cleared.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Studio Preferences & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure default generator presets, interface theme, and library backups.
          </p>
        </div>

        {savedStatus && (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
      </div>

      {/* General Settings */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          Defaults & Interface
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Default Theme
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update({ theme: 'dark' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  settings.theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Dark Mode</span>
              </button>
              <button
                type="button"
                onClick={() => update({ theme: 'light' })}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-colors ${
                  settings.theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50/60 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Default Download Format
            </label>
            <select
              value={settings.defaultExportFormat}
              onChange={(e) => update({ defaultExportFormat: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="png">PNG Image (Transparent or Solid)</option>
              <option value="svg">SVG Vector (Infinite Scaling)</option>
              <option value="jpeg">JPEG Image (High Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Default Export Resolution
            </label>
            <select
              value={settings.defaultResolution}
              onChange={(e) => update({ defaultResolution: parseInt(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="512">512px (Standard Screen / Web)</option>
              <option value="1024">1024px (High-Res 2x)</option>
              <option value="2048">2048px (Ultra-HD Print 4x)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              Default Error Correction
            </label>
            <select
              value={settings.defaultErrorCorrection}
              onChange={(e) => update({ defaultErrorCorrection: e.target.value as any })}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            >
              <option value="L">L - Low (7% redundancy)</option>
              <option value="M">M - Medium (15% redundancy - Standard)</option>
              <option value="Q">Q - Quartile (25% redundancy)</option>
              <option value="H">H - High (30% redundancy - Best for Logos)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
          Backup & Data Management
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          All your QR designs and custom themes are stored locally in your browser. You can export a JSON backup to transfer to another device or restore at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            <span>Export Library JSON</span>
          </button>

          <label className="cursor-pointer flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            <Upload className="h-4 w-4" />
            <span>Restore from JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Library</span>
          </button>
        </div>
      </div>
    </div>
  );
};
