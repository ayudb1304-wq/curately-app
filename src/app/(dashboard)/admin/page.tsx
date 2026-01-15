"use client";

import { useTheme } from "@/components/theme-provider";
import { THEMES, ThemeKey } from "@/lib/themes";
import { Palette, CheckCircle2 } from "lucide-react";

import { ThemeToggler } from "@/components/shared/theme-toggler";

export default function AdminDashboard() {
  const { theme } = useTheme();

  return (
    <div className={`p-8 min-h-full ${theme.bg}`}>
      <header className="mb-12 space-y-4">
        <h1 
          className="text-4xl md:text-5xl"
          style={{ fontFamily: theme.signatureFont }}
        >
          {theme.name}
        </h1>
        <p className={`text-sm font-bold uppercase tracking-widest ${theme.subtext}`}>
          Creator OS v1.0
        </p>
      </header>

      <section className="space-y-6 mb-12">
        <ThemeToggler />
      </section>

      <section className="space-y-4">
        <div className={`h-32 rounded-3xl ${theme.accentBg} flex items-center justify-center text-white shadow-xl`}>
          <Palette size={48} />
        </div>
        <p className={`text-center text-xs font-bold uppercase tracking-widest ${theme.subtext}`}>
          Active Palette: {theme.accent}
        </p>
      </section>
    </div>
  );
}

