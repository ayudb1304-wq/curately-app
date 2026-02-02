"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Theme, ThemeKey } from "@/types/theme";
import { THEMES } from "@/lib/themes";

interface ThemeContextType {
  theme: Theme;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "curately.theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>(() => {
    if (typeof window === "undefined") return "noir";
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    return saved && saved in THEMES ? saved : "noir";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = activeThemeKey;
    window.localStorage.setItem(STORAGE_KEY, activeThemeKey);
  }, [activeThemeKey]);

  const setTheme = (key: ThemeKey) => {
    setActiveThemeKey(key);
  };

  const theme = useMemo(() => THEMES[activeThemeKey], [activeThemeKey]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {/* 
        The layout handling has been moved to src/app/layout.tsx to support the "Void/Frame" architecture.
        This provider now strictly manages state and font injection.
      */}
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

