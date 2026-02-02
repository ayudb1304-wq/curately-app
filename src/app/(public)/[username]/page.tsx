"use client";

import { useTheme } from "@/components/theme-provider";
import { useParams } from "next/navigation";
import {
  Instagram,
  Youtube,
  CheckCircle2,
  Share2,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

// Mock data for the Media Kit (to be replaced with real API data)
const MOCK_DATA = {
  displayName: "Maya Creative",
  handle: "@mayavisuals",
  bio: "Crafting visual narratives for global lifestyle brands through editorial motion and digital storytelling.",
  location: "Los Angeles / London",
  avatarUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=1000",
  isVerified: true,
  metrics: {
    subscribers: "12.5K",
    avgViews: "8.2K",
    engagement: "4.2%",
  },
  accounts: [
    { platform: "INSTAGRAM", handle: "maya_visuals", reach: "42.1K" },
    { platform: "YOUTUBE", handle: "MayaVlogs", reach: "15.1K" },
  ],
  topContent: [
    { id: "p1", label: "Editorial" },
    { id: "p2", label: "Commercial" },
    { id: "p3", label: "Lifestyle" },
    { id: "p4", label: "Travel" },
  ],
};

export default function PublicProfilePage() {
  const { theme } = useTheme();
  const params = useParams();
  const username = params.username as string;

  // Use mock data - in production this would fetch from the API based on username
  const profile = {
    ...MOCK_DATA,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
  };

  const ctaClassName = `w-full ${
    theme.id === "noir"
      ? "bg-slate-950 text-white"
      : theme.id === "cyber"
      ? "bg-lime-400 text-black"
      : theme.id === "muse"
      ? "bg-orange-800 text-white"
      : "bg-blue-600 text-white"
  } font-black py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-3 ${
    theme.accentShadow
  } active:scale-[0.99] transition-all group overflow-hidden relative shadow-xl border ${
    theme.id === "pop" ? "border-black" : "border-transparent"
  }`;

  return (
    <div
      className={`min-h-screen ${theme.appBg} transition-colors duration-500`}
      style={{ fontFamily: theme.bodyFont }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-28 md:pb-10">
        {/* Hero Section (full width of container) */}
        <section
          className={`relative w-full overflow-hidden rounded-3xl border ${theme.cardBorder} ${theme.bg}`}
        >
          <div className="relative h-[40vh] min-h-[320px] max-h-[520px] md:h-[500px]">
            <img
              src={profile.avatarUrl}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                theme.id === "cyber"
                  ? "grayscale brightness-50 contrast-125"
                  : theme.id === "pop"
                  ? "contrast-125 saturate-[0.8]"
                  : ""
              }`}
              alt={profile.displayName}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-b ${theme.headerGradient} pointer-events-none transition-all duration-700`}
            />

            {/* Header Actions */}
            <div className="absolute top-0 inset-x-0 z-20 flex items-start justify-between gap-4 p-5 sm:p-8">
              <div
                className={`inline-flex items-center rounded-full border border-white/10 bg-white/10 backdrop-blur-xl px-3 py-1.5 ${
                  theme.id === "pop" || theme.id === "muse"
                    ? "text-slate-900"
                    : "text-white"
                }`}
              >
                <span className="text-[10px] sm:text-xs font-black tracking-[0.28em] uppercase drop-shadow-sm">
                  {theme.name}
                </span>
              </div>
              <button
                type="button"
                className={`p-2.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full ${
                  theme.id === "pop" || theme.id === "muse"
                    ? "text-slate-900"
                    : "text-white"
                }`}
                aria-label="Share media kit"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="md:col-span-4 lg:col-span-4 md:sticky md:top-8 self-start space-y-6">
            {/* Identity / Bio */}
            <div className={`rounded-3xl border ${theme.cardBorder} ${theme.card} p-6`}>
              <div className="space-y-3">
                <h1
                  className={`text-4xl sm:text-5xl font-black leading-[0.95] ${theme.text} transition-all duration-500 ${theme.sigShadow}`}
                  style={{ fontFamily: theme.signatureFont }}
                >
                  {profile.displayName}
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-black tracking-tight lowercase bg-white/60 backdrop-blur-md px-2 py-1 rounded border border-white/20 shadow-sm ${
                      theme.id === "cyber" ? "text-lime-400" : "text-slate-900"
                    }`}
                  >
                    {profile.handle}
                  </span>
                  {profile.isVerified && (
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 size={14} className={theme.accentText} />
                      <span className={`text-[11px] font-black uppercase tracking-widest ${theme.subtext}`}>
                        Verified
                      </span>
                    </span>
                  )}
                </div>

                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] ${theme.subtext}`}>
                  <MapPin size={12} className={theme.accentText} />
                  <span>{profile.location}</span>
                </div>

                <p className={`text-base sm:text-lg font-medium leading-snug ${theme.text}`}>
                  {profile.bio}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className={`rounded-3xl border ${theme.cardBorder} ${theme.card} p-6`}>
              <h3 className={`text-[11px] font-black uppercase tracking-[0.28em] mb-4 ${theme.subtext}`}>
                Social Links
              </h3>
              <div className="space-y-3">
                {profile.accounts.map((acc) => (
                  <a
                    key={acc.platform}
                    href="#"
                    className={`flex items-center justify-between gap-4 rounded-2xl border ${theme.cardBorder} px-4 py-3 shadow-sm hover:shadow-md transition-shadow`}
                    aria-label={`Open ${acc.platform} profile`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${
                          theme.id === "cyber" ? "bg-black/40" : "bg-white"
                        } flex items-center justify-center border ${theme.cardBorder}`}
                      >
                        {acc.platform === "INSTAGRAM" ? (
                          <Instagram size={18} />
                        ) : (
                          <Youtube size={18} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-black ${theme.text} leading-none truncate`}>
                          @{acc.handle}
                        </p>
                        <p className={`text-[11px] font-black tracking-widest ${theme.subtext}`}>
                          Reach {acc.reach}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className={theme.accentText} />
                  </a>
                ))}
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:block mt-6">
                <button type="button" className={ctaClassName}>
                  <Mail size={18} className="relative z-10" />
                  <span className="uppercase tracking-[0.22em] text-[11px] relative z-10">
                    Request Media Partnership
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-8 lg:col-span-8 space-y-8">
            {/* Metrics Grid */}
            <section className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${theme.text}`}>
                    Performance Metrics
                  </h2>
                  <p className={`text-xs sm:text-sm font-medium ${theme.subtext}`}>
                    High-signal overview for brand-side decision makers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`rounded-3xl border ${theme.cardBorder} ${theme.card} p-6 shadow-sm`}>
                  <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${theme.subtext}`}>
                    Subscribers
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.text}`}>
                      {profile.metrics.subscribers}
                    </span>
                    <ArrowUpRight size={14} className="text-emerald-600" />
                  </div>
                </div>

                <div className={`rounded-3xl border ${theme.cardBorder} ${theme.card} p-6 shadow-sm`}>
                  <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${theme.subtext}`}>
                    Avg Views
                  </p>
                  <div className="mt-2">
                    <span className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.text}`}>
                      {profile.metrics.avgViews}
                    </span>
                  </div>
                </div>

                <div className={`rounded-3xl border ${theme.cardBorder} ${theme.card} p-6 shadow-sm`}>
                  <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${theme.subtext}`}>
                    Engagement
                  </p>
                  <div className="mt-2">
                    <span className={`text-3xl sm:text-4xl font-black tracking-tight ${theme.text}`}>
                      {profile.metrics.engagement}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Top Performing Content */}
            <section className="space-y-4">
              <div>
                <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${theme.text}`}>
                  Top Performing Content
                </h2>
                <p className={`text-xs sm:text-sm font-medium ${theme.subtext}`}>
                  A curated gallery that demonstrates creative range and proven resonance.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.topContent.map((content, index) => (
                  <div
                    key={content.id}
                    className={`relative aspect-[3/4] rounded-3xl overflow-hidden group shadow-sm border ${theme.cardBorder}`}
                  >
                    <div
                      className={`absolute inset-0 ${
                        theme.id === "cyber"
                          ? "bg-gradient-to-br from-zinc-800 to-zinc-950"
                          : theme.id === "pop"
                          ? "bg-gradient-to-br from-blue-100 to-blue-200"
                          : theme.id === "muse"
                          ? "bg-gradient-to-br from-orange-50 to-orange-100"
                          : "bg-gradient-to-br from-slate-100 to-slate-200"
                      }`}
                    />
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `radial-gradient(circle at ${
                          index % 2 === 0 ? "20%" : "80%"
                        } ${index < 2 ? "30%" : "70%"}, ${
                          theme.id === "cyber" ? "#a3e635" : "#6366f1"
                        } 0%, transparent 50%)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                      <p className="text-white text-[11px] font-black uppercase tracking-[0.22em]">
                        {content.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <div className={`border-t ${theme.cardBorder} ${theme.bg} backdrop-blur`}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4">
            <button type="button" className={ctaClassName}>
              <Mail size={18} className="relative z-10" />
              <span className="uppercase tracking-[0.22em] text-[11px] relative z-10">
                Request Media Partnership
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
