export type QRType =
  | 'url'
  | 'text'
  | 'wifi'
  | 'vcard'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'location'
  | 'social'
  | 'upi'
  | 'event';

export type DotStyle = 'square' | 'rounded' | 'dots' | 'class' | 'diamond';
export type CornerStyle = 'square' | 'rounded' | 'circle' | 'leaf' | 'extra-rounded';
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QRStyleConfig {
  fgColor: string;
  bgColor: string;
  isTransparentBg: boolean;
  isGradient: boolean;
  gradientColor2: string;
  gradientType: 'linear' | 'radial';
  gradientAngle: number; // 0 to 360
  dotStyle: DotStyle;
  cornerStyle: CornerStyle;
  customEyeColor: boolean;
  outerEyeColor: string;
  innerEyeColor: string;
  margin: number; // quiet zone (0-6)
  size: number; // pixel preview dimension
  errorCorrectionLevel: ErrorCorrectionLevel;
  logoUrl?: string;
  logoSize: number; // 10 to 35% of QR width
  logoMargin: number; // padding around logo
  logoShape: 'square' | 'circle' | 'rounded';
}

export interface QRDataPayload {
  // URL
  url?: string;
  // Text
  text?: string;
  // Wi-Fi
  wifiSsid?: string;
  wifiPassword?: string;
  wifiEncryption?: 'WPA' | 'WEP' | 'nopass';
  wifiHidden?: boolean;
  // vCard
  vcardFirstName?: string;
  vcardLastName?: string;
  vcardOrg?: string;
  vcardTitle?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  vcardUrl?: string;
  vcardStreet?: string;
  vcardCity?: string;
  vcardPostalCode?: string;
  vcardCountry?: string;
  // Email
  emailTo?: string;
  emailSubject?: string;
  emailBody?: string;
  // Phone
  phoneNumber?: string;
  // SMS
  smsPhone?: string;
  smsMessage?: string;
  // WhatsApp
  whatsappPhone?: string;
  whatsappMessage?: string;
  // Location
  latitude?: string;
  longitude?: string;
  locationLabel?: string;
  // Social
  socialPlatform?: 'instagram' | 'x' | 'linkedin' | 'youtube' | 'tiktok' | 'github' | 'facebook';
  socialHandle?: string;
  // UPI
  upiVpa?: string;
  upiName?: string;
  upiAmount?: string;
  upiNote?: string;
  // Event
  eventTitle?: string;
  eventLocation?: string;
  eventStart?: string;
  eventEnd?: string;
  eventDescription?: string;
}

export interface SavedQRCode {
  id: string;
  name: string;
  description?: string;
  type: QRType;
  data: QRDataPayload;
  rawPayload: string;
  config: QRStyleConfig;
  createdAt: string;
  updatedAt: string;
  isDynamic: boolean;
  dynamicSlug?: string;
  totalScans: number;
  tags?: string[];
}

export interface ScanLog {
  id: string;
  qrId: string;
  timestamp: string;
  device: 'iOS' | 'Android' | 'Desktop' | 'Tablet';
  browser: string;
  country: string;
  city: string;
}

export interface BulkQRItem {
  id: string;
  index: number;
  name: string;
  type: QRType;
  content: string;
  payload: string;
  dataUrl?: string;
  status: 'pending' | 'generated' | 'error';
  error?: string;
}

export interface QRTemplate {
  id: string;
  name: string;
  category: 'business' | 'hospitality' | 'events' | 'social' | 'payment';
  description: string;
  type: QRType;
  defaultData: QRDataPayload;
  config: QRStyleConfig;
}
