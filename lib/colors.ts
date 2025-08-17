// lib/color.ts

type RGB = { r: number; g: number; b: number };

export function hexToRgb(hex?: string): RGB | null {
  if (!hex) return null;
  const h = hex.replace('#', '').trim();
  const ok = /^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h);
  if (!ok) return null;
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

function srgbToLinear(c: number): number {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

export function luminance(rgb: RGB): number {
  // WCAG relative luminance
  const R = srgbToLinear(rgb.r);
  const G = srgbToLinear(rgb.g);
  const B = srgbToLinear(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function contrastRatio(L1: number, L2: number): number {
  // L1 should be the lighter luminance
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

function blend(bg: RGB, overlay: RGB, alpha: number): RGB {
  // Standard "source over" blend: result = overlay*alpha + bg*(1-alpha)
  return {
    r: Math.round(overlay.r * alpha + bg.r * (1 - alpha)),
    g: Math.round(overlay.g * alpha + bg.g * (1 - alpha)),
    b: Math.round(overlay.b * alpha + bg.b * (1 - alpha)),
  };
}

export function pickAccessibleText(bgHex?: string): {
  textColor: '#000000' | '#ffffff';
  scrim: string | null; // 'rgba(...)' or null
  bgFallback: string;   // background color to use
} {
  const rgb = hexToRgb(bgHex) || { r: 245, g: 245, b: 245 }; // neutral fallback
  const Lbg = luminance(rgb);

  const Lblack = 0;           // luminance of #000
  const Lwhite = 1;           // luminance of #fff
  const CR_black = contrastRatio(Lbg, Lblack);
  const CR_white = contrastRatio(Lbg, Lwhite);

  // Prefer the higher contrast
  let textColor: '#000000' | '#ffffff' = CR_black >= CR_white ? '#000000' : '#ffffff';
  let bestCR = Math.max(CR_black, CR_white);

  // AA target for normal text
  const TARGET = 4.5;
  if (bestCR >= TARGET) {
    return { textColor, scrim: null, bgFallback: bgHex || '#f5f5f5' };
  }

  // Both failed — add a scrim (black if text is white, white if text is black) and find a minimal alpha that passes.
  const scrimRgb: RGB = textColor === '#ffffff' ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };
  const candidates = [0.24, 0.32, 0.4, 0.48];

  for (const a of candidates) {
    const blended = blend(rgb, scrimRgb, a);
    const Lblended = luminance(blended);
    const CR = contrastRatio(Lblended, textColor === '#000000' ? Lblack : Lwhite);
    if (CR >= TARGET) {
      const rgba = textColor === '#ffffff'
        ? `rgba(0,0,0,${a})`
        : `rgba(255,255,255,${a})`;
      return { textColor, scrim: rgba, bgFallback: bgHex || '#f5f5f5' };
    }
  }

  // Last resort: keep the scrim at max candidate even if not quite 4.5 (very rare edge like neon yellow).
  const maxA = candidates[candidates.length - 1];
  const rgba = textColor === '#ffffff' ? `rgba(0,0,0,${maxA})` : `rgba(255,255,255,${maxA})`;
  return { textColor, scrim: rgba, bgFallback: bgHex || '#f5f5f5' };
}
