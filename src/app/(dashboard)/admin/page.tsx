"use client";

import { useState, useTransition } from "react";
import { useTheme } from "@/components/theme-provider";
import { Palette, Youtube, RefreshCw, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { ThemeToggler } from "@/components/shared/theme-toggler";
import { getYouTubeProfile, YouTubeProfileResult } from "@/app/_actions/youtube";

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<YouTubeProfileResult | null>(null);

  const handleTestConnection = () => {
    startTransition(async () => {
      const response = await getYouTubeProfile();
      setResult(response);
    });
  };

  return (
    <div className={`p-8 min-h-full ${theme.bg}`}>
      <header className="mb-12 space-y-4">
        <h1
          className="text-4xl md:text-5xl"
          style={{ fontFamily: theme.signatureFont }}
        >
          {theme.name}
        </h1>
        <p
          className={`text-sm font-bold uppercase tracking-widest ${theme.subtext}`}
        >
          Creator OS v1.0
        </p>
      </header>

      <section className="space-y-6 mb-12">
        <ThemeToggler />
      </section>

      {/* YouTube Connection Status Card */}
      <section className="space-y-4 mb-12">
        <div
          className={`${theme.card} border ${theme.cardBorder} rounded-[2rem] p-6 shadow-sm`}
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl ${theme.appBg} flex items-center justify-center`}
              >
                <Youtube size={24} className={theme.text} />
              </div>
              <div>
                <h3 className={`text-lg font-black tracking-tight ${theme.text}`}>
                  YouTube Connection
                </h3>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${theme.subtext}`}
                >
                  API Connectivity Status
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              {result === null ? (
                <div className="w-3 h-3 rounded-full bg-slate-300" />
              ) : result.success ? (
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-red-500" />
              )}
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${theme.subtext}`}
              >
                {result === null
                  ? "Untested"
                  : result.success
                  ? "Connected"
                  : "Error"}
              </span>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div
              className={`mb-6 p-4 rounded-2xl ${
                result.success
                  ? theme.id === "cyber"
                    ? "bg-lime-400/10 border border-lime-400/20"
                    : "bg-emerald-50 border border-emerald-100"
                  : theme.id === "cyber"
                  ? "bg-red-400/10 border border-red-400/20"
                  : "bg-red-50 border border-red-100"
              }`}
            >
              {result.success ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span
                      className={`text-xs font-black uppercase tracking-widest text-emerald-600`}
                    >
                      Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p
                        className={`text-[9px] font-black uppercase tracking-widest ${theme.subtext} mb-1`}
                      >
                        Channel
                      </p>
                      <p className={`text-sm font-black ${theme.text}`}>
                        {result.channelTitle}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-[9px] font-black uppercase tracking-widest ${theme.subtext} mb-1`}
                      >
                        Subscribers
                      </p>
                      <p className={`text-sm font-black ${theme.text}`}>
                        {result.subscriberCount}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-red-600 mb-1">
                      Connection Failed
                    </p>
                    <p className={`text-xs ${theme.subtext}`}>{result.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Test Connection Button */}
          <button
            onClick={handleTestConnection}
            disabled={isPending}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isPending
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : `${theme.accentBg} text-white shadow-lg hover:shadow-xl`
            }`}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Testing Connection...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Test Connection
              </>
            )}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div
          className={`h-32 rounded-3xl ${theme.accentBg} flex items-center justify-center text-white shadow-xl`}
        >
          <Palette size={48} />
        </div>
        <p
          className={`text-center text-xs font-bold uppercase tracking-widest ${theme.subtext}`}
        >
          Active Palette: {theme.accent}
        </p>
      </section>
    </div>
  );
}
