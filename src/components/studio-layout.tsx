"use client";

import { useTheme } from "@/components/theme-provider";
import { Home, FileText, User, Settings } from "lucide-react";

export function StudioLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className="h-dvh w-full flex bg-white dark:bg-slate-950 transition-colors duration-300"
      style={{ fontFamily: theme.bodyFont }}
    >
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:flex-shrink-0 border-r border-border bg-sidebar">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <span
            className="text-xl font-bold text-sidebar-foreground"
            style={{ fontFamily: theme.headingFont }}
          >
            Curately
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <SidebarNavItem icon={<Home className="w-5 h-5" />} label="Dashboard" active />
          <SidebarNavItem icon={<FileText className="w-5 h-5" />} label="Media Kit" />
          <SidebarNavItem icon={<User className="w-5 h-5" />} label="Profile" />
          <SidebarNavItem icon={<Settings className="w-5 h-5" />} label="Settings" />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-sm text-sidebar-foreground/60">
            Creator OS v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header - Hidden on desktop */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-background">
          <span
            className="text-lg font-bold text-foreground"
            style={{ fontFamily: theme.headingFont }}
          >
            Curately
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
            <button
              type="button"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main
          className={`flex-1 overflow-y-auto ${theme.bg} ${theme.text} transition-colors duration-300`}
        >
          {children}
        </main>

        {/* Mobile Bottom Navigation - Hidden on desktop */}
        <nav className="md:hidden h-16 flex items-center justify-around border-t border-border bg-background safe-area-pb">
          <BottomNavItem icon={<Home className="w-6 h-6" />} label="Home" active />
          <BottomNavItem icon={<FileText className="w-6 h-6" />} label="Media Kit" />
          <BottomNavItem icon={<User className="w-6 h-6" />} label="Profile" />
        </nav>
      </div>
    </div>
  );
}

/* Sidebar Navigation Item Component */
function SidebarNavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
        ${
          active
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/* Mobile Bottom Navigation Item Component */
function BottomNavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`
        flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors
        ${
          active
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

