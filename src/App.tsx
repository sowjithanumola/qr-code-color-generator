/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  Globe,
  ExternalLink,
  Download,
  RotateCcw,
  AlertCircle,
  Check,
  Copy,
  Palette,
  ArrowRightLeft,
  Sparkles,
  Maximize2,
} from 'lucide-react';

interface ColorPreset {
  id: string;
  name: string;
  fg: string;
  bg: string;
}

const PRESET_COLORS: ColorPreset[] = [
  { id: 'black-white', name: 'Black on White', fg: '#000000', bg: '#ffffff' },
  { id: 'purple-white', name: 'Purple on White', fg: '#7c3aed', bg: '#ffffff' },
  { id: 'blue-white', name: 'Blue on White', fg: '#2563eb', bg: '#ffffff' },
  { id: 'red-white', name: 'Red on White', fg: '#dc2626', bg: '#ffffff' },
  { id: 'green-white', name: 'Green on White', fg: '#16a34a', bg: '#ffffff' },
  { id: 'white-black', name: 'White on Black', fg: '#ffffff', bg: '#000000' },
  { id: 'pink-white', name: 'Pink on White', fg: '#db2777', bg: '#ffffff' },
  { id: 'darkblue-lightblue', name: 'Dark Blue on Light Blue', fg: '#1e3a8a', bg: '#e0f2fe' },
];

// Helper to calculate color contrast ratio
function getContrastRatio(fgHex: string, bgHex: string): number {
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map((c) => c + c).join('');
    const num = parseInt(clean, 16);
    if (isNaN(num)) return { r: 0, g: 0, b: 0 };
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  const getLuminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(hexToRgb(fgHex));
  const l2 = getLuminance(hexToRgb(bgHex));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export default function App() {
  const [urlInput, setUrlInput] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [margin, setMargin] = useState<number>(2);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [justGenerated, setJustGenerated] = useState(false);

  // Normalize URL by ensuring https:// protocol
  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const normalizedUrl = normalizeUrl(urlInput);

  // Generate QR Code immediately on input/color/margin changes
  const generateQRCode = async (targetUrl: string, fg: string, bg: string, m: number) => {
    if (!targetUrl.trim()) {
      setQrDataUrl(null);
      return;
    }

    try {
      setError(null);
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 1000,
        margin: m,
        errorCorrectionLevel: 'Q',
        color: {
          dark: fg,
          light: bg,
        },
      });
      setQrDataUrl(dataUrl);
    } catch {
      setError('Unable to encode this URL into a QR code. Please check the URL format.');
      setQrDataUrl(null);
    }
  };

  // Immediate update when URL, colors, or margin change
  useEffect(() => {
    if (normalizedUrl) {
      generateQRCode(normalizedUrl, fgColor, bgColor, margin);
    } else {
      setQrDataUrl(null);
    }
  }, [normalizedUrl, fgColor, bgColor, margin]);

  // Explicit button handler for "Generate QR Code"
  const handleExplicitGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please enter a website URL to generate your QR code.');
      setQrDataUrl(null);
      return;
    }

    const finalUrl = normalizeUrl(trimmed);
    generateQRCode(finalUrl, fgColor, bgColor, margin);
    setJustGenerated(true);
    setTimeout(() => setJustGenerated(false), 2000);
  };

  // Clear button handler
  const handleClear = () => {
    setUrlInput('');
    setFgColor('#000000');
    setBgColor('#ffffff');
    setMargin(2);
    setQrDataUrl(null);
    setError(null);
  };

  // Swap colors
  const handleSwapColors = () => {
    setFgColor(bgColor);
    setBgColor(fgColor);
  };

  // Apply a preset
  const handleApplyPreset = (preset: ColorPreset) => {
    setFgColor(preset.fg);
    setBgColor(preset.bg);
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy Image to clipboard
  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Direct image copy is not supported in this browser. Please use the Download button.');
    }
  };

  const contrast = getContrastRatio(fgColor, bgColor);
  const isLowContrast = contrast < 3.0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800 antialiased font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-20 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <QrCode className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              QR Code Generator
            </span>
          </div>

          <span className="text-xs font-medium text-slate-500 hidden sm:inline-block">
            Custom Colors · Instant Preview · PNG Export
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="space-y-8">
          {/* Headline */}
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Generate Colorful, Scannable QR Codes
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Enter any URL, pick your favorite color combination, and download a high-resolution PNG image ready for web, print, or posters.
            </p>
          </div>

          {/* Generator Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-7">
            {/* 1. Website URL Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Website URL</span>
                </label>

                {normalizedUrl && (
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                    title="Open this URL in a new tab to test it"
                  >
                    <span>Test URL</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Globe className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="example.com or https://yourwebsite.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-hidden transition-all shadow-2xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {urlInput.trim() && !/^https?:\/\//i.test(urlInput)
                    ? `Auto-prepends: ${normalizedUrl}`
                    : 'Opens in mobile camera or browser when scanned'}
                </span>
                {urlInput.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUrlInput('')}
                    className="text-slate-400 hover:text-slate-600 hover:underline"
                  >
                    Clear URL
                  </button>
                )}
              </div>
            </div>

            {/* 2. Color Customization Section */}
            <div className="space-y-4 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Color Customization</span>
                </label>

                <button
                  type="button"
                  onClick={handleSwapColors}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  title="Swap foreground and background colors"
                >
                  <ArrowRightLeft className="h-3 w-3" />
                  <span>Swap</span>
                </button>
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Foreground picker */}
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700">
                      Foreground (Dots)
                    </span>
                    <span className="block text-xs font-mono uppercase text-slate-400">
                      {fgColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="h-10 w-12 rounded-xl border border-slate-200 bg-white p-1 cursor-pointer shadow-2xs"
                    />
                  </div>
                </div>

                {/* Background picker */}
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-xs font-semibold text-slate-700">
                      Background
                    </span>
                    <span className="block text-xs font-mono uppercase text-slate-400">
                      {bgColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-12 rounded-xl border border-slate-200 bg-white p-1 cursor-pointer shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Contrast warning if applicable */}
              {isLowContrast && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2.5 text-xs text-amber-800 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    <strong>Low contrast warning:</strong> The selected foreground and background colors have a low contrast ratio ({contrast.toFixed(1)}:1). Consider choosing colors with higher contrast to ensure rapid scanning on older phones.
                  </span>
                </div>
              )}

              {/* Preset Palettes */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-medium text-slate-500">
                  Preset Color Combinations
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_COLORS.map((preset) => {
                    const isSelected = fgColor === preset.fg && bgColor === preset.bg;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/60 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                        }`}
                      >
                        {/* Two-tone swatch badge */}
                        <div
                          className="h-6 w-6 rounded-lg border border-black/10 shrink-0 flex items-center justify-center shadow-2xs"
                          style={{ backgroundColor: preset.bg }}
                        >
                          <div
                            className="h-2.5 w-2.5 rounded-xs"
                            style={{ backgroundColor: preset.fg }}
                          />
                        </div>

                        <span className="text-xs font-medium text-slate-700 truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Margin Size Control Slider */}
            <div className="space-y-3 pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Margin Size (Quiet Zone)</span>
                </label>
                <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md tabular-nums border border-indigo-100">
                  {margin} {margin === 1 ? 'block' : 'blocks'}
                </span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  aria-label="QR Code Margin Size"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>1 (Tight)</span>
                  <span>5 (Default / Balanced)</span>
                  <span>10 (Spacious)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Adjusts the white space / breathing room around the edges of the QR code (1 to 10).
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 flex items-center gap-2.5 text-xs text-rose-700 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons: Generate & Clear */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExplicitGenerate}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors cursor-pointer"
              >
                {justGenerated ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-300" />
                    <span>Generated!</span>
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4" />
                    <span>Generate QR Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-slate-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-slate-400" />
                <span>Clear</span>
              </button>
            </div>

            {/* 3. QR Code Preview & Download Card */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>Live QR Code Preview</span>
              </label>

              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 flex flex-col items-center justify-center min-h-[320px]">
                {qrDataUrl ? (
                  <div className="space-y-5 w-full flex flex-col items-center animate-in zoom-in-95 duration-150">
                    {/* The QR Code Container */}
                    <div
                      className="p-4 rounded-2xl shadow-sm border border-slate-200/80 inline-block transition-transform hover:scale-[1.01]"
                      style={{ backgroundColor: bgColor }}
                    >
                      <img
                        src={qrDataUrl}
                        alt="Customized QR Code"
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                      />
                    </div>

                    {/* Scannable Indicator */}
                    <div className="text-center space-y-0.5">
                      <p className="text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Ready to Scan</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Target: {normalizedUrl}
                      </p>
                    </div>

                    {/* Download & Copy Buttons */}
                    <div className="w-full max-w-sm flex flex-col sm:flex-row items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition-colors cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download PNG</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyImage}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                        )}
                        <span>{copied ? 'Copied!' : 'Copy Image'}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-6 text-center text-slate-400">
                    <div className="h-16 w-16 mx-auto rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                      <QrCode className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        No QR Code Generated Yet
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                        Enter a website URL above to preview and download your customized QR code.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-400">
        <p>Simple, reliable, and high-resolution QR Code Generator.</p>
      </footer>
    </div>
  );
}
