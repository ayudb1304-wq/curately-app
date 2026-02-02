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
const DEFAULT_THEME: ThemeKey = "noir";

// Themes that should activate dark mode (for Tailwind's dark: variants)
const DARK_THEMES: ThemeKey[] = ["cyber"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always start with default theme to avoid hydration mismatch
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  // Load saved theme from localStorage after mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeKey | null;
    if (saved && saved in THEMES) {
      setActiveThemeKey(saved);
    }
  }, []);

  // Update document, localStorage, and dark mode class when theme changes
  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      
      // Set the data-theme attribute for CSS variable overrides
      root.dataset.theme = activeThemeKey;
      
      // Toggle the 'dark' class for Tailwind's dark: variants
      if (DARK_THEMES.includes(activeThemeKey)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      window.localStorage.setItem(STORAGE_KEY, activeThemeKey);
    }
  }, [activeThemeKey, mounted]);

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

