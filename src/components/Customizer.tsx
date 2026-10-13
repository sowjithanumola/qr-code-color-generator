import React, { useState } from 'react';
import { QRStyleConfig, DotStyle, CornerStyle, ErrorCorrectionLevel } from '../types/qr';
import { THEME_PRESETS, PRESET_LOGOS } from '../utils/presets';
import {
  Palette,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  ShieldCheck,
  Upload,
  Trash2,
} from 'lucide-react';

interface CustomizerProps {
  config: QRStyleConfig;
  onChange: (config: QRStyleConfig) => void;
}

export const Customizer: React.FC<CustomizerProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'shapes' | 'logo' | 'reliability' | 'presets'>('colors');

  const update = (partial: Partial<QRStyleConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      update({
        logoUrl: result,
        errorCorrectionLevel: 'H', // automatically bump error correction for reliable scanning
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto p-1.5 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'colors'
              ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Colors & Gradient</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shapes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'shapes'
              ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Shapes & Eyes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'logo'
              ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Center Logo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reliability')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'reliability'
              ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Margin & Error Level</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'presets'
              ? 'bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Themes</span>
        </button>
      </div>

      <div className="p-5">
        {/* Colors & Gradient Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  Foreground Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.fgColor}
                    onChange={(e) => update({ fgColor: e.target.value })}
                    className="h-9 w-12 rounded-lg border border-slate-200 bg-white p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
                  />
                  <input
                    type="text"
                    value={config.fgColor}
                    onChange={(e) => update({ fgColor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Background Color
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={config.isTransparentBg}
                      onChange={(e) => update({ isTransparentBg: e.target.checked })}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Transparent</span>
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={config.isTransparentBg}
                    value={config.bgColor}
                    onChange={(e) => update({ bgColor: e.target.value })}
                    className={`h-9 w-12 rounded-lg border border-slate-200 bg-white p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800 ${
                      config.isTransparentBg ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  />
                  <input
                    type="text"
                    disabled={config.isTransparentBg}
                    value={config.bgColor}
                    onChange={(e) => update({ bgColor: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-mono uppercase text-slate-900 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Options */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Gradient Fill
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.isGradient}
                    onChange={(e) => update({ isGradient: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {config.isGradient && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Gradient End Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.gradientColor2}
                          onChange={(e) => update({ gradientColor2: e.target.value })}
                          className="h-8 w-10 rounded border border-slate-200 bg-white p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
                        />
                        <input
                          type="text"
                          value={config.gradientColor2}
                          onChange={(e) => update({ gradientColor2: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-mono uppercase text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Gradient Type</label>
                      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
                        <button
                          type="button"
                          onClick={() => update({ gradientType: 'linear' })}
                          className={`py-1 text-xs font-medium rounded-md transition-colors ${
                            config.gradientType === 'linear'
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Linear
                        </button>
                        <button
                          type="button"
                          onClick={() => update({ gradientType: 'radial' })}
                          className={`py-1 text-xs font-medium rounded-md transition-colors ${
                            config.gradientType === 'radial'
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          Radial
                        </button>
                      </div>
                    </div>
                  </div>

                  {config.gradientType === 'linear' && (
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Gradient Angle</span>
                        <span className="font-mono tabular-nums">{config.gradientAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="15"
                        value={config.gradientAngle}
                        onChange={(e) => update({ gradientAngle: parseInt(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shapes & Eyes Tab */}
        {activeTab === 'shapes' && (
          <div className="space-y-5">
            {/* Dot Modules Style */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                QR Dot Modules Style
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(
                  [
                    { id: 'square', label: 'Classic Square' },
                    { id: 'rounded', label: 'Soft Rounded' },
                    { id: 'dots', label: 'Circular Dots' },
                    { id: 'class', label: 'Squircle' },
                    { id: 'diamond', label: 'Diamond' },
                  ] as { id: DotStyle; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => update({ dotStyle: item.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      config.dotStyle === item.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300'
                    }`}
                  >
                    <span className="mb-1 text-base">
                      {item.id === 'square' && '■'}
                      {item.id === 'rounded' && '▢'}
                      {item.id === 'dots' && '●'}
                      {item.id === 'class' && '◆'}
                      {item.id === 'diamond' && '◇'}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Finder Eyes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Corner Finder Pattern Shape
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(
                  [
                    { id: 'square', label: 'Standard' },
                    { id: 'rounded', label: 'Rounded' },
                    { id: 'extra-rounded', label: 'Smooth' },
                    { id: 'circle', label: 'Circular' },
                    { id: 'leaf', label: 'Leaf / Teardrop' },
                  ] as { id: CornerStyle; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => update({ cornerStyle: item.id })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      config.cornerStyle === item.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                        : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Eye Colors */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Custom Corner Eye Colors
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.customEyeColor}
                    onChange={(e) => update({ customEyeColor: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {config.customEyeColor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Outer Ring Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.outerEyeColor}
                        onChange={(e) => update({ outerEyeColor: e.target.value })}
                        className="h-8 w-10 rounded border border-slate-200 bg-white p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        value={config.outerEyeColor}
                        onChange={(e) => update({ outerEyeColor: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono uppercase text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Inner Eye Center Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.innerEyeColor}
                        onChange={(e) => update({ innerEyeColor: e.target.value })}
                        className="h-8 w-10 rounded border border-slate-200 bg-white p-1 cursor-pointer dark:border-slate-700 dark:bg-slate-800"
                      />
                      <input
                        type="text"
                        value={config.innerEyeColor}
                        onChange={(e) => update({ innerEyeColor: e.target.value })}
                        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-mono uppercase text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center Logo Tab */}
        {activeTab === 'logo' && (
          <div className="space-y-5">
            {/* Upload or Preset */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Center Logo / Brand Icon
              </label>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-2.5 text-xs font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                  <Upload className="h-4 w-4" />
                  <span>Upload Image (PNG, JPG, SVG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {config.logoUrl && (
                  <button
                    type="button"
                    onClick={() => update({ logoUrl: '' })}
                    className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove Logo</span>
                  </button>
                )}
              </div>

              {/* Preset Icons */}
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500">Or choose a preset standard icon:</p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {PRESET_LOGOS.map((logo) => {
                    const isSelected = config.logoUrl === logo.url;
                    return (
                      <button
                        key={logo.id}
                        type="button"
                        onClick={() => update({ logoUrl: logo.url, errorCorrectionLevel: 'H' })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/50'
                            : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40'
                        }`}
                      >
                        <div className="h-7 w-7 flex items-center justify-center mb-1">
                          {logo.url ? (
                            <img src={logo.url} alt={logo.name} className="h-5 w-5 object-contain" />
                          ) : (
                            <span className="text-xs text-slate-400">None</span>
                          )}
                        </div>
                        <span className="truncate w-full text-center text-slate-600 dark:text-slate-400">
                          {logo.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {config.logoUrl && (
              <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Logo Scale</span>
                      <span className="font-mono tabular-nums">{config.logoSize}%</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="28"
                      value={config.logoSize}
                      onChange={(e) => update({ logoSize: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Kept under 28% to prevent covering required data modules.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Badge Background Shape</label>
                    <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      {(['circle', 'rounded', 'square'] as const).map((shape) => (
                        <button
                          key={shape}
                          type="button"
                          onClick={() => update({ logoShape: shape })}
                          className={`py-1 text-xs capitalize font-medium rounded-md transition-colors ${
                            config.logoShape === shape
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {shape}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reliability & Margins Tab */}
        {activeTab === 'reliability' && (
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
                <span className="font-semibold uppercase tracking-wider text-slate-500">
                  Quiet Zone (Margin)
                </span>
                <span className="font-mono tabular-nums">{config.margin} blocks</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={config.margin}
                onChange={(e) => update({ margin: parseInt(e.target.value) })}
                className="w-full accent-indigo-600"
              />
              <p className="text-xs text-slate-500 mt-1">
                A quiet zone of 2-3 blocks is recommended for posters, labels, and fast phone scanning.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { level: 'L', label: 'Low (7%)', desc: 'Dense data' },
                    { level: 'M', label: 'Medium (15%)', desc: 'Standard' },
                    { level: 'Q', label: 'Quartile (25%)', desc: 'High safety' },
                    { level: 'H', label: 'High (30%)', desc: 'Best for logos' },
                  ] as { level: ErrorCorrectionLevel; label: string; desc: string }[]
                ).map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => update({ errorCorrectionLevel: item.level })}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      config.errorCorrectionLevel === item.level
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-sm font-bold font-mono">{item.level}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Themes Presets Tab */}
        {activeTab === 'presets' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              One-Click Designer Color Palettes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => update(preset.config)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-xs text-left dark:border-slate-800 dark:bg-slate-950/40 transition-all"
                >
                  <div
                    className="h-10 w-10 rounded-lg shrink-0 border border-black/10 flex items-center justify-center shadow-xs"
                    style={{
                      background: preset.config.isGradient
                        ? `linear-gradient(135deg, ${preset.config.fgColor}, ${preset.config.gradientColor2})`
                        : preset.config.fgColor,
                    }}
                  >
                    <div className="h-3 w-3 rounded-xs bg-white/80" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{preset.category}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
