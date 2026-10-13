import React, { useState } from 'react';
import { QRType, QRDataPayload } from '../types/qr';
import {
  Globe,
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
  Eye,
  EyeOff,
  Navigation,
} from 'lucide-react';

interface TypeFormProps {
  type: QRType;
  data: QRDataPayload;
  onChange: (data: QRDataPayload) => void;
}

export const TypeForm: React.FC<TypeFormProps> = ({ type, data, onChange }) => {
  const [showWifiPass, setShowWifiPass] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const updateField = (key: keyof QRDataPayload, value: any) => {
    onChange({ ...data, [key]: value });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocLoading(false);
        onChange({
          ...data,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        });
      },
      () => {
        setLocLoading(false);
      }
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
      {type === 'url' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Website or Landing Page URL</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Destination URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={data.url || ''}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://yourbrand.com/special-offer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-indigo-400"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Scanners will immediately open this link in the user's mobile browser.
            </p>
          </div>
        </div>
      )}

      {type === 'text' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <span>Plain Text or Note</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Message Content
            </label>
            <textarea
              rows={4}
              value={data.text || ''}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="Enter instructions, notes, passwords, or serial codes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950/50 dark:text-white dark:focus:border-indigo-400"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Plain text works completely offline without internet</span>
              <span className="font-mono tabular-nums">{(data.text || '').length} chars</span>
            </div>
          </div>
        </div>
      )}

      {type === 'wifi' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Wi-Fi Network Configuration</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={data.wifiSsid || ''}
                onChange={(e) => updateField('wifiSsid', e.target.value)}
                placeholder="Apex-Guest-5G"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Security Encryption
              </label>
              <select
                value={data.wifiEncryption || 'WPA'}
                onChange={(e) => updateField('wifiEncryption', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Recommended)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          {data.wifiEncryption !== 'nopass' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Wi-Fi Password
              </label>
              <div className="relative">
                <input
                  type={showWifiPass ? 'text' : 'password'}
                  value={data.wifiPassword || ''}
                  onChange={(e) => updateField('wifiPassword', e.target.value)}
                  placeholder="Network password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-slate-800 dark:bg-slate-950/50 dark:text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPass(!showWifiPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showWifiPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={Boolean(data.wifiHidden)}
              onChange={(e) => updateField('wifiHidden', e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Hidden SSID network (not broadcasting name)</span>
          </label>
        </div>
      )}

      {type === 'vcard' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Contact className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Contact Card (vCard 3.0)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={data.vcardFirstName || ''}
                onChange={(e) => updateField('vcardFirstName', e.target.value)}
                placeholder="Alex"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={data.vcardLastName || ''}
                onChange={(e) => updateField('vcardLastName', e.target.value)}
                placeholder="Morgan"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Organization / Company
              </label>
              <input
                type="text"
                value={data.vcardOrg || ''}
                onChange={(e) => updateField('vcardOrg', e.target.value)}
                placeholder="Acme Corporation"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={data.vcardTitle || ''}
                onChange={(e) => updateField('vcardTitle', e.target.value)}
                placeholder="Managing Director"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={data.vcardPhone || ''}
                onChange={(e) => updateField('vcardPhone', e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={data.vcardEmail || ''}
                onChange={(e) => updateField('vcardEmail', e.target.value)}
                placeholder="alex@acme.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Website
              </label>
              <input
                type="url"
                value={data.vcardUrl || ''}
                onChange={(e) => updateField('vcardUrl', e.target.value)}
                placeholder="https://acme.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {type === 'email' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Email Composition</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={data.emailTo || ''}
              onChange={(e) => updateField('emailTo', e.target.value)}
              placeholder="support@company.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={data.emailSubject || ''}
              onChange={(e) => updateField('emailSubject', e.target.value)}
              placeholder="Inquiry about product quote"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Default Body Message
            </label>
            <textarea
              rows={3}
              value={data.emailBody || ''}
              onChange={(e) => updateField('emailBody', e.target.value)}
              placeholder="Hi team, I would like to learn more about..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
        </div>
      )}

      {type === 'phone' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Direct Phone Call</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Phone Number (with Country Code)
            </label>
            <input
              type="tel"
              value={data.phoneNumber || ''}
              onChange={(e) => updateField('phoneNumber', e.target.value)}
              placeholder="+1 (555) 000-1122"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              When scanned, phones will offer a single-tap button to call this number.
            </p>
          </div>
        </div>
      )}

      {type === 'sms' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <MessageSquare className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>SMS Message</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={data.smsPhone || ''}
              onChange={(e) => updateField('smsPhone', e.target.value)}
              placeholder="+1 (555) 000-1122"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pre-filled SMS Text
            </label>
            <textarea
              rows={3}
              value={data.smsMessage || ''}
              onChange={(e) => updateField('smsMessage', e.target.value)}
              placeholder="YES I want to subscribe to the newsletter."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
        </div>
      )}

      {type === 'whatsapp' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            <span>WhatsApp Direct Chat</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              WhatsApp Phone Number (include country code without + or spaces)
            </label>
            <input
              type="text"
              value={data.whatsappPhone || ''}
              onChange={(e) => updateField('whatsappPhone', e.target.value)}
              placeholder="15551234567"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Pre-filled Message
            </label>
            <textarea
              rows={3}
              value={data.whatsappMessage || ''}
              onChange={(e) => updateField('whatsappMessage', e.target.value)}
              placeholder="Hi! I saw your QR code and would like to order..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
        </div>
      )}

      {type === 'location' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <MapPin className="h-4 w-4 text-rose-500" />
              <span>Location Coordinates</span>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={locLoading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Navigation className="h-3.5 w-3.5 text-indigo-500" />
              <span>{locLoading ? 'Locating...' : 'My Location'}</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={data.latitude || ''}
                onChange={(e) => updateField('latitude', e.target.value)}
                placeholder="37.774929"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={data.longitude || ''}
                onChange={(e) => updateField('longitude', e.target.value)}
                placeholder="-122.419416"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Scanners open Google Maps or Apple Maps with an exact pin at these coordinates.
          </p>
        </div>
      )}

      {type === 'social' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Share2 className="h-4 w-4 text-violet-500" />
            <span>Social Media Profile</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Platform
              </label>
              <select
                value={data.socialPlatform || 'instagram'}
                onChange={(e) => updateField('socialPlatform', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              >
                <option value="instagram">Instagram</option>
                <option value="x">X (formerly Twitter)</option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">YouTube</option>
                <option value="tiktok">TikTok</option>
                <option value="github">GitHub</option>
                <option value="facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Username / Handle
              </label>
              <input
                type="text"
                value={data.socialHandle || ''}
                onChange={(e) => updateField('socialHandle', e.target.value)}
                placeholder="qrstudiopro"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {type === 'upi' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <CreditCard className="h-4 w-4 text-emerald-600" />
            <span>UPI Instant Payment (BHIM, GPay, PhonePe, Paytm)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                UPI ID / VPA
              </label>
              <input
                type="text"
                value={data.upiVpa || ''}
                onChange={(e) => updateField('upiVpa', e.target.value)}
                placeholder="merchant@okaxis"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Payee / Store Name
              </label>
              <input
                type="text"
                value={data.upiName || ''}
                onChange={(e) => updateField('upiName', e.target.value)}
                placeholder="Studio Bakery & Cafe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Fixed Amount (₹ INR, leave empty for custom)
              </label>
              <input
                type="number"
                step="0.01"
                value={data.upiAmount || ''}
                onChange={(e) => updateField('upiAmount', e.target.value)}
                placeholder="250.00"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Payment Note / Order ID
              </label>
              <input
                type="text"
                value={data.upiNote || ''}
                onChange={(e) => updateField('upiNote', e.target.value)}
                placeholder="Order #1024"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}

      {type === 'event' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <Calendar className="h-4 w-4 text-amber-500" />
            <span>Calendar Event (iCalendar format)</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={data.eventTitle || ''}
              onChange={(e) => updateField('eventTitle', e.target.value)}
              placeholder="Annual Design Showcase"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                value={data.eventStart || ''}
                onChange={(e) => updateField('eventStart', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                value={data.eventEnd || ''}
                onChange={(e) => updateField('eventEnd', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Location / Venue
            </label>
            <input
              type="text"
              value={data.eventLocation || ''}
              onChange={(e) => updateField('eventLocation', e.target.value)}
              placeholder="Grand Hall, Level 3, Convention Center"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Event Details / Agenda
            </label>
            <textarea
              rows={2}
              value={data.eventDescription || ''}
              onChange={(e) => updateField('eventDescription', e.target.value)}
              placeholder="Keynote speech begins at 6:30 PM followed by mixer."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
