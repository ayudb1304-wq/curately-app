"use client";

import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  ExternalLink,
  Eye,
  Link2,
  Sparkles,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MediaKitPreviewProps {
  username: string | null;
  userName: string | null | undefined;
  internalUid: string;
}

export function MediaKitPreview({
  username,
  userName,
  internalUid,
}: MediaKitPreviewProps) {
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  // Use username if available, otherwise fall back to internal_uid
  const profileSlug = username || internalUid;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const publicUrl = `${baseUrl}/${profileSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Card className="overflow-hidden border-zinc-200/60 dark:border-zinc-800/80 shadow-sm">
      <CardHeader className="pb-3 border-b border-zinc-200/60 dark:border-zinc-800/80 bg-gradient-to-r from-zinc-50 to-transparent dark:from-zinc-950/30">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/40 flex items-center justify-center">
              <Globe className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
            </div>
            <CardTitle className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50">
              Live Media Kit
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-black uppercase tracking-widest border-zinc-200/60 dark:border-zinc-800/80"
          >
            Public Page
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Preview Card */}
        <div className="relative rounded-xl border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-950/30 overflow-hidden">
          {/* Mini Preview Header */}
          <div className="relative h-24 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900">
            <div
              className={cn(
                "absolute inset-0 opacity-60",
                theme.id === "noir"
                  ? "bg-gradient-to-br from-slate-600 to-slate-800"
                  : theme.id === "cyber"
                  ? "bg-gradient-to-br from-lime-400/30 to-emerald-600/30"
                  : theme.id === "muse"
                  ? "bg-gradient-to-br from-orange-400/30 to-amber-600/30"
                  : "bg-gradient-to-br from-blue-400/30 to-indigo-600/30"
              )}
            />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-50/90 dark:from-zinc-950/90 to-transparent" />
          </div>

          {/* Mini Preview Content */}
          <div className="relative px-4 pb-4 -mt-6">
            <div className="flex items-end gap-3">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl border-2 border-white dark:border-zinc-950 shadow-lg flex items-center justify-center text-white font-black text-sm",
                  theme.accentBg
                )}
              >
                {userName?.[0]?.toUpperCase() || "C"}
              </div>
              <div className="pb-1">
                <div className="text-sm font-black text-zinc-950 dark:text-zinc-50">
                  {userName || "Creator"}
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  @{profileSlug.slice(0, 12)}
                  {profileSlug.length > 12 ? "..." : ""}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-[9px] bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80"
              >
                <Eye className="h-3 w-3 mr-1" />
                Verified Metrics
              </Badge>
              <Badge
                variant="secondary"
                className="text-[9px] bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/80"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
            </div>
          </div>

          {/* Preview Overlay Link */}
          <Link
            href={`/${profileSlug}`}
            target="_blank"
            className="absolute inset-0 bg-transparent hover:bg-zinc-950/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-zinc-900/90 shadow-lg border border-zinc-200/60 dark:border-zinc-800/80">
              <Eye className="h-4 w-4" />
              <span className="text-xs font-bold">View Full Page</span>
            </div>
          </Link>
        </div>

        {/* URL Copy Section */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
            Your Public URL
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                value={publicUrl}
                readOnly
                className="pl-9 pr-3 text-xs font-mono bg-white/60 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800/80"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className={cn(
                "shrink-0 border-zinc-200/60 dark:border-zinc-800/80 transition-colors",
                copied && "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
              )}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Link copied to clipboard!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 text-xs font-bold border-zinc-200/60 dark:border-zinc-800/80"
          >
            <Link href={`/${profileSlug}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Link>
          </Button>
          <Button
            asChild
            className={cn(
              "flex-1 text-xs font-bold",
              theme.accentBg,
              theme.id === "cyber" ? "text-black" : "text-white"
            )}
          >
            <Link href="/settings">
              <Sparkles className="h-4 w-4 mr-2" />
              Customize
            </Link>
          </Button>
        </div>

        {/* Username hint */}
        {!username && (
          <div className="rounded-xl border border-amber-200/70 dark:border-amber-800/50 bg-amber-50/70 dark:bg-amber-950/20 p-3">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Tip:</strong> Set a custom username in Settings for a
              cleaner URL like{" "}
              <span className="font-mono">curately.com/yourname</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

