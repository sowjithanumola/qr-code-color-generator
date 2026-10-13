import React from 'react';
import { X, QrCode, Sliders, ScanLine, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Welcome to QR Studio Pro</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create. Customize. Scan.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Your all-in-one studio for high-reliability QR code generation, vector packaging exports, live camera scanning, and dynamic scan analytics.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">12 QR Formats</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Support for URLs, offline Wi-Fi, full vCards, UPI payments, WhatsApp, events, and plain text.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sliders className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Brand Customization & Safe Eyes</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add logos, gradients, dot patterns, and corner styles while our real-time meter protects camera readability.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ScanLine className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Built-in Scanner & Bulk Generator</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan with your phone camera or upload images. Process hundreds of QR codes from CSV in bulk.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Start Creating QR Codes
        </button>
      </div>
    </div>
  );
};
