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

  return (
    <div
      className={`min-h-screen ${theme.bg} flex justify-center items-start sm:py-12 transition-colors duration-500`}
    >
      {/* Phone Frame / Studio View Container */}
      <div
        className={`w-full sm:max-w-[390px] ${theme.bg} min-h-screen sm:min-h-[844px] sm:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] sm:rounded-[55px] overflow-hidden relative sm:border-[10px] sm:border-slate-950 transition-colors duration-500`}
        style={{ fontFamily: theme.bodyFont }}
      >
        {/* Phone Notch (desktop only) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-950 rounded-b-3xl z-50" />

        <div className="h-full overflow-y-auto pb-36 scrollbar-hide">
          {/* Hero Section */}
          <section className="relative w-full h-[460px] overflow-hidden">
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
            <div className="flex justify-between items-center px-8 pt-12 absolute top-0 w-full z-30">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-black tracking-[0.3em] uppercase ${
                    theme.id === "noir" || theme.id === "cyber"
                      ? "text-white"
                      : theme.text
                  } drop-shadow-md`}
                >
                  {theme.name}
                </span>
              </div>
              <button
                className={`p-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full ${
                  theme.id === "pop" || theme.id === "muse"
                    ? "text-slate-900"
                    : "text-white"
                }`}
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Identity Block */}
            <div className="absolute bottom-12 left-8 z-20">
              <h1
                className={`text-6xl ${theme.text} mb-2 transition-all duration-500 ${theme.sigShadow}`}
          style={{ fontFamily: theme.signatureFont }}
        >
                {profile.displayName}
        </h1>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black ${
                    theme.id === "cyber" ? "text-lime-400" : "text-slate-900"
                  } tracking-tighter lowercase bg-white/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 shadow-sm`}
                >
                  {profile.handle}
                </span>
                {profile.isVerified && (
                  <CheckCircle2 size={14} className={theme.accentText} />
                )}
              </div>
            </div>
          </section>

          {/* Bio & Location Section */}
          <section className={`px-8 -mt-6 relative z-20 ${theme.text}`}>
            <div
              className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${theme.subtext}`}
            >
              <MapPin size={10} className={theme.accentText} />
              {profile.location}
            </div>

            <p className="text-xl font-medium leading-snug mb-10 max-w-[300px]">
              {profile.bio}
            </p>

            {/* Metrics Grid */}
            <div
              className={`grid grid-cols-3 gap-4 border-t ${theme.cardBorder} pt-8 pb-10`}
            >
              <div className="space-y-1">
                <p
                  className={`text-[9px] font-black uppercase tracking-widest ${theme.subtext}`}
                >
                  Subscribers
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tracking-tighter">
                    {profile.metrics.subscribers}
                  </span>
                  <ArrowUpRight size={12} className="text-emerald-600" />
                </div>
              </div>
              <div className="space-y-1 text-center">
                <p
                  className={`text-[9px] font-black uppercase tracking-widest ${theme.subtext}`}
                >
                  Avg Views
                </p>
                <span className="text-2xl font-black tracking-tighter">
                  {profile.metrics.avgViews}
                </span>
              </div>
              <div className="space-y-1 text-right">
                <p
                  className={`text-[9px] font-black uppercase tracking-widest ${theme.subtext}`}
                >
                  Engagement
                </p>
                <span className="text-2xl font-black tracking-tighter">
                  {profile.metrics.engagement}
                </span>
              </div>
            </div>
          </section>

          {/* Network Nodes / Social Links */}
          <div className="px-8 mb-10">
            <h3
              className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${theme.subtext}`}
            >
              Network Nodes
            </h3>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {profile.accounts.map((acc) => (
                <div
                  key={acc.platform}
                  className={`flex-shrink-0 flex items-center gap-3 p-4 ${theme.card} border ${theme.cardBorder} rounded-2xl min-w-[150px] shadow-sm`}
                >
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
                  <div>
                    <p
                      className={`text-[10px] font-black ${theme.text} leading-none mb-1`}
                    >
                      @{acc.handle}
                    </p>
                    <p
                      className={`text-[8px] font-black tracking-wider ${theme.subtext}`}
                    >
                      {acc.reach}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Feed - Top Performing Content */}
          <div className="px-8 mb-10">
            <h3
              className={`text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${theme.subtext}`}
            >
              Top Performing Content
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {profile.topContent.map((content, index) => (
                <div
                  key={content.id}
                  className={`relative aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-md border ${theme.cardBorder}`}
                >
                  {/* Placeholder background with gradient */}
                  <div
                    className={`absolute inset-0 ${
                      theme.id === "cyber"
                        ? "bg-gradient-to-br from-zinc-800 to-zinc-900"
                        : theme.id === "pop"
                        ? "bg-gradient-to-br from-blue-100 to-blue-200"
                        : theme.id === "muse"
                        ? "bg-gradient-to-br from-orange-50 to-orange-100"
                        : "bg-gradient-to-br from-slate-100 to-slate-200"
                    }`}
                  />
                  {/* Pattern overlay for visual interest */}
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
                  {/* Content label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
                      {content.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed CTA Button */}
        <div className="absolute bottom-10 left-0 right-0 px-8 z-50">
          <button
            className={`w-full ${
              theme.id === "noir"
                ? "bg-slate-950 text-white"
                : theme.id === "cyber"
                ? "bg-lime-400 text-black"
                : theme.id === "muse"
                ? "bg-orange-800 text-white"
                : "bg-blue-600 text-white"
            } font-black py-6 rounded-[2rem] flex items-center justify-center gap-3 ${
              theme.accentShadow
            } active:scale-[0.97] transition-all group overflow-hidden relative shadow-2xl border ${
              theme.id === "pop" ? "border-black" : "border-transparent"
            }`}
          >
            <Mail size={18} className="relative z-10" />
            <span className="uppercase tracking-[0.2em] text-[10px] relative z-10">
              Request Media Partnership
            </span>
          </button>
        </div>
      </div>

    </div>
  );
}
