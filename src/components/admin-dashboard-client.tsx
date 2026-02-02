"use client";

import { useTheme } from "@/components/theme-provider";
import { ThemeToggler } from "@/components/shared/theme-toggler";
import { IdentityGrid } from "@/components/identity-grid";
import { YouTubeProfileResult } from "@/app/_actions/youtube";
import { Menu, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col h-full">
      {/* Responsive Header with Breadcrumb */}
      <header className="flex-shrink-0 px-4 py-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm min-w-0">
            <Home className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
            <span className="text-muted-foreground hidden sm:inline">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 hidden sm:inline" />
            <span className="font-semibold text-foreground truncate">
              {userName ? `${userName.split(" ")[0]}'s Studio` : "Creator Studio"}
            </span>
          </nav>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Desktop: Theme Indicator */}
          <div className="hidden md:flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${theme.accentBg} text-white`}
            >
              {theme.name}
            </div>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Welcome Section - Responsive Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Welcome Card - Spans 2 cols on desktop */}
            <div className={`lg:col-span-2 p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10`}>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2"
                style={{ fontFamily: theme.signatureFont }}
              >
                {theme.name}
              </h1>
              <p className="text-xs sm:text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {userName ? `Welcome back, ${userName.split(" ")[0]}` : "Creator OS v1.0"}
              </p>
            </div>

            {/* Theme Selector Card */}
            <div className="p-4 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Theme
              </p>
              <ThemeToggler />
            </div>
          </section>

          {/* Identity Engine - Main Grid */}
          <section>
            <IdentityGrid youtubeData={youtubeData} internalUid={internalUid} />
          </section>

          {/* Stats/Preview Grid - Responsive */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Accent Theme Preview */}
            <div
              className={`sm:col-span-2 xl:col-span-2 aspect-video sm:aspect-auto sm:h-32 rounded-2xl ${theme.accentBg} flex items-center justify-center text-white shadow-xl`}
            >
              <span className="text-xs font-black uppercase tracking-widest opacity-80">
                Active Theme: {theme.name}
              </span>
            </div>

            {/* Placeholder Stats Cards */}
            <div className="aspect-square sm:aspect-auto sm:h-32 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10 flex flex-col items-center justify-center p-4">
              <span className="text-3xl lg:text-4xl font-black text-foreground">0</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Invoices
              </span>
            </div>

            <div className="aspect-square sm:aspect-auto sm:h-32 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/10 flex flex-col items-center justify-center p-4">
              <span className="text-3xl lg:text-4xl font-black text-foreground">0</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                Brands
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

