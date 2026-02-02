"use client";

import { useTheme } from "@/components/theme-provider";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Instagram,
  Youtube,
  CheckCircle2,
  Share2,
  Mail,
  MapPin,
  ArrowUpRight,
  Users,
  Eye,
  TrendingUp,
  Play,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    followers: "42.1K",
    subscribers: "12.5K",
    avgViews: "8.2K",
    engagement: "4.2%",
  },
  accounts: [
    { platform: "INSTAGRAM", handle: "maya_visuals", reach: "42.1K", icon: Instagram },
    { platform: "YOUTUBE", handle: "MayaVlogs", reach: "15.1K", icon: Youtube },
    { platform: "TIKTOK", handle: "mayavisuals", reach: "28.3K", icon: null },
  ],
  topContent: [
    { id: "p1", label: "Editorial", views: "12.4K" },
    { id: "p2", label: "Commercial", views: "8.7K" },
    { id: "p3", label: "Lifestyle", views: "15.2K" },
    { id: "p4", label: "Travel", views: "9.1K" },
    { id: "p5", label: "BTS", views: "6.3K" },
    { id: "p6", label: "Tutorial", views: "11.8K" },
  ],
};

// TikTok Icon Component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export default function PublicProfilePage() {
  const { theme } = useTheme();
  const params = useParams();
  const username = params.username as string;
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use mock data - in production this would fetch from the API based on username
  const profile = {
    ...MOCK_DATA,
    displayName: username.charAt(0).toUpperCase() + username.slice(1),
  };

  // Track scroll for sticky header effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 280);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-full w-full flex justify-center bg-black/5 dark:bg-black/20">
      {/* Mobile-First Container: Full width on mobile, max-w-md on desktop to mimic phone */}
      <div
        className="w-full max-w-md mx-auto h-full bg-background relative overflow-hidden md:my-4 md:rounded-3xl md:shadow-2xl md:border md:border-border/50"
        style={{ fontFamily: theme.bodyFont }}
      >
        {/* Sticky Header - Appears on scroll */}
        <header
          className={`
            absolute top-0 left-0 right-0 z-50 px-4 py-3
            flex items-center justify-between
            transition-all duration-300 ease-out
            ${isScrolled 
              ? "bg-background/95 backdrop-blur-xl border-b border-border/50 translate-y-0 opacity-100" 
              : "bg-transparent -translate-y-full opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/20">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground">{profile.displayName}</span>
              {profile.isVerified && (
                <Badge className="bg-blue-500 text-white text-[9px] px-1.5 py-0 h-4">
                  <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Share2 className="w-4 h-4" />
          </Button>
        </header>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide scroll-smooth"
        >
          {/* Hero / Profile Section - Centered Avatar */}
          <section className="relative pt-12 pb-6 px-6">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.headerGradient} opacity-50`} />
            
            {/* Top Actions Bar */}
            <div className="relative flex justify-between items-center mb-8">
              <span className="text-[9px] font-black tracking-[0.3em] uppercase text-muted-foreground">
                {theme.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="w-9 h-9 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Centered Avatar */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-4 group">
                <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-background shadow-2xl transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      theme.id === "cyber"
                        ? "grayscale brightness-75 contrast-125"
                        : theme.id === "pop"
                        ? "contrast-110 saturate-110"
                        : ""
                    }`}
                  />
                </div>
                {/* Verified badge overlay */}
                {profile.isVerified && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-2 py-0.5 gap-1 shadow-lg transition-all duration-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Creator
                    </Badge>
                  </div>
                )}
              </div>

              {/* Name & Handle */}
              <h1
                className="text-3xl sm:text-4xl font-black text-foreground mt-4 mb-1 transition-all duration-300"
                style={{ fontFamily: theme.signatureFont }}
              >
                {profile.displayName}
              </h1>
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {profile.handle}
              </p>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                <MapPin className="w-3 h-3" />
                <span>{profile.location}</span>
              </div>

              {/* Bio */}
              <p className="text-sm text-foreground/80 leading-relaxed max-w-[280px]">
                {profile.bio}
              </p>
            </div>
          </section>

          {/* Metrics Grid - 2x2 on mobile */}
          <section className="px-4 py-6">
            <div className="grid grid-cols-2 gap-3">
              {/* Followers */}
              <MetricCard
                icon={<Users className="w-4 h-4" />}
                label="Followers"
                value={profile.metrics.followers}
                trend="+12%"
                theme={theme}
              />
              {/* Subscribers */}
              <MetricCard
                icon={<Youtube className="w-4 h-4 text-red-500" />}
                label="Subscribers"
                value={profile.metrics.subscribers}
                theme={theme}
              />
              {/* Avg Views */}
              <MetricCard
                icon={<Eye className="w-4 h-4" />}
                label="Avg Views"
                value={profile.metrics.avgViews}
                theme={theme}
              />
              {/* Engagement */}
              <MetricCard
                icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                label="Engagement"
                value={profile.metrics.engagement}
                trend="Above avg"
                trendPositive
                theme={theme}
              />
            </div>
          </section>

          {/* Platform Links */}
          <section className="px-4 py-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Connected Platforms
            </h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {profile.accounts.map((acc) => (
                <button
                  key={acc.platform}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 active:scale-95 transition-all duration-200"
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    acc.platform === "INSTAGRAM" 
                      ? "bg-gradient-to-br from-purple-500 to-pink-500" 
                      : acc.platform === "YOUTUBE"
                      ? "bg-red-500"
                      : "bg-foreground"
                  }`}>
                    {acc.platform === "INSTAGRAM" && <Instagram className="w-4 h-4 text-white" />}
                    {acc.platform === "YOUTUBE" && <Youtube className="w-4 h-4 text-white" />}
                    {acc.platform === "TIKTOK" && <TikTokIcon className="w-4 h-4 text-background" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground leading-none">
                      {acc.reach}
                    </p>
                    <p className="text-[9px] text-muted-foreground">
                      @{acc.handle}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Content Feed - Square Grid */}
          <section className="px-4 py-4 pb-32">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3">
              Top Content
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {profile.topContent.map((content, index) => (
                <div
                  key={content.id}
                  className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                >
                  {/* Placeholder background */}
                  <div
                    className={`absolute inset-0 ${
                      theme.id === "cyber"
                        ? "bg-gradient-to-br from-zinc-800 to-zinc-900"
                        : theme.id === "pop"
                        ? "bg-gradient-to-br from-blue-100 to-indigo-200"
                        : theme.id === "muse"
                        ? "bg-gradient-to-br from-orange-100 to-amber-200"
                        : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
                    }`}
                  />
                  {/* Pattern overlay */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle at ${
                        (index % 3) * 30 + 20
                      }% ${Math.floor(index / 3) * 30 + 30}%, ${
                        theme.id === "cyber" ? "#a3e635" : "#6366f1"
                      } 0%, transparent 60%)`,
                    }}
                  />
                  {/* Hover overlay with play icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100" />
                  </div>
                  {/* Content label */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="text-white text-[8px] font-bold uppercase tracking-wider truncate">
                      {content.label}
                    </p>
                    <p className="text-white/70 text-[7px]">{content.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Fixed CTA Button - Safe area aware */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-background via-background/95 to-transparent z-40">
          <Button
            className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-2xl transition-all duration-200 active:scale-[0.98] ${
              theme.id === "noir"
                ? "bg-foreground text-background hover:bg-foreground/90"
                : theme.id === "cyber"
                ? "bg-lime-400 text-black hover:bg-lime-300"
                : theme.id === "muse"
                ? "bg-orange-600 text-white hover:bg-orange-500"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Request Partnership
          </Button>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component for 2x2 grid
function MetricCard({
  icon,
  label,
  value,
  trend,
  trendPositive,
  theme,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendPositive?: boolean;
  theme: ReturnType<typeof import("@/components/theme-provider").useTheme>["theme"];
}) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-200 hover:bg-white/10 active:scale-[0.98]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-muted-foreground">{icon}</div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-foreground tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-[9px] font-bold ${trendPositive ? "text-emerald-500" : "text-muted-foreground"}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
