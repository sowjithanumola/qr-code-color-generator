import { SavedQRCode, ScanLog, QRStyleConfig, QRDataPayload } from '../types/qr';
import { THEME_PRESETS, INITIAL_TEMPLATES } from './presets';

const STORAGE_KEYS = {
  SAVED_CODES: 'qr_studio_saved_codes_v1',
  SCAN_LOGS: 'qr_studio_scan_logs_v1',
  HISTORY: 'qr_studio_history_v1',
  SETTINGS: 'qr_studio_settings_v1',
  FIRST_RUN: 'qr_studio_has_run_v1',
};

export interface AppSettings {
  theme: 'dark' | 'light';
  defaultExportFormat: 'png' | 'svg' | 'jpeg';
  defaultErrorCorrection: 'L' | 'M' | 'Q' | 'H';
  defaultResolution: number; // 512, 1024, 2048
  showTips: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  defaultExportFormat: 'png',
  defaultErrorCorrection: 'M',
  defaultResolution: 1024,
  showTips: true,
};

export const DEFAULT_STYLE_CONFIG: QRStyleConfig = {
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  isTransparentBg: false,
  isGradient: true,
  gradientColor2: '#2563eb',
  gradientType: 'linear',
  gradientAngle: 135,
  dotStyle: 'rounded',
  cornerStyle: 'rounded',
  customEyeColor: true,
  outerEyeColor: '#1e40af',
  innerEyeColor: '#2563eb',
  margin: 2,
  size: 380,
  errorCorrectionLevel: 'Q',
  logoSize: 22,
  logoMargin: 4,
  logoShape: 'circle',
};

// Seed initial demo data for saved codes
function getInitialSavedCodes(): SavedQRCode[] {
  return [
    {
      id: 'qr-sample-1',
      name: 'Boutique Café Digital Menu',
      description: 'Contactless QR menu placed on indoor & terrace dining tables.',
      type: 'url',
      data: { url: 'https://qrstudiopro.app/menu/artisan-cafe' },
      rawPayload: 'https://qrstudiopro.app/menu/artisan-cafe',
      config: {
        ...DEFAULT_STYLE_CONFIG,
        fgColor: '#78350f',
        bgColor: '#fef3c7',
        gradientColor2: '#b45309',
        cornerStyle: 'rounded',
        dotStyle: 'rounded',
        outerEyeColor: '#78350f',
        innerEyeColor: '#d97706',
      },
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      isDynamic: true,
      dynamicSlug: 'cafe-menu',
      totalScans: 342,
      tags: ['Restaurant', 'Dynamic', 'Menu'],
    },
    {
      id: 'qr-sample-2',
      name: 'Guest Lounge Wi-Fi',
      description: 'Lobby instant Wi-Fi connection card with high error correction.',
      type: 'wifi',
      data: { wifiSsid: 'Apex-Guest-5G', wifiPassword: 'SafeGuestPass2026', wifiEncryption: 'WPA' },
      rawPayload: 'WIFI:S:Apex-Guest-5G;T:WPA;P:SafeGuestPass2026;H:false;;',
      config: {
        ...DEFAULT_STYLE_CONFIG,
        fgColor: '#0f172a',
        bgColor: '#ffffff',
        gradientColor2: '#2563eb',
        dotStyle: 'dots',
        cornerStyle: 'circle',
      },
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      isDynamic: false,
      totalScans: 189,
      tags: ['Office', 'Wi-Fi'],
    },
    {
      id: 'qr-sample-3',
      name: 'CTO Executive Contact vCard',
      description: 'Printed on metal business card with direct phone, email, and LinkedIn.',
      type: 'vcard',
      data: {
        vcardFirstName: 'Sophia',
        vcardLastName: 'Vance',
        vcardOrg: 'Apex Systems',
        vcardTitle: 'VP of Product',
        vcardPhone: '+1 (555) 019-2834',
        vcardEmail: 'sophia@apexsys.io',
      },
      rawPayload: 'BEGIN:VCARD\nVERSION:3.0\nN:Vance;Sophia;;;\nFN:Sophia Vance\nORG:Apex Systems\nTITLE:VP of Product\nTEL;TYPE=CELL,VOICE:+1 (555) 019-2834\nEMAIL;TYPE=INTERNET:sophia@apexsys.io\nEND:VCARD',
      config: {
        ...DEFAULT_STYLE_CONFIG,
        isGradient: false,
        fgColor: '#090d16',
        bgColor: '#ffffff',
        dotStyle: 'square',
        cornerStyle: 'square',
        customEyeColor: false,
      },
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      isDynamic: false,
      totalScans: 64,
      tags: ['Personal', 'Business Card'],
    },
  ];
}

// Generate sample scan logs for dynamic analytics
function getSampleScanLogs(): ScanLog[] {
  const logs: ScanLog[] = [];
  const devices: ('iOS' | 'Android' | 'Desktop' | 'Tablet')[] = ['iOS', 'iOS', 'Android', 'Android', 'Android', 'Desktop', 'Tablet'];
  const browsers = ['Mobile Safari', 'Chrome Mobile', 'Samsung Internet', 'Firefox', 'Safari'];
  const locations = [
    { country: 'United States', city: 'San Francisco' },
    { country: 'United States', city: 'New York' },
    { country: 'United Kingdom', city: 'London' },
    { country: 'Germany', city: 'Berlin' },
    { country: 'Japan', city: 'Tokyo' },
    { country: 'Canada', city: 'Toronto' },
    { country: 'Australia', city: 'Sydney' },
    { country: 'India', city: 'Bengaluru' },
  ];

  // Distribute over past 14 days
  for (let i = 0; i < 150; i++) {
    const daysAgo = Math.floor(Math.random() * 14);
    const hour = Math.floor(Math.random() * 24);
    const min = Math.floor(Math.random() * 60);
    const date = new Date(Date.now() - daysAgo * 86400000 - hour * 3600000 - min * 60000);
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];

    logs.push({
      id: `log-${i + 1}`,
      qrId: i % 3 === 0 ? 'qr-sample-1' : 'qr-sample-2',
      timestamp: date.toISOString(),
      device,
      browser,
      country: loc.country,
      city: loc.city,
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function loadSavedQRCodes(): SavedQRCode[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_CODES);
    if (!raw) {
      const initial = getInitialSavedCodes();
      localStorage.setItem(STORAGE_KEYS.SAVED_CODES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialSavedCodes();
  }
}

export function saveQRCode(item: SavedQRCode): void {
  const all = loadSavedQRCodes();
  const existingIndex = all.findIndex((q) => q.id === item.id);
  if (existingIndex >= 0) {
    all[existingIndex] = { ...item, updatedAt: new Date().toISOString() };
  } else {
    all.unshift(item);
  }
  localStorage.setItem(STORAGE_KEYS.SAVED_CODES, JSON.stringify(all));
}

export function deleteSavedQRCode(id: string): void {
  const all = loadSavedQRCodes().filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.SAVED_CODES, JSON.stringify(all));
}

export function loadScanLogs(): ScanLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCAN_LOGS);
    if (!raw) {
      const initial = getSampleScanLogs();
      localStorage.setItem(STORAGE_KEYS.SCAN_LOGS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getSampleScanLogs();
  }
}

export function recordLiveScan(qrId: string): ScanLog {
  const logs = loadScanLogs();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  const newLog: ScanLog = {
    id: 'scan-' + Date.now(),
    qrId,
    timestamp: new Date().toISOString(),
    device: isIOS ? 'iOS' : isAndroid ? 'Android' : isMobile ? 'Tablet' : 'Desktop',
    browser: /Chrome/i.test(navigator.userAgent)
      ? 'Chrome'
      : /Safari/i.test(navigator.userAgent)
      ? 'Safari'
      : /Firefox/i.test(navigator.userAgent)
      ? 'Firefox'
      : 'Web Browser',
    country: 'United States',
    city: 'Local Client',
  };

  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.SCAN_LOGS, JSON.stringify(logs));

  // Update totalScans in saved codes
  const codes = loadSavedQRCodes();
  const code = codes.find((c) => c.id === qrId);
  if (code) {
    code.totalScans = (code.totalScans || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.SAVED_CODES, JSON.stringify(codes));
  }

  return newLog;
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadGenerationHistory(): { id: string; payload: string; type: string; timestamp: string }[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushHistoryItem(item: { payload: string; type: string }): void {
  try {
    const history = loadGenerationHistory();
    history.unshift({
      id: 'hist-' + Date.now(),
      payload: item.payload,
      type: item.type,
      timestamp: new Date().toISOString(),
    });
    // keep latest 25 items
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 25)));
  } catch {
    // Ignore storage issues
  }
}
