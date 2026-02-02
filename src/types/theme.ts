export interface Theme {
  id: string;
  name: string;
  // Visual effects that need runtime theme access
  headerGradient: string;
  sigShadow: string;
  // Fonts (CSS variables are set via globals.css, but these are for inline styles)
  signatureFont: string;
  bodyFont: string;
  // Accent colors (keep for buttons and highlights that need theme-specific colors)
  accentText: string;
  accentBg: string;
  accentShadow: string;
}

export type ThemeKey = 'noir' | 'cyber' | 'muse' | 'pop';
