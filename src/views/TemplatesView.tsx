import React, { useState } from 'react';
import { QRTemplate } from '../types/qr';
import { INITIAL_TEMPLATES } from '../utils/presets';
import { Palette, ArrowRight, Sparkles } from 'lucide-react';

interface TemplatesViewProps {
  onSelectTemplate: (template: QRTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'business', label: 'Business & Office' },
    { id: 'hospitality', label: 'Café & Dining' },
    { id: 'social', label: 'Creators & Social' },
    { id: 'payment', label: 'Commerce & UPI' },
  ];

  const filtered = INITIAL_TEMPLATES.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Designer QR Templates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Battle-tested, scan-guaranteed presets tailored for modern business applications.
          </p>
        </div>
      </div>

      {/* Category Pills (Interactive Filter Controls as functional buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl w-fit overflow-x-auto">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-5 hover:border-indigo-400 hover:shadow-md transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="uppercase font-semibold tracking-wider">{tmpl.type}</span>
                <span className="capitalize">{tmpl.category}</span>
              </div>

              {/* Color swatch badge */}
              <div className="flex items-center gap-2">
                <div
                  className="h-6 w-12 rounded-lg border border-black/10"
                  style={{
                    background: tmpl.config.isGradient
                      ? `linear-gradient(135deg, ${tmpl.config.fgColor}, ${tmpl.config.gradientColor2})`
                      : tmpl.config.fgColor,
                  }}
                />
                <span className="text-xs font-mono text-slate-400">
                  {tmpl.config.dotStyle} · {tmpl.config.cornerStyle}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {tmpl.name}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {tmpl.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Level {tmpl.config.errorCorrectionLevel}</span>
              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition-colors"
              >
                <span>Use Template</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
