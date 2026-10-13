import QRCode from 'qrcode';
import { QRStyleConfig, DotStyle, CornerStyle } from '../types/qr';

interface ReliabilityReport {
  score: number; // 0 to 100
  rating: 'Optimal' | 'High' | 'Moderate' | 'Caution';
  contrastRatio: number;
  warnings: string[];
}

// Helpers for color contrast
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return { r: 0, g: 0, b: 0 };
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateScanReliability(config: QRStyleConfig, hasLogo: boolean): ReliabilityReport {
  const warnings: string[] = [];
  let score = 95;

  const fgRgb = hexToRgb(config.fgColor);
  const bgRgb = hexToRgb(config.bgColor);

  const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const contrast = (lighter + 0.05) / (darker + 0.05);

  if (contrast < 3) {
    score -= 40;
    warnings.push('Low color contrast between foreground and background. Scanners may struggle in dim lighting.');
  } else if (contrast < 4.5) {
    score -= 15;
    warnings.push('Moderate contrast. We recommend increasing difference between foreground and background.');
  }

  // Light foreground on dark background check
  if (l1 > l2) {
    score -= 5;
    warnings.push('Inverted QR code (light on dark). Most modern phone cameras support this, but some older scanners prefer dark-on-light.');
  }

  // Logo impact
  if (hasLogo) {
    if (config.errorCorrectionLevel === 'L') {
      score -= 30;
      warnings.push('Using a logo with Low (L) error correction will cause scan failures. Switch to High (H) or Quartile (Q).');
    } else if (config.errorCorrectionLevel === 'M') {
      score -= 15;
      warnings.push('Recommended: Use Error Correction Level H when adding a center logo.');
    }
    if (config.logoSize > 28) {
      score -= 20;
      warnings.push('Center logo exceeds 28% of QR code area, which can obscure critical data modules.');
    }
  }

  // Margin check
  if (config.margin === 0) {
    score -= 10;
    warnings.push('Zero quiet zone (margin). Add at least 1-2 blocks of margin so scanner cameras can locate the code.');
  }

  const finalScore = Math.max(10, Math.min(100, score));
  let rating: 'Optimal' | 'High' | 'Moderate' | 'Caution' = 'Optimal';
  if (finalScore >= 85) rating = 'Optimal';
  else if (finalScore >= 70) rating = 'High';
  else if (finalScore >= 50) rating = 'Moderate';
  else rating = 'Caution';

  return {
    score: finalScore,
    rating,
    contrastRatio: parseFloat(contrast.toFixed(2)),
    warnings,
  };
}

// Check if a module coordinates belong to one of the 3 corner eyes (finder patterns)
export function isFinderPattern(x: number, y: number, matrixSize: number): boolean {
  // Top-left finder pattern: 0..6 x 0..6
  if (x < 7 && y < 7) return true;
  // Top-right finder pattern: (matrixSize - 7)..matrixSize x 0..6
  if (x >= matrixSize - 7 && y < 7) return true;
  // Bottom-left finder pattern: 0..6 x (matrixSize - 7)..matrixSize
  if (x < 7 && y >= matrixSize - 7) return true;
  return false;
}

// Check if module is within center area reserved for logo
function isInLogoArea(
  x: number,
  y: number,
  matrixSize: number,
  hasLogo: boolean,
  logoSizePercent: number
): boolean {
  if (!hasLogo) return false;
  const logoModules = Math.floor(matrixSize * (logoSizePercent / 100)) + 2;
  const center = Math.floor(matrixSize / 2);
  const half = Math.floor(logoModules / 2);
  return x >= center - half && x <= center + half && y >= center - half && y <= center + half;
}

/**
 * Render customized QR code directly onto an HTML Canvas
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  config: QRStyleConfig,
  customResolution?: number
): Promise<void> {
  const size = customResolution || config.size;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Generate QR matrix
  const qr = QRCode.create(payload, {
    errorCorrectionLevel: config.logoUrl ? 'H' : config.errorCorrectionLevel,
  });

  const matrixSize = qr.modules.size;
  const marginBlocks = config.margin;
  const totalBlocks = matrixSize + marginBlocks * 2;
  const blockSize = size / totalBlocks;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Background
  if (!config.isTransparentBg) {
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, size, size);
  }

  // Create Foreground Fill Style (Linear, Radial, or Solid)
  let fgStyle: string | CanvasGradient = config.fgColor;
  if (config.isGradient) {
    if (config.gradientType === 'linear') {
      const angleRad = (config.gradientAngle * Math.PI) / 180;
      const x0 = size / 2 - (Math.cos(angleRad) * size) / 2;
      const y0 = size / 2 - (Math.sin(angleRad) * size) / 2;
      const x1 = size / 2 + (Math.cos(angleRad) * size) / 2;
      const y1 = size / 2 + (Math.sin(angleRad) * size) / 2;
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, config.fgColor);
      grad.addColorStop(1, config.gradientColor2);
      fgStyle = grad;
    } else {
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, config.fgColor);
      grad.addColorStop(1, config.gradientColor2);
      fgStyle = grad;
    }
  }

  const hasLogo = Boolean(config.logoUrl);

  // Draw data modules (excluding finder patterns and logo area)
  ctx.fillStyle = fgStyle;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isFinderPattern(c, r, matrixSize)) continue;
      if (isInLogoArea(c, r, matrixSize, hasLogo, config.logoSize)) continue;

      const isDark = qr.modules.get(r, c);
      if (!isDark) continue;

      const x = (c + marginBlocks) * blockSize;
      const y = (r + marginBlocks) * blockSize;
      drawModule(ctx, x, y, blockSize, config.dotStyle);
    }
  }

  // Draw Finder Patterns (Corner Eyes)
  const finderPositions = [
    { x: marginBlocks * blockSize, y: marginBlocks * blockSize }, // Top-Left
    { x: (marginBlocks + matrixSize - 7) * blockSize, y: marginBlocks * blockSize }, // Top-Right
    { x: marginBlocks * blockSize, y: (marginBlocks + matrixSize - 7) * blockSize }, // Bottom-Left
  ];

  const outerColor = config.customEyeColor ? config.outerEyeColor : fgStyle;
  const innerColor = config.customEyeColor ? config.innerEyeColor : fgStyle;

  for (const pos of finderPositions) {
    drawEye(ctx, pos.x, pos.y, blockSize * 7, config.cornerStyle, outerColor, innerColor, config.bgColor, config.isTransparentBg);
  }

  // Draw Center Logo if provided
  if (config.logoUrl) {
    await drawCenterLogo(ctx, size, config);
  }
}

function drawModule(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, style: DotStyle) {
  switch (style) {
    case 'dots': {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, (size / 2) * 0.88, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      const radius = size * 0.35;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9, radius);
      ctx.fill();
      break;
    }
    case 'diamond': {
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y);
      ctx.lineTo(x + size, y + size / 2);
      ctx.lineTo(x + size / 2, y + size);
      ctx.lineTo(x, y + size / 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'class': {
      const pad = size * 0.08;
      ctx.beginPath();
      ctx.roundRect(x + pad, y + pad, size - pad * 2, size - pad * 2, size * 0.2);
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.fillRect(x, y, size, size);
      break;
    }
  }
}

function drawEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: CornerStyle,
  outerColor: string | CanvasGradient,
  innerColor: string | CanvasGradient,
  bgColor: string,
  isTransparent: boolean
) {
  const outerBox = size;
  const middleBox = (size * 5) / 7;
  const innerBox = (size * 3) / 7;
  const middleOffset = (outerBox - middleBox) / 2;
  const innerOffset = (outerBox - innerBox) / 2;

  // Outer 7x7 Ring
  ctx.fillStyle = outerColor;
  switch (style) {
    case 'circle': {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, size * 0.25);
      ctx.fill();
      break;
    }
    case 'extra-rounded': {
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, size * 0.4);
      ctx.fill();
      break;
    }
    case 'leaf': {
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, [size * 0.45, 0, size * 0.45, 0]);
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.fillRect(x, y, size, size);
      break;
    }
  }

  // Middle 5x5 Clear Space (Background color)
  ctx.fillStyle = isTransparent ? '#ffffff' : bgColor;
  const mx = x + middleOffset;
  const my = y + middleOffset;

  switch (style) {
    case 'circle': {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, middleBox / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      ctx.beginPath();
      ctx.roundRect(mx, my, middleBox, middleBox, middleBox * 0.22);
      ctx.fill();
      break;
    }
    case 'extra-rounded': {
      ctx.beginPath();
      ctx.roundRect(mx, my, middleBox, middleBox, middleBox * 0.35);
      ctx.fill();
      break;
    }
    case 'leaf': {
      ctx.beginPath();
      ctx.roundRect(mx, my, middleBox, middleBox, [middleBox * 0.45, 0, middleBox * 0.45, 0]);
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.fillRect(mx, my, middleBox, middleBox);
      break;
    }
  }

  // Inner 3x3 Core
  ctx.fillStyle = innerColor;
  const ix = x + innerOffset;
  const iy = y + innerOffset;

  switch (style) {
    case 'circle': {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, innerBox / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'rounded': {
      ctx.beginPath();
      ctx.roundRect(ix, iy, innerBox, innerBox, innerBox * 0.25);
      ctx.fill();
      break;
    }
    case 'extra-rounded': {
      ctx.beginPath();
      ctx.roundRect(ix, iy, innerBox, innerBox, innerBox * 0.4);
      ctx.fill();
      break;
    }
    case 'leaf': {
      ctx.beginPath();
      ctx.roundRect(ix, iy, innerBox, innerBox, [innerBox * 0.45, 0, innerBox * 0.45, 0]);
      ctx.fill();
      break;
    }
    case 'square':
    default: {
      ctx.fillRect(ix, iy, innerBox, innerBox);
      break;
    }
  }
}

async function drawCenterLogo(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  config: QRStyleConfig
): Promise<void> {
  if (!config.logoUrl) return;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const logoPixelSize = (canvasSize * config.logoSize) / 100;
      const margin = config.logoMargin;
      const badgeSize = logoPixelSize + margin * 2;
      const x = (canvasSize - badgeSize) / 2;
      const y = (canvasSize - badgeSize) / 2;

      // Draw protective badge background
      ctx.save();
      ctx.fillStyle = config.bgColor || '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      if (config.logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, badgeSize / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (config.logoShape === 'rounded') {
        ctx.beginPath();
        ctx.roundRect(x, y, badgeSize, badgeSize, badgeSize * 0.25);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, badgeSize, badgeSize);
      }
      ctx.restore();

      // Clip and draw image
      ctx.save();
      const imgX = (canvasSize - logoPixelSize) / 2;
      const imgY = (canvasSize - logoPixelSize) / 2;

      if (config.logoShape === 'circle') {
        ctx.beginPath();
        ctx.arc(canvasSize / 2, canvasSize / 2, logoPixelSize / 2, 0, Math.PI * 2);
        ctx.clip();
      } else if (config.logoShape === 'rounded') {
        ctx.beginPath();
        ctx.roundRect(imgX, imgY, logoPixelSize, logoPixelSize, logoPixelSize * 0.2);
        ctx.clip();
      }

      ctx.drawImage(img, imgX, imgY, logoPixelSize, logoPixelSize);
      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      resolve(); // Do not block if image fails to load
    };
    img.src = config.logoUrl!;
  });
}

/**
 * Generate scalable SVG string for vector exports
 */
export function generateQRSVG(payload: string, config: QRStyleConfig): string {
  const qr = QRCode.create(payload, {
    errorCorrectionLevel: config.logoUrl ? 'H' : config.errorCorrectionLevel,
  });

  const matrixSize = qr.modules.size;
  const marginBlocks = config.margin;
  const totalBlocks = matrixSize + marginBlocks * 2;
  const viewBoxSize = 1000;
  const blockSize = viewBoxSize / totalBlocks;

  const paths: string[] = [];
  const hasLogo = Boolean(config.logoUrl);

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isFinderPattern(c, r, matrixSize)) continue;
      if (isInLogoArea(c, r, matrixSize, hasLogo, config.logoSize)) continue;

      if (qr.modules.get(r, c)) {
        const x = (c + marginBlocks) * blockSize;
        const y = (r + marginBlocks) * blockSize;

        if (config.dotStyle === 'dots') {
          paths.push(`<circle cx="${(x + blockSize / 2).toFixed(2)}" cy="${(y + blockSize / 2).toFixed(2)}" r="${((blockSize / 2) * 0.88).toFixed(2)}" fill="url(#qrGradient)" />`);
        } else if (config.dotStyle === 'rounded') {
          paths.push(`<rect x="${(x + blockSize * 0.05).toFixed(2)}" y="${(y + blockSize * 0.05).toFixed(2)}" width="${(blockSize * 0.9).toFixed(2)}" height="${(blockSize * 0.9).toFixed(2)}" rx="${(blockSize * 0.35).toFixed(2)}" fill="url(#qrGradient)" />`);
        } else {
          paths.push(`<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${blockSize.toFixed(2)}" height="${blockSize.toFixed(2)}" fill="url(#qrGradient)" />`);
        }
      }
    }
  }

  const bgRect = config.isTransparentBg
    ? ''
    : `<rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${config.bgColor}" />`;

  const gradientDef = config.isGradient
    ? `<linearGradient id="qrGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${config.fgColor}" />
        <stop offset="100%" stop-color="${config.gradientColor2}" />
       </linearGradient>`
    : `<linearGradient id="qrGradient">
        <stop offset="0%" stop-color="${config.fgColor}" />
        <stop offset="100%" stop-color="${config.fgColor}" />
       </linearGradient>`;

  // Finder pattern SVGs
  const eyeSize = blockSize * 7;
  const eyeLocations = [
    { x: marginBlocks * blockSize, y: marginBlocks * blockSize },
    { x: (marginBlocks + matrixSize - 7) * blockSize, y: marginBlocks * blockSize },
    { x: marginBlocks * blockSize, y: (marginBlocks + matrixSize - 7) * blockSize },
  ];

  const outerColor = config.customEyeColor ? config.outerEyeColor : 'url(#qrGradient)';
  const innerColor = config.customEyeColor ? config.innerEyeColor : 'url(#qrGradient)';
  const eyeBGFill = config.isTransparentBg ? '#ffffff' : config.bgColor;

  const eyes = eyeLocations
    .map((loc) => {
      const x = loc.x.toFixed(2);
      const y = loc.y.toFixed(2);
      const w = eyeSize.toFixed(2);
      const mOffset = ((eyeSize * 2) / 7 / 2).toFixed(2);
      const mSize = ((eyeSize * 5) / 7).toFixed(2);
      const iOffset = ((eyeSize * 4) / 7 / 2).toFixed(2);
      const iSize = ((eyeSize * 3) / 7).toFixed(2);

      return `
      <!-- Corner Eye -->
      <rect x="${x}" y="${y}" width="${w}" height="${w}" rx="${config.cornerStyle === 'rounded' ? (eyeSize * 0.25).toFixed(2) : 0}" fill="${outerColor}" />
      <rect x="${(loc.x + Number(mOffset)).toFixed(2)}" y="${(loc.y + Number(mOffset)).toFixed(2)}" width="${mSize}" height="${mSize}" rx="${config.cornerStyle === 'rounded' ? (Number(mSize) * 0.2).toFixed(2) : 0}" fill="${eyeBGFill}" />
      <rect x="${(loc.x + Number(iOffset)).toFixed(2)}" y="${(loc.y + Number(iOffset)).toFixed(2)}" width="${iSize}" height="${iSize}" rx="${config.cornerStyle === 'rounded' ? (Number(iSize) * 0.25).toFixed(2) : 0}" fill="${innerColor}" />
      `;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%">
  <defs>
    ${gradientDef}
  </defs>
  ${bgRect}
  <g id="qr-modules">
    ${paths.join('\n    ')}
  </g>
  <g id="qr-eyes">
    ${eyes}
  </g>
</svg>`;
}
