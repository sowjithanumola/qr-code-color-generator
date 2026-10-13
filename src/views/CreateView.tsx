import React, { useState } from 'react';
import { QRType, QRStyleConfig, QRDataPayload, SavedQRCode } from '../types/qr';
import { generateQRPayload } from '../utils/qrPayload';
import { TypeSelector } from '../components/TypeSelector';
import { TypeForm } from '../components/TypeForm';
import { Customizer } from '../components/Customizer';
import { LiveQRPreview } from '../components/LiveQRPreview';
import { Sparkles, RotateCcw } from 'lucide-react';
import { DEFAULT_STYLE_CONFIG } from '../utils/storage';

interface CreateViewProps {
  currentType: QRType;
  onTypeChange: (type: QRType) => void;
  data: QRDataPayload;
  onDataChange: (data: QRDataPayload) => void;
  config: QRStyleConfig;
  onConfigChange: (config: QRStyleConfig) => void;
  onSaveToLibrary: (item: SavedQRCode) => void;
}

export const CreateView: React.FC<CreateViewProps> = ({
  currentType,
  onTypeChange,
  data,
  onDataChange,
  config,
  onConfigChange,
  onSaveToLibrary,
}) => {
  const [activeSection, setActiveSection] = useState<'content' | 'styling'>('content');

  const payload = generateQRPayload(currentType, data);

  const handleResetStyle = () => {
    onConfigChange(DEFAULT_STYLE_CONFIG);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            QR Generator Studio
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure data payload, apply custom brand styling, and export in vector or raster formats.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetStyle}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Styling</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Inputs & Customizer): 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Format Type */}
          <TypeSelector
            selectedType={currentType}
            onSelectType={(newType) => onTypeChange(newType)}
          />

          {/* Section Toggle: Content vs Styling */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveSection('content')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === 'content'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              1. Content & Data
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('styling')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeSection === 'styling'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              2. Design & Branding
            </button>
          </div>

          {/* Tab 1: Form Inputs */}
          {activeSection === 'content' && (
            <div className="space-y-4">
              <TypeForm
                type={currentType}
                data={data}
                onChange={onDataChange}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveSection('styling')}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
                >
                  Proceed to Design & Styling →
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Customizer */}
          {activeSection === 'styling' && (
            <div className="space-y-4">
              <Customizer
                config={config}
                onChange={onConfigChange}
              />
            </div>
          )}
        </div>

        {/* Right Column (Live Preview & Instant Export): 5 cols */}
        <div className="lg:col-span-5">
          <LiveQRPreview
            type={currentType}
            payload={payload}
            data={data}
            config={config}
            onSaveToLibrary={onSaveToLibrary}
            onConfigChange={onConfigChange}
          />
        </div>
      </div>
    </div>
  );
};
