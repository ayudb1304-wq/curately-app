"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme, ThemeKey } from "@/types/theme";
import { THEMES, GOOGLE_FONTS_URLS } from "@/lib/themes";

interface ThemeContextType {
  theme: Theme;
  setTheme: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeThemeKey, setActiveThemeKey] = useState<ThemeKey>("noir");

  // Load all fonts on mount to ensure instant switching (as per sample logic)
  // or we could load them dynamically. Given the "instant" requirement, preloading is better.
  useEffect(() => {
    GOOGLE_FONTS_URLS.forEach((url) => {
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, []);

  const setTheme = (key: ThemeKey) => {
    setActiveThemeKey(key);
  };

  const theme = THEMES[activeThemeKey];

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

