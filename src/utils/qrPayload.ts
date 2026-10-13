import { QRType, QRDataPayload } from '../types/qr';

export function generateQRPayload(type: QRType, data: QRDataPayload): string {
  switch (type) {
    case 'url': {
      let raw = data.url?.trim() || 'https://qrstudiopro.app';
      if (!/^https?:\/\//i.test(raw)) {
        raw = 'https://' + raw;
      }
      return raw;
    }

    case 'text': {
      return data.text || 'Welcome to QR Studio Pro';
    }

    case 'phone': {
      const cleanPhone = (data.phoneNumber || '').replace(/[^\d+]/g, '');
      return `tel:${cleanPhone || '+1234567890'}`;
    }

    case 'sms': {
      const cleanPhone = (data.smsPhone || '').replace(/[^\d+]/g, '');
      const message = encodeURIComponent(data.smsMessage || '');
      return `SMSTO:${cleanPhone || '+1234567890'}:${data.smsMessage || ''}`;
    }

    case 'email': {
      const to = data.emailTo?.trim() || 'hello@example.com';
      const params = new URLSearchParams();
      if (data.emailSubject) params.set('subject', data.emailSubject);
      if (data.emailBody) params.set('body', data.emailBody);
      const query = params.toString();
      return `mailto:${to}${query ? `?${query}` : ''}`;
    }

    case 'wifi': {
      const ssid = (data.wifiSsid || 'Guest-WiFi').replace(/[\\;,":]/g, '\\$&');
      const pass = (data.wifiPassword || '').replace(/[\\;,":]/g, '\\$&');
      const auth = data.wifiEncryption || 'WPA';
      const hidden = data.wifiHidden ? 'true' : 'false';
      return `WIFI:S:${ssid};T:${auth};P:${pass};H:${hidden};;`;
    }

    case 'whatsapp': {
      const cleanNum = (data.whatsappPhone || '').replace(/[^\d]/g, '');
      const text = encodeURIComponent(data.whatsappMessage || '');
      return `https://wa.me/${cleanNum || '1234567890'}${text ? `?text=${text}` : ''}`;
    }

    case 'vcard': {
      const fn = `${data.vcardFirstName || ''} ${data.vcardLastName || ''}`.trim() || 'Alex Morgan';
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.vcardLastName || 'Morgan'};${data.vcardFirstName || 'Alex'};;;`,
        `FN:${fn}`,
      ];

      if (data.vcardOrg) lines.push(`ORG:${data.vcardOrg}`);
      if (data.vcardTitle) lines.push(`TITLE:${data.vcardTitle}`);
      if (data.vcardPhone) lines.push(`TEL;TYPE=CELL,VOICE:${data.vcardPhone}`);
      if (data.vcardEmail) lines.push(`EMAIL;TYPE=INTERNET:${data.vcardEmail}`);
      if (data.vcardUrl) lines.push(`URL:${data.vcardUrl}`);

      if (data.vcardStreet || data.vcardCity || data.vcardPostalCode || data.vcardCountry) {
        lines.push(
          `ADR;TYPE=WORK:;;${data.vcardStreet || ''};${data.vcardCity || ''};;${data.vcardPostalCode || ''};${data.vcardCountry || ''}`
        );
      }

      lines.push('END:VCARD');
      return lines.join('\n');
    }

    case 'location': {
      const lat = data.latitude?.trim() || '37.7749';
      const lng = data.longitude?.trim() || '-122.4194';
      return `https://maps.google.com/?q=${lat},${lng}`;
    }

    case 'social': {
      const handle = (data.socialHandle || 'qrstudiopro').replace(/^@/, '');
      switch (data.socialPlatform) {
        case 'instagram':
          return `https://instagram.com/${handle}`;
        case 'x':
          return `https://x.com/${handle}`;
        case 'linkedin':
          return `https://linkedin.com/in/${handle}`;
        case 'youtube':
          return `https://youtube.com/@${handle}`;
        case 'tiktok':
          return `https://tiktok.com/@${handle}`;
        case 'github':
          return `https://github.com/${handle}`;
        case 'facebook':
          return `https://facebook.com/${handle}`;
        default:
          return `https://instagram.com/${handle}`;
      }
    }

    case 'upi': {
      const vpa = data.upiVpa?.trim() || 'merchant@upi';
      const name = encodeURIComponent(data.upiName?.trim() || 'Store Name');
      const note = encodeURIComponent(data.upiNote?.trim() || 'Payment');
      let upiStr = `upi://pay?pa=${vpa}&pn=${name}&tn=${note}&cu=INR`;
      if (data.upiAmount && parseFloat(data.upiAmount) > 0) {
        upiStr += `&am=${parseFloat(data.upiAmount).toFixed(2)}`;
      }
      return upiStr;
    }

    case 'event': {
      const title = data.eventTitle || 'Product Launch & Meetup';
      const loc = data.eventLocation || 'Innovation Hub';
      const desc = data.eventDescription || 'Join us for the keynote session.';
      
      const formatDT = (dtStr?: string) => {
        if (!dtStr) return '20261015T180000Z';
        const d = new Date(dtStr);
        return isNaN(d.getTime()) ? '20261015T180000Z' : d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const start = formatDT(data.eventStart);
      const end = formatDT(data.eventEnd);

      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//QR Studio Pro//EN',
        'BEGIN:VEVENT',
        `SUMMARY:${title}`,
        `LOCATION:${loc}`,
        `DESCRIPTION:${desc}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\n');
    }

    default:
      return 'https://qrstudiopro.app';
  }
}

export function parseScannedContent(payload: string): {
  type: string;
  summary: string;
  actionUrl?: string;
  actionLabel?: string;
  details: Record<string, string>;
} {
  const p = payload.trim();

  if (/^https?:\/\//i.test(p)) {
    return {
      type: 'Website URL',
      summary: p,
      actionUrl: p,
      actionLabel: 'Open in Browser',
      details: { URL: p },
    };
  }

  if (/^WIFI:/i.test(p)) {
    const ssidMatch = p.match(/S:([^;]+)/i);
    const passMatch = p.match(/P:([^;]+)/i);
    const typeMatch = p.match(/T:([^;]+)/i);
    return {
      type: 'Wi-Fi Network',
      summary: `Network: ${ssidMatch ? ssidMatch[1] : 'Unknown'}`,
      actionLabel: 'Copy Password',
      details: {
        Network: ssidMatch ? ssidMatch[1] : 'Unknown',
        Password: passMatch ? passMatch[1] : 'None / Open',
        Security: typeMatch ? typeMatch[1] : 'WPA',
      },
    };
  }

  if (/^BEGIN:VCARD/i.test(p)) {
    const fnMatch = p.match(/FN:([^\r\n]+)/i);
    const telMatch = p.match(/TEL[^:]*:([^\r\n]+)/i);
    const emailMatch = p.match(/EMAIL[^:]*:([^\r\n]+)/i);
    const orgMatch = p.match(/ORG:([^\r\n]+)/i);
    return {
      type: 'Contact Card (vCard)',
      summary: fnMatch ? fnMatch[1] : 'Contact Card',
      actionUrl: telMatch ? `tel:${telMatch[1].replace(/[^\d+]/g, '')}` : undefined,
      actionLabel: 'Call Contact',
      details: {
        Name: fnMatch ? fnMatch[1] : 'N/A',
        Phone: telMatch ? telMatch[1] : 'N/A',
        Email: emailMatch ? emailMatch[1] : 'N/A',
        Company: orgMatch ? orgMatch[1] : 'N/A',
      },
    };
  }

  if (/^mailto:/i.test(p)) {
    const email = p.replace(/^mailto:/i, '').split('?')[0];
    return {
      type: 'Email Address',
      summary: email,
      actionUrl: p,
      actionLabel: 'Send Email',
      details: { Recipient: email },
    };
  }

  if (/^tel:/i.test(p)) {
    const phone = p.replace(/^tel:/i, '');
    return {
      type: 'Phone Number',
      summary: phone,
      actionUrl: p,
      actionLabel: 'Call Phone',
      details: { Number: phone },
    };
  }

  if (/^upi:\/\//i.test(p)) {
    const url = new URL(p);
    const pa = url.searchParams.get('pa') || 'N/A';
    const am = url.searchParams.get('am');
    return {
      type: 'UPI Payment',
      summary: `Pay ${pa}${am ? ` ₹${am}` : ''}`,
      actionUrl: p,
      actionLabel: 'Open UPI App',
      details: {
        VPA: pa,
        Amount: am ? `₹${am}` : 'Any',
      },
    };
  }

  return {
    type: 'Plain Text',
    summary: p.length > 80 ? p.substring(0, 80) + '...' : p,
    actionLabel: 'Copy Text',
    details: { Content: p },
  };
}
