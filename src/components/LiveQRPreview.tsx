import React, { useRef, useEffect, useState } from 'react';
import { QRStyleConfig, QRType, QRDataPayload, SavedQRCode } from '../types/qr';
import {
  renderQRToCanvas,
  generateQRSVG,
  calculateScanReliability,
} from '../utils/qrRenderer';
import { MockupModal } from './MockupModal';
import { PrintModal } from './PrintModal';
import { SaveQRModal } from './SaveQRModal';
import {
  Download,
  Copy,
  Printer,
  Sparkles,
  BookmarkPlus,
  Check,
  AlertTriangle,
  Info,
  Radio,
  FileCode,
} from 'lucide-react';

interface LiveQRPreviewProps {
  type: QRType;
  payload: string;
  data: QRDataPayload;
  config: QRStyleConfig;
  onSaveToLibrary: (item: SavedQRCode) => void;
  onConfigChange: (config: QRStyleConfig) => void;
}

export const LiveQRPreview: React.FC<LiveQRPreviewProps> = ({
  type,
  payload,
  data,
  config,
  onSaveToLibrary,
  onConfigChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg' | 'jpeg'>('png');
  const [resolution, setResolution] = useState<number>(1024);
  const [isDynamic, setIsDynamic] = useState(false);
  const [dynamicSlug, setDynamicSlug] = useState('promo-link');

  // Modals
  const [showMockup, setShowMockup] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [showSave, setShowSave] = useState(false);

  // Active payload calculation: if dynamic, uses dynamic redirect URL
  const activePayload = isDynamic
    ? `${window.location.origin}?r=${encodeURIComponent(dynamicSlug)}`
    : payload;

  // Live render on canvas
  useEffect(() => {
    let isMounted = true;
    if (canvasRef.current) {
      renderQRToCanvas(canvasRef.current, activePayload, config).then(() => {
        if (isMounted && canvasRef.current) {
          setDataUrl(canvasRef.current.toDataURL('image/png'));
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [activePayload, config]);

  const reliability = calculateScanReliability(config, Boolean(config.logoUrl));

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch {
      // Fallback
      setCopied(false);
      alert('Direct image copy requires secure context. You can download the image instead.');
    }
  };

  const handleDownload = async () => {
    if (downloadFormat === 'svg') {
      const svgString = generateQRSVG(activePayload, config);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // High resolution canvas download
    const exportCanvas = document.createElement('canvas');
    await renderQRToCanvas(exportCanvas, activePayload, config, resolution);

    const a = document.createElement('a');
    if (downloadFormat === 'jpeg') {
      // Draw white background if transparent
      const mime = 'image/jpeg';
      a.href = exportCanvas.toDataURL(mime, 0.95);
      a.download = `qr-code-${resolution}px-${Date.now()}.jpg`;
    } else {
      a.href = exportCanvas.toDataURL('image/png');
      a.download = `qr-code-${resolution}px-${Date.now()}.png`;
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-sm sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Live QR Preview
        </h3>
        
        {/* Dynamic code switch */}
        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
          <Radio className={`h-3.5 w-3.5 ${isDynamic ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
          <span>Dynamic QR</span>
          <input
            type="checkbox"
            checked={isDynamic}
            onChange={(e) => setIsDynamic(e.target.checked)}
            className="sr-only"
          />
        </label>
      </div>

      {isDynamic && (
        <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 text-xs dark:border-indigo-900/60 dark:bg-indigo-950/40">
          <p className="font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
            Dynamic QR Code Active
          </p>
          <p className="text-indigo-700 dark:text-indigo-300 mb-2 leading-relaxed">
            Target URL can be changed anytime without reprinting. Scans are tracked in your Analytics dashboard.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-mono text-[11px]">/r/</span>
            <input
              type="text"
              value={dynamicSlug}
              onChange={(e) => setDynamicSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
              placeholder="campaign-name"
              className="w-full rounded-lg border border-indigo-200 bg-white px-2 py-1 font-mono text-xs text-indigo-950 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-200"
            />
          </div>
        </div>
      )}

      {/* QR Code Canvas Card */}
      <div className="relative flex items-center justify-center rounded-2xl bg-slate-50/80 p-6 border border-slate-100 dark:border-slate-800/80 dark:bg-slate-950/60 overflow-hidden min-h-[300px]">
        {config.isTransparentBg && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />
        )}
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.02]"
          style={{ width: '280px', height: '280px' }}
        />
      </div>

      {/* Real-time Scan Reliability Meter */}
      <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {reliability.rating === 'Optimal' ? (
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : reliability.rating === 'High' ? (
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Scan Reliability: {reliability.rating}
            </span>
          </div>

          <span className="font-mono tabular-nums text-slate-500 text-[11px]">
            {reliability.contrastRatio}:1 Contrast
          </span>
        </div>

        {reliability.warnings.length > 0 && (
          <ul className="text-[11px] text-amber-700 dark:text-amber-300/90 space-y-0.5 list-disc pl-4">
            {reliability.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Export Controls */}
      <div className="mt-4 space-y-3">
        {/* Format & Resolution Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              File Format
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {(['png', 'svg', 'jpeg'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDownloadFormat(fmt)}
                  className={`py-1 text-xs uppercase font-semibold rounded-md transition-colors ${
                    downloadFormat === fmt
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">
              Resolution (PNG/JPG)
            </label>
            <select
              value={resolution}
              disabled={downloadFormat === 'svg'}
              onChange={(e) => setResolution(parseInt(e.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-800 dark:text-white"
            >
              <option value="512">512px (Web / Screen)</option>
              <option value="1024">1024px (High-Res 2x)</option>
              <option value="2048">2048px (Ultra Print 4x)</option>
            </select>
          </div>
        </div>

        {/* Primary Download CTA */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>
            Download {downloadFormat.toUpperCase()}{' '}
            {downloadFormat !== 'svg' && `(${resolution}px)`}
          </span>
        </button>

        {/* Quick action buttons row */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleCopyImage}
            title="Copy QR to clipboard"
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 p-2 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrint(true)}
            title="Print sign poster"
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 p-2 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => setShowMockup(true)}
            title="Preview in mockups"
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 p-2 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Sparkles className="h-4 w-4" />
            <span>Mockup</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSave(true)}
            title="Save to My QR Codes"
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 p-2 text-center text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <BookmarkPlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <MockupModal
        isOpen={showMockup}
        onClose={() => setShowMockup(false)}
        qrDataUrl={dataUrl}
      />

      <PrintModal
        isOpen={showPrint}
        onClose={() => setShowPrint(false)}
        qrDataUrl={dataUrl}
      />

      <SaveQRModal
        isOpen={showSave}
        onClose={() => setShowSave(false)}
        onSave={onSaveToLibrary}
        type={type}
        payload={activePayload}
        data={data}
        config={config}
        isDynamic={isDynamic}
        dynamicSlug={dynamicSlug}
      />
    </div>
  );
};
