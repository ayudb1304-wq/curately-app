"use client";

import { useTheme } from "@/components/theme-provider";
import { MediaKitPreview } from "@/components/media-kit-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Youtube,
  Instagram,
  Music2,
  ArrowRight,
  Zap,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { YouTubeProfileResult } from "@/app/_actions/youtube";

interface HomeDashboardProps {
  userName: string | null | undefined;
  username: string | null;
  internalUid: string;
  youtubeData: YouTubeProfileResult;
}

export function HomeDashboard({
  userName,
  username,
  internalUid,
  youtubeData,
}: HomeDashboardProps) {
  const { theme } = useTheme();

  const youtubeConnected = youtubeData.success;

  // Quick stats
  const connectedPlatforms = youtubeConnected ? 1 : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <header className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 border-b border-zinc-200/60 dark:border-zinc-800/80 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-950/30">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Welcome Back
          </div>
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50"
            style={{ fontFamily: theme.signatureFont }}
          >
            {userName ? `Hey, ${userName.split(" ")[0]}!` : "Creator Dashboard"}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-xl">
            Your Live Media Kit is ready. Connect platforms to unlock verified
            metrics and share your professional profile with brands.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* Left Column - Media Kit Preview */}
        <section className="col-span-12 lg:col-span-5 space-y-6">
          <MediaKitPreview
            username={username}
            userName={userName}
            internalUid={internalUid}
          />

          {/* Quick Actions */}
          <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-between border-zinc-200/60 dark:border-zinc-800/80"
              >
                <Link href="/admin">
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Identity Engine
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-between border-zinc-200/60 dark:border-zinc-800/80"
              >
                <Link href="/invoices">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Signal Invoicer
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Right Column - Stats & Connections */}
        <section className="col-span-12 lg:col-span-7 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
              <CardContent className="p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                  Connected
                </div>
                <div className="mt-1 text-2xl font-black text-zinc-950 dark:text-zinc-50">
                  {connectedPlatforms}/3
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Platforms
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
              <CardContent className="p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                  Subscribers
                </div>
                <div className="mt-1 text-2xl font-black text-zinc-950 dark:text-zinc-50">
                  {youtubeConnected ? youtubeData.subscriberCount : "—"}
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  YouTube
                </div>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm col-span-2 sm:col-span-1">
              <CardContent className="p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
                  Status
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      youtubeConnected ? "bg-emerald-500" : "bg-amber-500"
                    )}
                  />
                  <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                    {youtubeConnected ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Identity
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Connections */}
          <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-200/60 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Platform Connections
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-xs">
                  <Link href="/admin">
                    Manage
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {/* YouTube */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center",
                      youtubeConnected
                        ? "bg-red-500/10"
                        : "bg-zinc-100 dark:bg-zinc-900"
                    )}
                  >
                    <Youtube
                      className={cn(
                        "h-5 w-5",
                        youtubeConnected
                          ? "text-red-500"
                          : "text-zinc-400"
                      )}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      YouTube
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {youtubeConnected
                        ? youtubeData.channelTitle
                        : "Not connected"}
                    </div>
                  </div>
                </div>
                {youtubeConnected ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    Connected
                  </Badge>
                ) : (
                  <Button
                    asChild
                    size="sm"
                    className={cn(
                      "text-xs",
                      theme.accentBg,
                      theme.id === "cyber" ? "text-black" : "text-white"
                    )}
                  >
                    <Link href="/api/auth/signin/google">Connect</Link>
                  </Button>
                )}
              </div>

              {/* Instagram */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                    <Instagram className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      Instagram
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Coming soon
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-zinc-500 border-zinc-200/60 dark:border-zinc-800/80"
                >
                  Soon
                </Badge>
              </div>

              {/* TikTok */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50/30 dark:bg-zinc-950/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                    <Music2 className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
                      TikTok
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Coming soon
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-zinc-500 border-zinc-200/60 dark:border-zinc-800/80"
                >
                  Soon
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Give-to-Get CTA */}
          <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-gradient-to-r from-zinc-50 to-zinc-100/50 dark:from-zinc-950/50 dark:to-zinc-900/30 p-6">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                  theme.accentBg,
                  theme.id === "cyber" ? "text-black" : "text-white"
                )}
              >
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  Give-to-Get: Your Data, Your Power
                </h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                  Connect your platforms to unlock verified, first-party
                  metrics. Brands trust verified data—stand out from creators
                  who can only show screenshots.
                </p>
                <Button
                  asChild
                  className={cn(
                    "mt-4 text-xs font-bold",
                    theme.accentBg,
                    theme.id === "cyber" ? "text-black" : "text-white"
                  )}
                >
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Connect Platforms
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

