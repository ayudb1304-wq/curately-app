"use client";

import { useTheme } from "@/components/theme-provider";
import { ThemeToggler } from "@/components/shared/theme-toggler";
import { IdentityGrid } from "@/components/identity-grid";
import { YouTubeProfileResult } from "@/app/_actions/youtube";

interface AdminDashboardClientProps {
  youtubeData: YouTubeProfileResult;
  internalUid: string;
  userName: string | null | undefined;
}

export function AdminDashboardClient({
  youtubeData,
  internalUid,
  userName,
}: AdminDashboardClientProps) {
  const { theme } = useTheme();

  return (
    <div className={`p-6 md:p-8 min-h-full ${theme.bg}`}>
      {/* Header */}
      <header className="mb-8 space-y-3">
        <h1
          className={`text-3xl md:text-5xl ${theme.text}`}
          style={{ fontFamily: theme.signatureFont }}
        >
          {theme.name}
        </h1>
        <p
          className={`text-xs font-bold uppercase tracking-widest ${theme.subtext}`}
        >
          {userName ? `Welcome back, ${userName.split(" ")[0]}` : "Creator OS v1.0"}
        </p>
      </header>

      {/* Theme Selector */}
      <section className="mb-10">
        <ThemeToggler />
      </section>

      {/* Identity Engine Section */}
      <section className="mb-10">
        <IdentityGrid youtubeData={youtubeData} internalUid={internalUid} />
      </section>

      {/* Accent Palette Preview */}
      <section className="space-y-3">
        <div
          className={`h-24 md:h-32 rounded-3xl ${theme.accentBg} flex items-center justify-center text-white shadow-xl`}
        >
          <span className="text-xs font-black uppercase tracking-widest opacity-80">
            Active Theme: {theme.name}
          </span>
        </div>
      </section>
    </div>
  );
}

