export interface Theme {
  id: string;
  name: string;
  bg: string;
  appBg: string;
  text: string;
  subtext: string;
  accent: string;
  card: string;
  cardBorder: string;
  headerGradient: string;
  signatureFont: string;
  bodyFont: string;
  accentText: string;
  accentBg: string;
  accentShadow: string;
  sigShadow: string;
}

export type ThemeKey = 'noir' | 'cyber' | 'muse' | 'pop';

