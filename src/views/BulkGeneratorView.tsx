import React, { useState } from 'react';
import { BulkQRItem, QRType, QRStyleConfig } from '../types/qr';
import { renderQRToCanvas } from '../utils/qrRenderer';
import { DEFAULT_STYLE_CONFIG } from '../utils/storage';
import JSZip from 'jszip';
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Play,
  FileDown,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';

export const BulkGeneratorView: React.FC = () => {
  const [items, setItems] = useState<BulkQRItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [previewItem, setPreviewItem] = useState<BulkQRItem | null>(null);

  // Download Sample CSV
  const handleDownloadSampleCSV = () => {
    const csvContent =
      'Name,Type,Content\n' +
      'VIP Table 1,url,https://qrstudiopro.app/table/1\n' +
      'Guest Lounge WiFi,wifi,WIFI:S:GuestLounge;T:WPA;P:Secret2026;;\n' +
      'CEO vCard,text,Alex Morgan - CEO Acme Systems - alex@acme.com\n' +
      'Support Hotline,phone,+15550192834\n' +
      'Order 101 Payment,upi,upi://pay?pa=store@okaxis&pn=Store&am=250.00\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr_bulk_sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const parseCSVLines = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return;

    // Detect header
    let startIndex = 0;
    if (lines[0].toLowerCase().includes('name') && lines[0].toLowerCase().includes('content')) {
      startIndex = 1;
    }

    const parsed: BulkQRItem[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Basic CSV split respecting quotes
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((p) => p.replace(/^"|"$/g, '').trim());

      const name = parts[0] || `Item #${i + 1}`;
      const type = (parts[1]?.toLowerCase() as QRType) || 'url';
      const content = parts[2] || parts[1] || parts[0];

      if (content) {
        parsed.push({
          id: 'bulk-' + (i + 1),
          index: i + 1,
          name,
          type,
          content,
          payload: content,
          status: 'pending',
        });
      }
    }

    setItems(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSVLines(text);
    };
    reader.readAsText(file);
  };

  const handleParsePasted = () => {
    if (!pastedText.trim()) return;
    parseCSVLines(pastedText);
  };

  // Generate all items in batch onto off-screen canvases
  const handleGenerateAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setProgress(0);

    const updated = [...items];
    const offscreen = document.createElement('canvas');

    for (let i = 0; i < updated.length; i++) {
      const item = updated[i];
      try {
        await renderQRToCanvas(offscreen, item.payload, DEFAULT_STYLE_CONFIG, 512);
        item.dataUrl = offscreen.toDataURL('image/png');
        item.status = 'generated';
      } catch (err: any) {
        item.status = 'error';
        item.error = err?.message || 'Failed to render';
      }
      setProgress(Math.round(((i + 1) / updated.length) * 100));
    }

    setItems(updated);
    setIsProcessing(false);
  };

  // Package all generated QR codes into a ZIP file
  const handleDownloadZip = async () => {
    const generatedItems = items.filter((i) => i.status === 'generated' && i.dataUrl);
    if (generatedItems.length === 0) {
      alert('Please click "Generate All Batch" first before downloading.');
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder('qr_codes_batch');

    for (const item of generatedItems) {
      const base64Data = item.dataUrl!.replace(/^data:image\/png;base64,/, '');
      const safeName = item.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      folder?.file(`${item.index}_${safeName}.png`, base64Data, { base64: true });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_Studio_Batch_${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bulk QR Code Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Import hundreds of links or codes from CSV and generate a batch zip in seconds.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadSampleCSV}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 shrink-0"
        >
          <FileDown className="h-4 w-4" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Input Options Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Upload CSV File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Paste Raw Text
          </button>
        </div>

        {activeTab === 'upload' && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/30">
            <FileSpreadsheet className="h-10 w-10 text-indigo-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your CSV file here
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              Columns expected: <span className="font-mono">Name, Type, Content</span>
            </p>
            <label className="cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 inline-flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Browse CSV File</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {activeTab === 'paste' && (
          <div className="space-y-3">
            <textarea
              rows={5}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Name,Type,Content&#10;Product 01,url,https://example.com/p1&#10;Product 02,url,https://example.com/p2"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-mono text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
            <button
              type="button"
              onClick={handleParsePasted}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Parse Pasted CSV
            </button>
          </div>
        )}
      </div>

      {/* Batch Processing Table */}
      {items.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs overflow-hidden space-y-4 p-5">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {items.length} items loaded
              </span>
              {isProcessing && (
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">
                  Processing: {progress}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateAll}
                disabled={isProcessing}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>Generate All Batch</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isProcessing || !items.some((i) => i.status === 'generated')}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
              >
                <Download className="h-4 w-4" />
                <span>Download All as ZIP</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-semibold w-12 text-center">#</th>
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Type</th>
                  <th className="py-2.5 px-3 font-semibold">Payload Content</th>
                  <th className="py-2.5 px-3 font-semibold w-24">Status</th>
                  <th className="py-2.5 px-3 font-semibold w-20 text-center">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-center text-slate-400 tabular-nums">
                      {item.index}
                    </td>
                    <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                      {item.name}
                    </td>
                    <td className="py-2 px-3 uppercase text-[11px] text-slate-500">
                      {item.type}
                    </td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400 truncate max-w-[280px]">
                      {item.payload}
                    </td>
                    <td className="py-2 px-3 font-sans text-xs">
                      {item.status === 'generated' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                        </span>
                      ) : item.status === 'error' ? (
                        <span className="text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Error
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {item.dataUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewItem(item)}
                          className="p-1 rounded-md text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Item Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-slate-900 shadow-2xl text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {previewItem.name}
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl inline-block">
              <img
                src={previewItem.dataUrl}
                alt={previewItem.name}
                className="w-48 h-48 mx-auto object-contain"
              />
            </div>
            <p className="text-xs font-mono text-slate-500 break-all">{previewItem.payload}</p>
            <button
              onClick={() => setPreviewItem(null)}
              className="w-full rounded-xl bg-slate-900 py-2 text-xs font-medium text-white dark:bg-white dark:text-slate-900"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
