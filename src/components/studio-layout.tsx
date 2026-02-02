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
  const lastScrollY = useRef(0);
  const rafRef = useRef<number | null>(null);

  const { data: sessionHook } = useSession();
  const session = sessionProp ?? sessionHook ?? null;
  const isAuthenticated = !!session?.user?.id;

  const navItems: Array<{ href: string; label: string; icon: LucideIcon }> = useMemo(() => {
    const base: Array<{ href: string; label: string; icon: LucideIcon }> = [
      { href: "/", label: "Home", icon: Home },
      { href: "/admin", label: "Admin", icon: LayoutDashboard },
      { href: "/invoices", label: "Invoices", icon: FileText },
    ];

    if (!isAuthenticated) {
      base.push({ href: "/auth/signin", label: "Sign In", icon: LogIn });
      return base;
    }

    base.push({ href: "/settings", label: "Settings", icon: Settings });
    return base;
  }, [isAuthenticated]);

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
        theme.appBg
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
            "border-r border-zinc-200/60 dark:border-zinc-800/80",
            "bg-white/55 dark:bg-zinc-950/25 backdrop-blur-xl"
          )}
        >
          <div className="px-4 lg:px-5 py-5 border-b border-zinc-200/60 dark:border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-9 w-9 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80",
                  "bg-white/60 dark:bg-zinc-950/40 backdrop-blur flex items-center justify-center"
                )}
              >
                <span className="font-black text-xs tracking-tight">C</span>
              </div>
              <div className="hidden lg:block">
                <div className={cn("text-lg font-black tracking-tight", "font-heading")}>
                  Curately
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
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
                      ? "bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70 dark:text-zinc-300 dark:hover:text-zinc-50 dark:hover:bg-zinc-900/40"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="truncate hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 lg:px-5 py-4 border-t border-zinc-200/60 dark:border-zinc-800/80">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  href="/settings"
                  className={cn(
                    "flex flex-col lg:flex-row items-center gap-2 lg:gap-3 rounded-2xl px-2 py-2 transition-colors",
                    "hover:bg-zinc-100/70 dark:hover:bg-zinc-900/40"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl p-[2px]",
                      theme.accentBg,
                      theme.id === "cyber" ? "text-black" : "text-white"
                    )}
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-white/30 dark:ring-black/20">
                      <AvatarImage src={session?.user?.image ?? undefined} alt={session?.user?.name ?? "Creator"} />
                      <AvatarFallback className="text-xs font-black">
                        {initialsFromName(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="lg:hidden">
                    <Badge
                      variant="outline"
                      className="px-1.5 py-0 font-mono text-[9px] leading-4 text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20"
                      title={session?.user?.internal_uid ?? ""}
                    >
                      <Fingerprint className="h-3.5 w-3.5 mr-1" />
                      {(session?.user?.internal_uid ?? "").slice(0, 8)}
                    </Badge>
                  </div>

                  <div className="hidden lg:block min-w-0 flex-1">
                    <div className="text-sm font-black tracking-tight text-zinc-950 dark:text-zinc-50 truncate">
                      {session?.user?.name ?? session?.user?.email ?? "Creator"}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20"
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
                  className="w-full justify-start rounded-xl border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                  <span className="lg:hidden">Logout</span>
                </Button>

                <div className="hidden lg:block text-[11px] text-zinc-500 dark:text-zinc-400">
                  Theme:{" "}
                  <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                    {theme.name}
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden lg:block text-[11px] text-zinc-500 dark:text-zinc-400">
                Theme:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-200">
                  {theme.name}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
            <div className="bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-sm backdrop-blur">
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
                "relative grid items-center rounded-2xl border border-zinc-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/70 backdrop-blur-xl shadow-lg px-2 py-2",
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                      className="max-w-[70px] px-1 py-0 font-mono text-[8px] leading-4 text-zinc-600 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 truncate"
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

