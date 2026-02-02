"use client";

import type React from "react";
import { useTheme } from "@/components/theme-provider";
import { useParams } from "next/navigation";
import {
  Instagram,
  Youtube,
  Music2,
  CheckCircle2,
  Share2,
  Mail,
  MapPin,
  ArrowUpRight,
  LockKeyhole,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Mock data for the Media Kit (to be replaced with real API data)
const MOCK_DATA = {
  displayName: "Maya Creative",
  handle: "@mayavisuals",
  bio: "Crafting visual narratives for global lifestyle brands through editorial motion and digital storytelling.",
  location: "Los Angeles / London",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=1000",
  coverUrl:
    "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=2400&h=1200",
  isVerified: true,
  accounts: [
    { platform: "INSTAGRAM", handle: "maya_visuals", reach: "42.1K" },
    { platform: "YOUTUBE", handle: "MayaVlogs", reach: "15.1K" },
  ],
  platformMetrics: {
    YOUTUBE: { followersLabel: "Subscribers", followers: "12.5K", metricA: "Avg views 8.2K", metricB: "Engagement 4.2%" },
    INSTAGRAM: { followersLabel: "Followers", followers: "42.1K", metricA: "Avg reach 18.4K", metricB: "Engagement 3.6%" },
    TIKTOK: { followersLabel: "Followers", followers: "—", metricA: "Avg views —", metricB: "Engagement —" },
  } as const,
  contact: {
    email: "partnerships@mayavisuals.com",
    bookingLinkLabel: "Request Partnership",
  },
};

function PlatformMetricCard({
  platform,
  icon,
  connected,
  followersLabel,
  followers,
  metricA,
  metricB,
  accentText,
}: {
  platform: "YouTube" | "Instagram" | "TikTok";
  icon: React.ReactNode;
  connected: boolean;
  followersLabel: string;
  followers: string;
  metricA: string;
  metricB: string;
  accentText: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/30 backdrop-blur shadow-sm p-6",
        !connected && "cursor-pointer"
      )}
    >
      {!connected && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 dark:from-white/5 dark:to-black/10" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
      )}

      <div className={cn("relative", !connected && "opacity-70")}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/30 flex items-center justify-center">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50 truncate">
                {platform}
              </div>
              <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                {followersLabel}
              </div>
            </div>
          </div>
          {connected ? (
            <Badge className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest gap-1 border border-emerald-500/30 bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest gap-1 border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-100 dark:bg-zinc-900"
            >
              <LockKeyhole className={cn("w-3.5 h-3.5", accentText)} />
              Verify to Unlock
            </Badge>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
              Total
            </div>
            <div className={cn("mt-1 text-lg font-black", "font-metrics")}>
              {connected ? followers : "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
              Metric
            </div>
            <div className="mt-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {connected ? metricA : "Locked"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
              Metric
            </div>
            <div className="mt-1 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {connected ? metricB : "Locked"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const { theme } = useTheme();
  const params = useParams();
  const username = params.username as string;

  // Use mock data - in production this would fetch from the API based on username
  const profile = {
    ...MOCK_DATA,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
  };

  const isConnected = (platform: "YOUTUBE" | "INSTAGRAM" | "TIKTOK") =>
    profile.accounts.some((a) => a.platform === platform);

  const ctaClassName = cn(
    "w-full font-black py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-3",
    "active:scale-[0.99] transition-all group overflow-hidden relative shadow-xl border",
    theme.id === "noir"
      ? "bg-slate-950 text-white border-transparent"
      : theme.id === "cyber"
      ? "bg-lime-400 text-black border-transparent"
      : theme.id === "muse"
      ? "bg-orange-800 text-white border-transparent"
      : "bg-blue-600 text-white border-black"
  );

  return (
    <div
      className={cn("min-h-screen transition-colors duration-500", theme.appBg)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20">
          <div className="relative h-[260px] sm:h-[320px] md:h-[380px]">
            <img
              src={profile.coverUrl}
              className={cn(
                "absolute inset-0 h-full w-full object-cover",
                theme.id === "cyber" ? "brightness-75 contrast-125 saturate-75" : ""
              )}
              alt="Cover"
            />
            <div className={cn("absolute inset-0 bg-gradient-to-b", theme.headerGradient)} />

            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-5 sm:p-8">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 backdrop-blur-xl px-3 py-1.5 text-white">
                <span className="text-[10px] sm:text-xs font-black tracking-[0.28em] uppercase drop-shadow-sm">
                  Curately Media Kit
                </span>
              </div>
              <button
                type="button"
                className="p-2.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white"
                aria-label="Share media kit"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Overlapping avatar + identity */}
          <div className="relative px-5 sm:px-8 pb-6 -mt-14 sm:-mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl overflow-hidden border-4 border-white/70 dark:border-zinc-950/40 shadow-xl">
                  <img src={profile.avatarUrl} alt={profile.displayName} className="h-full w-full object-cover" />
                </div>
                <div className="pb-1">
                  <h1 className={cn("text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow", "font-heading")}>
                    {profile.displayName}
                  </h1>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black tracking-tight lowercase bg-white/15 text-white backdrop-blur-md px-2 py-1 rounded border border-white/10">
                      {profile.handle}
                    </span>
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1 text-white/90">
                        <CheckCircle2 size={14} className={theme.accentText} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Verified</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
                      <MapPin size={12} className={theme.accentText} />
                      <span>{profile.location}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:pb-2">
                <a href={`mailto:${profile.contact.email}`} className={ctaClassName}>
                  <Mail size={18} className="relative z-10" />
                  <span className="uppercase tracking-[0.22em] text-[11px] relative z-10">
                    {profile.contact.bookingLinkLabel}
                  </span>
                  <ArrowUpRight size={18} className="relative z-10 opacity-90" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3-column grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Identity/Bio */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/30 backdrop-blur p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                Identity
              </div>
              <p className="mt-2 text-base text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {profile.bio}
              </p>
              <div className="mt-4 grid gap-2">
                {profile.accounts.map((acc) => (
                  <div
                    key={acc.platform}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 flex items-center justify-center">
                        {acc.platform === "YOUTUBE" ? (
                          <Youtube className="h-4 w-4 text-red-500" />
                        ) : (
                          <Instagram className="h-4 w-4 text-pink-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 truncate">
                          @{acc.handle}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Reach {acc.reach}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight className={cn("h-4 w-4", theme.accentText)} />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Center: Metrics/Charts */}
          <main className="lg:col-span-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                  Verified Metrics
                </div>
                <h2 className={cn("text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50", "font-heading")}>
                  Performance Snapshot
                </h2>
              </div>
              <Badge variant="outline" className="border-zinc-200/70 dark:border-zinc-800/80">
                Give-to-Get
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <PlatformMetricCard
                platform="YouTube"
                icon={<Youtube className="h-5 w-5 text-red-500" />}
                connected={isConnected("YOUTUBE")}
                followersLabel={profile.platformMetrics.YOUTUBE.followersLabel}
                followers={profile.platformMetrics.YOUTUBE.followers}
                metricA={profile.platformMetrics.YOUTUBE.metricA}
                metricB={profile.platformMetrics.YOUTUBE.metricB}
                accentText={theme.accentText}
              />
              <PlatformMetricCard
                platform="Instagram"
                icon={<Instagram className="h-5 w-5 text-pink-500" />}
                connected={isConnected("INSTAGRAM")}
                followersLabel={profile.platformMetrics.INSTAGRAM.followersLabel}
                followers={profile.platformMetrics.INSTAGRAM.followers}
                metricA={profile.platformMetrics.INSTAGRAM.metricA}
                metricB={profile.platformMetrics.INSTAGRAM.metricB}
                accentText={theme.accentText}
              />
              <PlatformMetricCard
                platform="TikTok"
                icon={<Music2 className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />}
                connected={isConnected("TIKTOK")}
                followersLabel={profile.platformMetrics.TIKTOK.followersLabel}
                followers={profile.platformMetrics.TIKTOK.followers}
                metricA={profile.platformMetrics.TIKTOK.metricA}
                metricB={profile.platformMetrics.TIKTOK.metricB}
                accentText={theme.accentText}
              />
            </div>

            {/* Lightweight chart placeholder */}
            <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/30 backdrop-blur p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                    Momentum
                  </div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    Audience growth (sample)
                  </div>
                </div>
                <Badge variant="secondary" className="border border-zinc-200/70 dark:border-zinc-800/80">
                  30d
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-12 gap-2 items-end h-28">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-xl",
                      theme.id === "cyber" ? "bg-lime-400/40" : "bg-indigo-500/25",
                      "border border-zinc-200/40 dark:border-zinc-800/50"
                    )}
                    style={{ height: `${24 + ((i * 13) % 70)}px` }}
                  />
                ))}
              </div>
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                Ghost states appear when a platform isn’t connected—brands see verified data only.
              </div>
            </div>
          </main>

          {/* Right: Contact/CTA */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="rounded-3xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/30 backdrop-blur p-6 shadow-sm">
              <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                Contact
              </div>
              <div className="mt-3 space-y-3">
                <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/20 px-4 py-3">
                  <div className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Email
                  </div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {profile.contact.email}
                  </div>
                </div>
                <a href={`mailto:${profile.contact.email}`} className={ctaClassName}>
                  <Mail size={18} className="relative z-10" />
                  <span className="uppercase tracking-[0.22em] text-[11px] relative z-10">
                    Request Partnership
                  </span>
                </a>
              </div>
              <div className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                Brands get instant clarity; creators keep control via verified connections.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
