"use client";

import type React from "react";
import { useMemo, useState } from "react";
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
  Music2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Link2,
  Sparkles,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IdentityGridProps {
  youtubeData: YouTubeProfileResult;
}

export function IdentityGrid({ youtubeData }: IdentityGridProps) {
  const { theme } = useTheme();
  const [sovereigntyOpen, setSovereigntyOpen] = useState(false);
  const [platformFocus, setPlatformFocus] = useState<"YouTube" | "Instagram" | "TikTok">("YouTube");

  const youtubeConnected = youtubeData.success;

  const onDisconnectedClick = (platform: "YouTube" | "Instagram" | "TikTok") => {
    setPlatformFocus(platform);
    setSovereigntyOpen(true);
  };

  const platformMeta = useMemo(() => {
    const map = {
      YouTube: { icon: Youtube, accent: "text-red-500", connectHref: "/api/auth/signin/google", connectLabel: "Connect YouTube" },
      Instagram: { icon: Instagram, accent: "text-pink-500", connectHref: "", connectLabel: "Connect Instagram" },
      TikTok: { icon: Music2, accent: "text-zinc-900 dark:text-zinc-50", connectHref: "", connectLabel: "Connect TikTok" },
    } as const;
    return map[platformFocus];
  }, [platformFocus]);
  const PlatformIcon = platformMeta.icon;

  return (
    <div className="space-y-4" style={{ fontFamily: theme.bodyFont }}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            Identity Engine
          </h2>
        </div>
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
          Give-to-Get: connect accounts to unlock verified, first-party metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <YouTubeCard
          data={youtubeData}
          theme={theme}
          onDisconnectedClick={() => onDisconnectedClick("YouTube")}
        />
        <DisconnectedPlatformCard
          platform="Instagram"
          Icon={Instagram}
          onClick={() => onDisconnectedClick("Instagram")}
        />
        <DisconnectedPlatformCard
          platform="TikTok"
          Icon={Music2}
          onClick={() => onDisconnectedClick("TikTok")}
        />
      </div>

      <Dialog open={sovereigntyOpen} onOpenChange={setSovereigntyOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Data Sovereignty</DialogTitle>
            <DialogDescription>
              Curately only uses official OAuth connections—no scraping. When you connect a platform, your tokens are encrypted at rest using <span className="font-semibold">AES-256-GCM</span> (via <span className="font-mono text-xs">@/lib/encryption</span>).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/30 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 flex items-center justify-center">
                  <PlatformIcon className={cn("h-5 w-5", platformMeta.accent)} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                    {platformFocus} connection
                  </div>
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                    You stay in control. You can revoke access anytime from your provider dashboard. We store refresh tokens only in encrypted form and never expose them client-side.
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 p-4">
                <div className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4 text-emerald-600" />
                  <div className="text-sm font-semibold">Encrypted at rest</div>
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Refresh tokens are protected using AES-256-GCM encryption before being persisted.
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  <div className="text-sm font-semibold">Official APIs only</div>
                </div>
                <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  Verified metrics come from the platform’s official OAuth + API scopes.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Status:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                  {platformFocus === "YouTube" && youtubeConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              {platformFocus === "YouTube" && !youtubeConnected ? (
                <Button asChild className={cn(theme.accentBg, theme.id === "cyber" ? "text-black" : "text-white")}>
                  <Link href={platformMeta.connectHref} onClick={() => setSovereigntyOpen(false)}>
                    <Link2 className="w-4 h-4 mr-2" />
                    {platformMeta.connectLabel}
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setSovereigntyOpen(false)}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// YouTube Card Component
function YouTubeCard({
  data,
  theme,
  onDisconnectedClick,
}: {
  data: YouTubeProfileResult;
  theme: ReturnType<typeof useTheme>["theme"];
  onDisconnectedClick: () => void;
}) {
  const isConnected = data.success;
  const isDisconnected = !data.success && data.error === "No YouTube account linked";
  const isError = !data.success && !isDisconnected;

  return (
    <Card
      onClick={() => {
        if (isDisconnected) onDisconnectedClick();
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 shadow-sm transition-all",
        "bg-white/70 dark:bg-zinc-900/60 backdrop-blur",
        isDisconnected && "border-dashed bg-zinc-50/70 dark:bg-zinc-950/20",
        "hover:shadow-md"
      )}
    >
      {isConnected && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent opacity-90" />
      )}
      <CardHeader className="pb-3">
        {/* Header Row: Icon, Title, Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center",
                isConnected ? "bg-red-500/10" : "bg-zinc-100 dark:bg-zinc-900"
              )}
            >
              <Youtube
                size={20}
                className={cn(
                  isConnected ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"
                )}
              />
            </div>
            <CardTitle className="text-base font-black text-zinc-950 dark:text-zinc-50">
              YouTube
            </CardTitle>
          </div>

          {/* Status Badge */}
          {isConnected && (
            <Badge className="flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest gap-1 border border-emerald-500/30 bg-emerald-500 text-white dark:bg-emerald-500/20 dark:text-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </Badge>
          )}
          {isDisconnected && (
            <Badge
              variant="outline"
              className="flex-shrink-0 rounded-full text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-zinc-200/70 dark:border-zinc-800/80"
            >
              Not connected
            </Badge>
          )}
          {isError && (
            <Badge className="flex-shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest gap-1 border border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <AlertCircle className="w-3.5 h-3.5" />
              Attention
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Connected State */}
        {isConnected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                Channel
              </p>
                <p className="text-sm font-black text-zinc-950 dark:text-zinc-50 truncate">
                {data.channelTitle}
              </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                Subscribers
              </p>
                <p className="text-sm font-black text-zinc-950 dark:text-zinc-50">
                {data.subscriberCount}
              </p>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/20 p-3">
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                Your YouTube metrics are now verified via official OAuth. These numbers can be used across your Live Media Kit.
              </p>
            </div>
          </div>
        )}

        {/* Disconnected State */}
        {isDisconnected && (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Connect YouTube to unlock verified subscriber counts and power your Live Media Kit with first-party data.
            </p>
            <Button
              asChild
              className={cn(
                "w-full font-black text-xs uppercase tracking-widest",
                theme.accentBg,
                "text-white"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="/api/auth/signin/google">
                <Link2 className="w-4 h-4 mr-2" />
                Connect YouTube
              </Link>
            </Button>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Sparkles className="h-4 w-4" />
              <span>Give-to-Get: verified data unlocks better tools.</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="space-y-3">
            <div
              className="p-3 rounded-xl bg-amber-50 border border-amber-200/70 dark:bg-amber-500/10 dark:border-amber-500/20"
            >
              <p className="text-sm text-zinc-900 dark:text-zinc-50">{data.error}</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full font-black text-xs uppercase tracking-widest border-zinc-200/70 dark:border-zinc-800/80"
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

function DisconnectedPlatformCard({
  platform,
  Icon,
  onClick,
}: {
  platform: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="relative overflow-hidden rounded-2xl border border-dashed border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/20 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      aria-label={`${platform} connection status (disconnected)`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80">
              <Icon className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            </div>
            <CardTitle className="text-base font-black text-zinc-950 dark:text-zinc-50">
              {platform}
            </CardTitle>
          </div>

          <Badge
            variant="outline"
            className="flex-shrink-0 rounded-full text-[11px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 border-zinc-200/70 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20"
          >
            Disconnected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Click to review Curately’s data sovereignty model and token encryption guarantees.
        </p>
        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <ShieldCheck className="h-4 w-4" />
          <span>AES-256-GCM encrypted at rest • Official APIs only</span>
        </div>
      </CardContent>
    </Card>
  );
}
