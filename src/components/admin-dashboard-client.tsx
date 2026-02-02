"use client";

import { useTheme } from "@/components/theme-provider";
import { ThemeToggler } from "@/components/shared/theme-toggler";
import { IdentityGrid } from "@/components/identity-grid";
import { YouTubeProfileResult } from "@/app/_actions/youtube";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ShieldCheck } from "lucide-react";

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
    <div className="p-4 sm:p-6 lg:p-8">
      {/* High-tech top bar */}
      <header className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-5 border-b border-zinc-200/60 dark:border-zinc-800/80 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-950/30">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
              Command Center
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 truncate"
                style={{ fontFamily: theme.signatureFont }}
              >
                {userName ? userName : "Creator"}
              </h1>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                • {theme.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-800/80 gap-1"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Identity
              </Badge>
              <Badge
                variant="outline"
                className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20"
              >
                <Fingerprint className="h-3.5 w-3.5 mr-1" />
                {internalUid}
              </Badge>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Golden Record ID
            </div>
          </div>
        </div>
      </header>

      {/* Command center grid */}
      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* Identity Engine */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <IdentityGrid youtubeData={youtubeData} />
        </section>

        {/* Right rail */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <ThemeToggler />

          <Card className="border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                Profile Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">Active Theme</span>
                <span className="font-semibold text-zinc-950 dark:text-zinc-50">{theme.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">YouTube</span>
                <span className="font-semibold text-zinc-950 dark:text-zinc-50">
                  {youtubeData.success ? "Connected" : "Disconnected"}
                </span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

