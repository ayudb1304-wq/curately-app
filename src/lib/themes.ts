import { Theme, ThemeKey } from "@/types/theme";

export const THEMES: Record<ThemeKey, Theme> = {
  noir: {
    id: 'noir',
    name: 'Noir Signature',
    bg: 'bg-white',
    appBg: 'bg-slate-50',
    text: 'text-slate-950',
    subtext: 'text-slate-500',
    accent: 'indigo-600',
    card: 'bg-white',
    cardBorder: 'border-slate-100',
    headerGradient: 'from-black/40 via-transparent to-white',
    signatureFont: "'Loved by the King', cursive",
    bodyFont: "'Inter', sans-serif",
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    accentShadow: 'shadow-indigo-100',
    sigShadow: 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Pulse',
    bg: 'bg-[#050505]',
    appBg: 'bg-[#0a0a0a]',
    text: 'text-white',
    subtext: 'text-zinc-500',
    accent: 'lime-400',
    card: 'bg-zinc-900/40',
    cardBorder: 'border-zinc-800',
    headerGradient: 'from-lime-400/20 via-transparent to-[#050505]',
    signatureFont: "'Rock Salt', cursive",
    bodyFont: "'JetBrains Mono', monospace",
    accentText: 'text-lime-400',
    accentBg: 'bg-lime-400',
    accentShadow: 'shadow-lime-900/50',
    sigShadow: 'drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]'
  },
  muse: {
    id: 'muse',
    name: 'Earthy Muse',
    bg: 'bg-[#faf7f2]',
    appBg: 'bg-[#f5f1ea]',
    text: 'text-[#2d241e]',
    subtext: 'text-[#7d6d5e]',
    accent: 'orange-800',
    card: 'bg-white',
    cardBorder: 'border-[#e0d6c5]',
    headerGradient: 'from-[#2d241e]/20 via-transparent to-[#faf7f2]',
    signatureFont: "'Zeyada', cursive",
    bodyFont: "'Fraunces', serif",
    accentText: 'text-orange-900',
    accentBg: 'bg-orange-900',
    accentShadow: 'shadow-orange-100',
    sigShadow: 'drop-shadow-[0_1px_2px_rgba(255,255,255,1)]'
  },
  pop: {
    id: 'pop',
    name: 'Electric Pop',
    bg: 'bg-[#fff952]',
    appBg: 'bg-[#fefce8]',
    text: 'text-[#0f172a]',
    subtext: 'text-slate-700',
    accent: 'blue-600',
    card: 'bg-white',
    cardBorder: 'border-slate-950',
    headerGradient: 'from-blue-600/30 via-transparent to-[#fff952]',
    signatureFont: "'Gloria Hallelujah', cursive",
    bodyFont: "'Inter', sans-serif",
    accentText: 'text-blue-700',
    accentBg: 'bg-blue-600',
    accentShadow: 'shadow-blue-200',
    sigShadow: 'drop-shadow-[0_2px_0_white]'
  }
};

export const GOOGLE_FONTS_URLS = [
  'https://fonts.googleapis.com/css2?family=Loved+by+the+King&display=swap',
  'https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap',
  'https://fonts.googleapis.com/css2?family=Zeyada&display=swap',
  'https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,900&display=swap',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'
];

