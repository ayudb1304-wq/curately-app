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
} from "lucide-react";
import Link from "next/link";

interface IdentityGridProps {
  youtubeData: YouTubeProfileResult;
  internalUid: string;
}

export function IdentityGrid({ youtubeData, internalUid }: IdentityGridProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h2
          className={`text-xl md:text-2xl font-black tracking-tight ${theme.text}`}
          style={{ fontFamily: theme.bodyFont }}
        >
          Verified Identity
        </h2>
        <p className={`text-[10px] md:text-xs uppercase tracking-widest font-bold ${theme.subtext}`}>
          Connect your platforms to unlock your Live Media Kit
        </p>
      </div>

      {/* Identity Grid - Stack on mobile, 3 cols on desktop */}
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
        {/* YouTube Card */}
        <YouTubeCard data={youtubeData} theme={theme} />

        {/* Instagram Placeholder */}
        <InstagramCard theme={theme} />

        {/* TikTok Placeholder */}
        <TikTokCard theme={theme} />
      </div>

      {/* Internal UID Display */}
      <div
        className={`p-3 rounded-xl ${theme.appBg} border ${theme.cardBorder}`}
      >
        <p className={`text-[9px] uppercase tracking-widest font-bold ${theme.subtext} mb-1`}>
          Golden Record ID
        </p>
        <p className={`text-[10px] font-mono ${theme.text} opacity-60 break-all`}>
          {internalUid}
        </p>
      </div>
    </div>
  );
}

// YouTube Card Component
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
    <Card
      className={`${theme.card} backdrop-blur-xl border ${theme.cardBorder} rounded-2xl overflow-hidden transition-all hover:shadow-lg`}
    >
      <CardHeader className="pb-3">
        {/* Header Row: Icon, Title, Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                isConnected
                  ? "bg-red-500/10"
                  : theme.id === "cyber"
                  ? "bg-zinc-800"
                  : "bg-slate-100"
              }`}
            >
              <Youtube
                size={20}
                className={isConnected ? "text-red-500" : theme.subtext}
              />
            </div>
            <CardTitle className={`text-base font-black ${theme.text}`}>
              YouTube
            </CardTitle>
          </div>

          {/* Status Badge */}
          {isConnected && (
            <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 gap-1 flex-shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </Badge>
          )}
          {isDisconnected && (
            <Badge
              variant="outline"
              className={`${theme.subtext} border-current/20 flex-shrink-0`}
            >
              Not Connected
            </Badge>
          )}
          {isError && (
            <Badge className="bg-amber-500/20 text-amber-600 border border-amber-500/30 gap-1 flex-shrink-0">
              <AlertCircle className="w-3 h-3" />
              <span>Error</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Connected State */}
        {isConnected && (
          <div className="flex gap-6">
            <div className="min-w-0 flex-1">
              <p className={`text-[10px] uppercase tracking-widest font-bold ${theme.subtext} mb-1`}>
                Channel
              </p>
              <p className={`text-sm font-black ${theme.text} truncate`}>
                {data.channelTitle}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className={`text-[10px] uppercase tracking-widest font-bold ${theme.subtext} mb-1`}>
                Subscribers
              </p>
              <p className={`text-sm font-black ${theme.text}`}>
                {data.subscriberCount}
              </p>
            </div>
          </div>
        )}

        {/* Disconnected State */}
        {isDisconnected && (
          <div className="space-y-3">
            <p className={`text-sm ${theme.subtext}`}>
              Connect your channel to display verified subscriber counts and analytics.
            </p>
            <Button
              asChild
              className={`w-full ${theme.accentBg} text-white font-bold text-xs uppercase tracking-wider`}
            >
              <Link href="/api/auth/signin/google">
                <Link2 className="w-4 h-4 mr-2" />
                Connect YouTube
              </Link>
            </Button>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="space-y-3">
            <div
              className={`p-3 rounded-xl ${
                theme.id === "cyber"
                  ? "bg-amber-400/10 border border-amber-400/20"
                  : "bg-amber-50 border border-amber-100"
              }`}
            >
              <p className={`text-sm ${theme.text}`}>{data.error}</p>
            </div>
            <Button
              asChild
              variant="outline"
              className={`w-full font-bold text-xs uppercase tracking-wider border ${theme.cardBorder}`}
            >
              <Link href="/api/auth/signin/google">
                <AlertCircle className="w-4 h-4 mr-2" />
                Reauthorize
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Instagram Placeholder Card
function InstagramCard({
  theme,
}: {
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <Card
      className={`${theme.card} backdrop-blur-xl border ${theme.cardBorder} rounded-2xl overflow-hidden opacity-75`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                theme.id === "cyber" ? "bg-zinc-800" : "bg-slate-100"
              }`}
            >
              <Instagram size={20} className={theme.subtext} />
            </div>
            <CardTitle className={`text-base font-black ${theme.text}`}>
              Instagram
            </CardTitle>
          </div>

          <Badge
            variant="secondary"
            className={`gap-1 flex-shrink-0 ${
              theme.id === "cyber"
                ? "bg-zinc-800 text-zinc-400"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Coming Soon</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className={`text-sm ${theme.subtext}`}>
          Instagram Business API integration is coming in the next phase.
        </p>
      </CardContent>
    </Card>
  );
}

// TikTok Placeholder Card
function TikTokCard({
  theme,
}: {
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  return (
    <Card
      className={`${theme.card} backdrop-blur-xl border ${theme.cardBorder} rounded-2xl overflow-hidden opacity-75`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                theme.id === "cyber" ? "bg-zinc-800" : "bg-slate-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`w-5 h-5 ${theme.subtext}`}
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </div>
            <CardTitle className={`text-base font-black ${theme.text}`}>
              TikTok
            </CardTitle>
          </div>

          <Badge
            variant="secondary"
            className={`gap-1 flex-shrink-0 ${
              theme.id === "cyber"
                ? "bg-zinc-800 text-zinc-400"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            <span>Contact Support</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className={`text-sm ${theme.subtext}`}>
          TikTok Creator API requires manual enablement. Contact support to join early access.
        </p>
      </CardContent>
    </Card>
  );
}
