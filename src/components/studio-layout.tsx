"use client";

import { useTheme } from "@/components/theme-provider";

export function StudioLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen w-full flex justify-center items-start transition-colors duration-500 bg-zinc-100 dark:bg-zinc-900`}>
      {/* 
        Desktop "Studio Frame" Container 
        - On mobile: w-full, h-full, no rounded corners
        - On desktop: max-w-[430px], rounded-xl, shadow, border
      */}
      <div 
        className={`
          w-full min-h-screen 
          md:max-w-[430px] md:my-8 md:min-h-[90vh] md:h-auto md:rounded-[3rem] md:border-8 md:border-zinc-900 md:shadow-2xl
          ${theme.bg} ${theme.text} transition-colors duration-500 overflow-hidden relative
        `}
        style={{ fontFamily: theme.bodyFont }}
      >
        {children}
      </div>
    </div>
  );
}

