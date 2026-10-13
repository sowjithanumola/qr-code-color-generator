import React from 'react';
import { QRType } from '../types/qr';
import {
  Globe,
  FileText,
  Wifi,
  Contact,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  MapPin,
  Share2,
  CreditCard,
  Calendar,
} from 'lucide-react';

interface TypeSelectorProps {
  selectedType: QRType;
  onSelectType: (type: QRType) => void;
}

interface TypeItem {
  type: QRType;
  label: string;
  icon: React.ElementType;
}

const TYPES: TypeItem[] = [
  { type: 'url', label: 'Website URL', icon: Globe },
  { type: 'text', label: 'Plain Text', icon: FileText },
  { type: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
  { type: 'vcard', label: 'Contact (vCard)', icon: Contact },
  { type: 'email', label: 'Email Address', icon: Mail },
  { type: 'phone', label: 'Phone Call', icon: Phone },
  { type: 'sms', label: 'SMS Message', icon: MessageSquare },
  { type: 'whatsapp', label: 'WhatsApp Chat', icon: MessageCircle },
  { type: 'location', label: 'Location Map', icon: MapPin },
  { type: 'social', label: 'Social Profile', icon: Share2 },
  { type: 'upi', label: 'UPI / Payment', icon: CreditCard },
  { type: 'event', label: 'Calendar Event', icon: Calendar },
];

export const TypeSelector: React.FC<TypeSelectorProps> = ({ selectedType, onSelectType }) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select QR Code Type
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          12 supported formats
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {TYPES.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedType === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onSelectType(item.type)}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-center transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-300'
                  : 'border-slate-200/80 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap truncate w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
