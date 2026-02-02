"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { FileText, Fingerprint, Home, LayoutDashboard, LogIn, LogOut, Plus, Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RouteTransition } from "@/components/shared/route-transition";
import { useNavigationStore } from "@/stores/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InvoiceTool } from "@/components/invoices/invoice-tool";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function initialsFromName(name: string | null | undefined) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "C";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
}

export function StudioLayout({
  children,
  session: sessionProp,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const { invoicerOpen, setInvoicerOpen, setActiveTab } = useNavigationStore();
  const [mobileNavHidden, setMobileNavHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Ensure hydration completes before showing session-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: sessionHook, status } = useSession();
  
  // Prefer server-passed session (hydrated from root layout) over client hook
  // This ensures immediate render with correct auth state
  const session = sessionProp ?? sessionHook ?? null;
  
  // Determine auth status with multiple fallback checks:
  // 1. If we have sessionProp from server, trust it immediately (no hydration mismatch)
  // 2. If using sessionHook, wait for mount to avoid hydration mismatch
  // 3. Check user.id, user.email, or user.name as any could be populated
  const hasSessionFromServer = !!sessionProp?.user;
  const hasSessionFromHook = mounted && !!(sessionHook?.user?.id || sessionHook?.user?.email);
  const isAuthenticated = hasSessionFromServer || hasSessionFromHook;
  
  // Only show loading state when we don't have server session and hook is loading
  const isLoading = !sessionProp && status === "loading";

  const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = useMemo(() => {
    const base: Array<{ href: string; label: string; icon: LucideIcon }> = [
      { href: "/", label: "Home", icon: Home },
      { href: "/admin", label: "Admin", icon: LayoutDashboard },
      { href: "/invoices", label: "Invoices", icon: FileText },
    ];

    // Don't show Sign In while loading or if authenticated
    if (isLoading || isAuthenticated) {
      base.push({ href: "/settings", label: "Settings", icon: Settings });
      return base;
    }

    base.push({ href: "/auth/signin", label: "Sign In", icon: LogIn });
    return base;
  }, [isAuthenticated, isLoading]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const showAppShell = useMemo(() => {
    if (pathname.startsWith("/auth")) return false;
    if (pathname.startsWith("/api")) return false;
    // Public media kit routes live at `/(public)/[username]` -> `/:username`
    // Anything that isn't an app route is treated as public.
    const isKnownAppRoute =
      pathname === "/" ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/invoices") ||
      pathname.startsWith("/settings");
    return isKnownAppRoute;
  }, [pathname]);

  useEffect(() => {
    if (!showAppShell) return;
    if (pathname.startsWith("/invoices")) setActiveTab("invoices");
    else if (pathname.startsWith("/admin")) setActiveTab("admin");
    else if (pathname.startsWith("/settings")) setActiveTab("settings");
    else setActiveTab("home");
  }, [pathname, setActiveTab, showAppShell]);

  useEffect(() => {
    if (!showAppShell) return;
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const delta = y - lastScrollY.current;
        // Ignore tiny scroll noise
        if (Math.abs(delta) > 6) {
          if (delta > 0 && y > 64) setMobileNavHidden(true);
          else setMobileNavHidden(false);
          lastScrollY.current = y;
        }
        rafRef.current = null;
      });
    };
    lastScrollY.current = window.scrollY || 0;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [showAppShell]);

  return (
    <div
      className={cn(
        "min-h-screen w-full transition-colors duration-500",
        "bg-background"
      )}
    >
      {!showAppShell ? (
        <RouteTransition>{children}</RouteTransition>
      ) : (
        <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen",
            "md:w-20 lg:w-64",
            "border-r border-border",
            "bg-sidebar/55 backdrop-blur-xl"
          )}
        >
          <div className="px-4 lg:px-5 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-9 w-9 rounded-2xl border border-border",
                  "bg-card/60 backdrop-blur flex items-center justify-center"
                )}
              >
                <span className="font-black text-xs tracking-tight text-foreground">C</span>
              </div>
              <div className="hidden lg:block">
                <div className={cn("text-lg font-black tracking-tight text-foreground", "font-heading")}>
                  Curately
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-muted-foreground">
                  Creator OS
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 lg:px-5 py-4 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  href="/settings"
                  className={cn(
                    "flex flex-col lg:flex-row items-center gap-2 lg:gap-3 rounded-2xl px-2 py-2 transition-colors",
                    "hover:bg-accent"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl p-[2px]",
                      theme.accentBg,
                      theme.id === "cyber" ? "text-black" : "text-white"
                    )}
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-background/30">
                      <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "Creator"} />
                      <AvatarFallback className="text-xs font-black">
                        {initialsFromName(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="lg:hidden">
                    <Badge
                      variant="outline"
                      className="px-1.5 py-0 font-mono text-[9px] leading-4 text-muted-foreground border-border bg-card/60"
                      title={session?.user?.internal_uid ?? ""}
                    >
                      <Fingerprint className="h-3.5 w-3.5 mr-1" />
                      {(session?.user?.internal_uid ?? "").slice(0, 8)}
                    </Badge>
                  </div>

                  <div className="hidden lg:block min-w-0 flex-1">
                    <div className="text-sm font-black tracking-tight text-foreground truncate">
                      {session?.user?.name ?? session?.user?.email ?? "Creator"}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] text-muted-foreground border-border bg-card/60"
                      >
                        <Fingerprint className="h-3.5 w-3.5 mr-1" />
                        {session?.user?.internal_uid}
                      </Badge>
                    </div>
                  </div>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start rounded-xl"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                  <span className="lg:hidden">Logout</span>
                </Button>

                <div className="hidden lg:block text-[11px] text-muted-foreground">
                  Theme:{" "}
                  <span className="font-semibold text-foreground">
                    {theme.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden lg:block text-[11px] text-muted-foreground">
                Theme:{" "}
                <span className="font-semibold text-foreground">
                  {theme.name}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
            <div className="bg-card/70 border border-border rounded-2xl shadow-sm backdrop-blur">
              <RouteTransition>{children}</RouteTransition>
            </div>
          </div>
        </main>
      </div>
      )}

      {/* Mobile Bottom Nav */}
      {showAppShell && (
        <nav
          className={cn(
            "md:hidden fixed bottom-3 left-0 right-0 z-50 px-3",
            "transition-transform duration-300",
            mobileNavHidden ? "translate-y-[120%]" : "translate-y-0"
          )}
          aria-label="Bottom navigation"
        >
          <div className="mx-auto max-w-md">
            <div
              className={cn(
                "relative grid items-center rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-lg px-2 py-2",
                isAuthenticated ? "grid-cols-5" : "grid-cols-3"
              )}
            >
              {!isAuthenticated ? (
                <>
                  {/* Left */}
                  <Link
                    href="/admin"
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive("/admin")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutDashboard className={cn("h-5 w-5", isActive("/admin") ? "opacity-100" : "opacity-80")} />
                    <span>Admin</span>
                  </Link>

                  {/* Center Quick Action */}
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      onClick={() => setInvoicerOpen(true)}
                      className={cn(
                        "h-12 w-12 rounded-2xl shadow-xl",
                        theme.accentBg,
                        theme.id === "cyber" ? "text-black" : "text-white"
                      )}
                      size="icon"
                      aria-label="Quick Action: Invoicer"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Right */}
                  <Link
                    href="/invoices"
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive("/invoices")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className={cn("h-5 w-5", isActive("/invoices") ? "opacity-100" : "opacity-80")} />
                    <span>Invoices</span>
                  </Link>
                </>
              ) : (
                <>
                  {/* Admin */}
                  <Link
                    href="/admin"
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive("/admin")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <LayoutDashboard className={cn("h-5 w-5", isActive("/admin") ? "opacity-100" : "opacity-80")} />
                    <span>Admin</span>
                  </Link>

                  {/* Invoices */}
                  <Link
                    href="/invoices"
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive("/invoices")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className={cn("h-5 w-5", isActive("/invoices") ? "opacity-100" : "opacity-80")} />
                    <span>Invoices</span>
                  </Link>

                  {/* Center Quick Action */}
                  <div className="flex items-center justify-center">
                    <Button
                      type="button"
                      onClick={() => setInvoicerOpen(true)}
                      className={cn(
                        "h-12 w-12 rounded-2xl shadow-xl",
                        theme.accentBg,
                        theme.id === "cyber" ? "text-black" : "text-white"
                      )}
                      size="icon"
                      aria-label="Quick Action: Invoicer"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Settings */}
                  <Link
                    href="/settings"
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive("/settings")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Settings className={cn("h-5 w-5", isActive("/settings") ? "opacity-100" : "opacity-80")} />
                    <span>Settings</span>
                  </Link>

                  {/* Profile */}
                  <Link
                    href="/settings"
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                      isActive("/settings")
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Profile"
                  >
                    <div
                      className={cn(
                        "rounded-2xl p-[2px]",
                        theme.accentBg,
                        theme.id === "cyber" ? "text-black" : "text-white"
                      )}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "Creator"} />
                        <AvatarFallback className="text-[9px] font-black">
                          {initialsFromName(session?.user?.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Badge
                      variant="outline"
                      className="max-w-[70px] px-1 py-0 font-mono text-[8px] leading-4 text-muted-foreground border-border bg-card/60 truncate"
                      title={session?.user?.internal_uid ?? ""}
                    >
                      {session?.user?.internal_uid}
                    </Badge>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      <Dialog open={invoicerOpen} onOpenChange={setInvoicerOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Signal Invoicer</DialogTitle>
            <DialogDescription>
              Create a structured invoice to capture demand signals. Your data stays private: tokens are encrypted at rest (AES-256-GCM).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <InvoiceTool mode="modal" onClose={() => setInvoicerOpen(false)} />
            <div className="mt-3 flex justify-end">
              <Button asChild variant="outline">
                <Link href="/invoices" onClick={() => setInvoicerOpen(false)}>
                  Open full workspace
                </Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

