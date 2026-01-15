"use client";

import { useTheme } from "@/components/theme-provider";
import { THEMES } from "@/lib/themes";
import { ThemeKey } from "@/types/theme";
import { CheckCircle2 } from "lucide-react";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`p-6 rounded-3xl border ${theme.cardBorder} ${theme.card} shadow-sm`}>
      <h2 className="text-xl font-bold mb-2">Theme Controller</h2>
      <p className={`text-sm mb-6 ${theme.subtext}`}>Select a preset to inject styles.</p>
      
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
          const t = THEMES[key];
          const isActive = theme.id === t.id;
          
          return (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`
                relative p-4 rounded-2xl border-2 text-left transition-all group
                ${isActive 
                  ? `border-${t.accent} bg-white shadow-lg scale-[1.02]` 
                  : 'border-transparent bg-black/5 hover:bg-black/10'
                }
              `}
            >
              <div 
                className={`text-lg mb-1 ${isActive ? t.accentText : 'text-slate-600'}`}
                style={{ fontFamily: t.signatureFont }}
              >
                {t.name.split(' ')[0]}
              </div>
              {isActive && (
                <div className={`absolute top-3 right-3 ${t.accentText}`}>
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

