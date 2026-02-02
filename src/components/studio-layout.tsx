"use client";

import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { Home, LayoutDashboard, LogIn } from "lucide-react";

export function StudioLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const pathname = usePathname();

  const navItems: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
  }> = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin", label: "Admin", icon: LayoutDashboard },
    { href: "/auth/signin", label: "Sign In", icon: LogIn },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div
      className="min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500"
      style={{ fontFamily: theme.bodyFont }}
    >
      <div className="flex min-h-screen w-full">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col md:sticky md:top-0 md:h-screen border-r border-zinc-200/60 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-950/20 backdrop-blur">
          <div className="px-5 py-5 border-b border-zinc-200/60 dark:border-zinc-800/80">
            <div
              className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50"
              style={{ fontFamily: theme.signatureFont }}
            >
              Curately
            </div>
            <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-zinc-500 dark:text-zinc-400">
              Creator OS
            </div>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
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
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-5 py-4 border-t border-zinc-200/60 dark:border-zinc-800/80">
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Theme: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{theme.name}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-3 py-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                    active
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "opacity-100" : "opacity-80")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

