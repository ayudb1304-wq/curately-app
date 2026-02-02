"use client";

import { useTheme } from "@/components/theme-provider";
import { YouTubeProfileResult } from "@/app/_actions/youtube";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  Instagram,
  CheckCircle2,
  AlertCircle,
  Link2,
  Clock,
  MessageCircle,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";

interface IdentityGridProps {
  youtubeData: YouTubeProfileResult;
  internalUid: string;
}

export function IdentityGrid({ youtubeData, internalUid }: IdentityGridProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h2
          className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-foreground"
          style={{ fontFamily: theme.bodyFont }}
        >
          Verified Identity
        </h2>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-muted-foreground">
          Connect your platforms to unlock your Live Media Kit
        </p>
      </div>

      {/* Identity Grid - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* YouTube Card */}
        <YouTubeCard data={youtubeData} theme={theme} />

        {/* Instagram Placeholder */}
        <InstagramCard theme={theme} />

        {/* TikTok Placeholder */}
        <TikTokCard theme={theme} />
      </div>

      {/* Internal UID Display - Glassmorphic */}
      <Card className="bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Fingerprint className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-0.5">
              Golden Record ID
            </p>
            <p className="text-[10px] sm:text-xs font-mono text-foreground/60 break-all">
              {internalUid}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// YouTube Card Component - Glassmorphic Design
function YouTubeCard({
  data,
  theme,
}: {
  data: YouTubeProfileResult;
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  const isConnected = data.success;
  const isDisconnected = !data.success && data.error === "No YouTube account linked";
  const isError = !data.success && !isDisconnected;

  return (
    <Card className="h-full bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10 rounded-2xl overflow-hidden transition-all hover:bg-white/10 dark:hover:bg-white/10 hover:shadow-lg hover:shadow-black/5">
      <CardHeader className="pb-3 p-4 sm:p-6">
        {/* Header Row: Icon, Title, Badge */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                isConnected
                  ? "bg-red-500/20"
                  : "bg-muted/50"
              }`}
            >
              <Youtube
                size={18}
                className={`sm:w-5 sm:h-5 ${isConnected ? "text-red-500" : "text-muted-foreground"}`}
              />
            </div>
            <CardTitle className="text-sm sm:text-base font-black text-foreground">
              YouTube
            </CardTitle>
          </div>

          {/* Status Badge */}
          {isConnected && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 gap-1 flex-shrink-0 text-[10px] sm:text-xs">
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Verified</span>
            </Badge>
          )}
          {isDisconnected && (
            <Badge
              variant="outline"
              className="text-muted-foreground border-muted-foreground/20 flex-shrink-0 text-[10px] sm:text-xs"
            >
              <span className="hidden sm:inline">Not Connected</span>
              <span className="sm:hidden">—</span>
            </Badge>
          )}
          {isError && (
            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 gap-1 flex-shrink-0 text-[10px] sm:text-xs">
              <AlertCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Error</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        {/* Connected State */}
        {isConnected && (
          <div className="flex gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                Channel
              </p>
              <p className="text-xs sm:text-sm font-black text-foreground truncate">
                {data.channelTitle}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">
                Subscribers
              </p>
              <p className="text-xs sm:text-sm font-black text-foreground">
                {data.subscriberCount}
              </p>
            </div>
          </div>
        )}

        {/* Disconnected State */}
        {isDisconnected && (
          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Connect your channel to display verified subscriber counts and analytics.
            </p>
            <Button
              asChild
              size="sm"
              className={`w-full ${theme.accentBg} text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:opacity-90`}
            >
              <Link href="/api/auth/signin/google">
                <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                Connect YouTube
              </Link>
            </Button>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="space-y-3">
            <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs sm:text-sm text-foreground">{data.error}</p>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full font-bold text-[10px] sm:text-xs uppercase tracking-wider border-white/20 hover:bg-white/10"
            >
              <Link href="/api/auth/signin/google">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                Reauthorize
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Instagram Placeholder Card - Glassmorphic Design
function InstagramCard({
  theme,
}: {
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <Card className="h-full bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10 rounded-2xl overflow-hidden opacity-60 hover:opacity-80 transition-all">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Instagram size={18} className="sm:w-5 sm:h-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-sm sm:text-base font-black text-foreground">
              Instagram
            </CardTitle>
          </div>

          <Badge
            variant="secondary"
            className="gap-1 flex-shrink-0 bg-muted/50 text-muted-foreground text-[10px] sm:text-xs"
          >
            <Clock className="w-3 h-3" />
            <span className="hidden sm:inline">Coming Soon</span>
            <span className="sm:hidden">Soon</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Instagram Business API integration is coming in the next phase.
        </p>
      </CardContent>
    </Card>
  );
}

// TikTok Placeholder Card - Glassmorphic Design
function TikTokCard({
  theme,
}: {
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <Card className="h-full bg-white/5 dark:bg-white/5 backdrop-blur-xl border-white/10 dark:border-white/10 rounded-2xl overflow-hidden opacity-60 hover:opacity-80 transition-all">
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-muted/50">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
            <CardTitle className="text-sm sm:text-base font-black text-foreground">
              TikTok
            </CardTitle>
          </div>

          <Badge
            variant="secondary"
            className="gap-1 flex-shrink-0 bg-muted/50 text-muted-foreground text-[10px] sm:text-xs"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="hidden sm:inline">Contact Support</span>
            <span className="sm:hidden">Support</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground">
          TikTok Creator API requires manual enablement. Contact support to join early access.
        </p>
      </CardContent>
    </Card>
  );
}
