import React, { useState } from 'react';
import { SavedQRCode, QRType } from '../types/qr';
import {
  Search,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Filter,
  Check,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface MyQRCodesViewProps {
  savedCodes: SavedQRCode[];
  onOpenInStudio: (item: SavedQRCode) => void;
  onDuplicate: (item: SavedQRCode) => void;
  onDelete: (id: string) => void;
  onNavigateToCreate: () => void;
}

export const MyQRCodesView: React.FC<MyQRCodesViewProps> = ({
  savedCodes,
  onOpenInStudio,
  onDuplicate,
  onDelete,
  onNavigateToCreate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = savedCodes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCopyPayload = (item: SavedQRCode) => {
    navigator.clipboard.writeText(item.rawPayload);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My QR Codes Library
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, duplicate, edit, and export your saved QR designs and campaigns.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCreate}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New QR Code</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, description, or tag..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">All Formats</option>
            <option value="url">Website URL</option>
            <option value="wifi">Wi-Fi</option>
            <option value="vcard">Contact vCard</option>
            <option value="upi">UPI / Payment</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="social">Social Media</option>
          </select>
        </div>
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-white dark:border-slate-800 dark:bg-slate-900">
          <QrCode className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No QR Codes Found
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {search || selectedType !== 'all'
              ? 'Try modifying your search term or format filter.'
              : 'You have not saved any QR designs to your library yet.'}
          </p>
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Create Your First QR Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                {/* Header row with type & dynamic badge */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="uppercase font-semibold tracking-wider">{item.type}</span>
                  {item.isDynamic && (
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                      Dynamic
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Content snippet */}
                <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                  {item.rawPayload}
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                    {item.tags.map((tag, idx) => (
                      <React.Fragment key={tag}>
                        <span>{tag}</span>
                        {idx < item.tags!.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 tabular-nums">
                  {item.totalScans || 0} scans
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopyPayload(item)}
                    title="Copy Payload"
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicate(item)}
                    title="Duplicate Design"
                    className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    title="Delete Design"
                    className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenInStudio(item)}
                    className="ml-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                  >
                    Edit in Studio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
