import React, { useState } from 'react';
import { X, Printer } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrDataUrl: string;
  defaultTitle?: string;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  qrDataUrl,
  defaultTitle = 'Scan Me With Your Phone',
}) => {
  const [headline, setHeadline] = useState(defaultTitle);
  const [subtext, setSubtext] = useState('Open your camera app and point at this code.');
  const [pageSize, setPageSize] = useState<'a4' | 'card' | 'tent'>('a4');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Print QR Code Poster
            </h3>
            <p className="text-xs text-slate-500">
              Customize headline and print ready-to-hang signs directly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customization controls */}
        <div className="border-b border-slate-200 bg-slate-50 p-4 space-y-3 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Headline Text
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Instruction Subtext
              </label>
              <input
                type="text"
                value={subtext}
                onChange={(e) => setSubtext(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Printable Preview Sheet */}
        <div className="p-6 bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-auto min-h-[300px]">
          <div
            id="printable-qr-sign"
            className="w-[280px] sm:w-[320px] rounded-2xl bg-white text-slate-900 p-8 shadow-md border border-slate-200 text-center space-y-4"
          >
            <h2 className="text-lg font-bold tracking-tight text-slate-900 leading-snug">
              {headline}
            </h2>
            <div className="p-2 border border-slate-100 rounded-xl inline-block bg-white shadow-xs">
              <img src={qrDataUrl} alt="Printable QR Code" className="w-48 h-48 mx-auto object-contain" />
            </div>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              {subtext}
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Powered by QR Studio Pro
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-white flex items-center justify-between dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">
            Tip: Select "Save as PDF" or your printer in the system dialog.
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
            >
              <Printer className="h-4 w-4" />
              <span>Print Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
