import React, { useState } from 'react';
import { X, Smartphone, CreditCard, Coffee, Newspaper } from 'lucide-react';

interface MockupModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrDataUrl: string;
  title?: string;
}

export const MockupModal: React.FC<MockupModalProps> = ({
  isOpen,
  onClose,
  qrDataUrl,
  title = 'QR Studio Pro Mockup',
}) => {
  const [activeContext, setActiveContext] = useState<'card' | 'table' | 'phone' | 'poster'>('card');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Real-World Context Mockup
            </h3>
            <p className="text-xs text-slate-500">
              Preview how your QR code looks on physical media before printing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mockup tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2 gap-2 dark:border-slate-800 dark:bg-slate-950/50">
          <button
            onClick={() => setActiveContext('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeContext === 'card'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Business Card</span>
          </button>

          <button
            onClick={() => setActiveContext('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeContext === 'table'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Coffee className="h-3.5 w-3.5" />
            <span>Table Tent / Cafe</span>
          </button>

          <button
            onClick={() => setActiveContext('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeContext === 'phone'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile Device</span>
          </button>

          <button
            onClick={() => setActiveContext('poster')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeContext === 'poster'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Newspaper className="h-3.5 w-3.5" />
            <span>Storefront Sign</span>
          </button>
        </div>

        {/* Mockup Canvas Container */}
        <div className="p-8 flex items-center justify-center bg-slate-100 dark:bg-slate-950 min-h-[380px] overflow-auto">
          {activeContext === 'card' && (
            <div className="w-[380px] h-[220px] rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 shadow-2xl flex items-center justify-between border border-slate-800 relative">
              <div className="space-y-3 z-10">
                <div>
                  <h4 className="text-base font-bold tracking-tight">Alex Vance</h4>
                  <p className="text-xs text-indigo-400 font-medium">Product Director</p>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p>alex@qrstudio.pro</p>
                  <p>+1 (555) 019-2834</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>
              <div className="p-2 bg-white rounded-lg shadow-md shrink-0">
                <img src={qrDataUrl} alt="QR Mockup" className="w-24 h-24 object-contain" />
              </div>
            </div>
          )}

          {activeContext === 'table' && (
            <div className="w-[280px] rounded-2xl bg-amber-50/90 text-slate-900 p-6 shadow-xl border border-amber-200 text-center space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Scan to View Menu
              </div>
              <div className="p-3 bg-white rounded-xl shadow-xs inline-block border border-amber-100">
                <img src={qrDataUrl} alt="QR Table Tent" className="w-36 h-36 object-contain" />
              </div>
              <p className="text-xs text-slate-600">
                Point your phone camera here to place your order contactless.
              </p>
            </div>
          )}

          {activeContext === 'phone' && (
            <div className="w-[240px] h-[400px] rounded-[36px] bg-slate-950 border-4 border-slate-800 shadow-2xl p-4 flex flex-col items-center justify-between text-white relative">
              <div className="w-20 h-4 bg-slate-800 rounded-full mb-4"></div>
              <div className="text-center space-y-1 mb-2">
                <p className="text-xs font-semibold">Scan & Connect</p>
                <p className="text-[10px] text-slate-400">Instant Access</p>
              </div>
              <div className="p-3 bg-white rounded-2xl shadow-lg">
                <img src={qrDataUrl} alt="QR Screen" className="w-32 h-32 object-contain" />
              </div>
              <div className="text-center text-[10px] text-slate-400 mb-2">
                Tap to view details
              </div>
              <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
            </div>
          )}

          {activeContext === 'poster' && (
            <div className="w-[320px] rounded-2xl bg-white text-slate-950 p-6 shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-wide text-indigo-600">
                  Special Announcement
                </h4>
                <p className="text-xs text-slate-500">Scan code to register or enter</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl inline-block border border-slate-100">
                <img src={qrDataUrl} alt="QR Poster" className="w-40 h-40 object-contain" />
              </div>
              <p className="text-[11px] text-slate-400">
                Compatible with all iOS and Android camera apps.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex items-center justify-end dark:border-slate-800 dark:bg-slate-950">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
