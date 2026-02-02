import { Theme, ThemeKey } from "@/types/theme";

export const THEMES: Record<ThemeKey, Theme> = {
  noir: {
    id: 'noir',
    name: 'Noir Signature',
    headerGradient: 'from-black/40 via-transparent to-white',
    signatureFont: "var(--font-heading)",
    bodyFont: "var(--font-body)",
    accentText: 'text-indigo-600',
    accentBg: 'bg-indigo-600',
    accentShadow: 'shadow-indigo-100',
    sigShadow: 'drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Pulse',
    headerGradient: 'from-lime-400/20 via-transparent to-[#050505]',
    signatureFont: "var(--font-heading)",
    bodyFont: "var(--font-body)",
    accentText: 'text-lime-400',
    accentBg: 'bg-lime-400',
    accentShadow: 'shadow-lime-900/50',
    sigShadow: 'drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]'
  },
  muse: {
    id: 'muse',
    name: 'Earthy Muse',
    headerGradient: 'from-[#2d241e]/20 via-transparent to-[#faf7f2]',
    signatureFont: "var(--font-heading)",
    bodyFont: "var(--font-body)",
    accentText: 'text-orange-900',
    accentBg: 'bg-orange-900',
    accentShadow: 'shadow-orange-100',
    sigShadow: 'drop-shadow-[0_1px_2px_rgba(255,255,255,1)]'
  },
  pop: {
    id: 'pop',
    name: 'Electric Pop',
    headerGradient: 'from-blue-600/30 via-transparent to-[#fff952]',
    signatureFont: "var(--font-heading)",
    bodyFont: "var(--font-body)",
    accentText: 'text-blue-700',
    accentBg: 'bg-blue-600',
    accentShadow: 'shadow-blue-200',
    sigShadow: 'drop-shadow-[0_2px_0_white]'
  }
};
