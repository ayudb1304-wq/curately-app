"use client";

import { useTheme } from "@/components/theme-provider";
import { THEMES } from "@/lib/themes";
import { ThemeKey } from "@/types/theme";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const themeHeadingFontFamily: Record<ThemeKey, string> = {
  noir: "var(--font-playfair)",
  cyber: "var(--font-space)",
  muse: "var(--font-quicksand)",
  pop: "var(--font-archivo-black)",
};

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 rounded-3xl border border-border bg-card shadow-sm">
      <h2 className="text-xl font-bold mb-2 text-foreground">Theme Controller</h2>
      <p className="text-sm mb-6 text-muted-foreground">Select a preset to inject styles.</p>
      
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
          const t = THEMES[key];
          const isActive = theme.id === t.id;
          
          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={cn(
                "relative p-4 rounded-2xl border-2 text-left transition-all group",
                isActive 
                  ? cn("border-primary bg-card shadow-lg scale-[1.02]", t.accentText)
                  : "border-transparent bg-muted/50 hover:bg-muted text-muted-foreground"
              )}
            >
              <div 
                className={cn(
                  "text-lg mb-1",
                  isActive ? t.accentText : "text-muted-foreground"
                )}
                style={{ fontFamily: themeHeadingFontFamily[key] }}
              >
                {t.name.split(' ')[0]}
              </div>
              {isActive && (
                <div className={cn("absolute top-3 right-3", t.accentText)}>
                  <CheckCircle2 size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

