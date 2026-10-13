import React, { useState } from 'react';
import { X, BookmarkPlus } from 'lucide-react';
import { QRType, QRStyleConfig, QRDataPayload, SavedQRCode } from '../types/qr';

interface SaveQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: SavedQRCode) => void;
  type: QRType;
  payload: string;
  data: QRDataPayload;
  config: QRStyleConfig;
  defaultName?: string;
  isDynamic: boolean;
  dynamicSlug?: string;
}

export const SaveQRModal: React.FC<SaveQRModalProps> = ({
  isOpen,
  onClose,
  onSave,
  type,
  payload,
  data,
  config,
  defaultName = 'My Custom QR Code',
  isDynamic,
  dynamicSlug,
}) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: SavedQRCode = {
      id: 'qr-' + Date.now(),
      name: name.trim() || 'Untitled QR Code',
      description: description.trim(),
      type,
      data,
      rawPayload: payload,
      config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDynamic,
      dynamicSlug,
      totalScans: 0,
      tags: tags.length ? tags : ['General'],
    };

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Save to My QR Codes
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Design Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Summer Promo Poster"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes on where this QR code is deployed..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Marketing, Packaging, 2026"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500"
            >
              Save Design
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
