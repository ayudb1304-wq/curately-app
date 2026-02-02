
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handler = (e: Event) => {
      const event = e as BeforeInstallPromptEvent;
      event.preventDefault();
      setDeferredPrompt(event);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[350px]
      p-4 rounded-2xl shadow-2xl z-50
      ${theme.card} border ${theme.cardBorder}
      animate-in slide-in-from-bottom-10 fade-in duration-500
    `}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-sm">Install App</h3>
          <p className={`text-xs ${theme.subtext}`}>Add to home screen for the best experience.</p>
        </div>
        <button onClick={() => setShowPrompt(false)} className="text-slate-400">
          <X size={16} />
        </button>
      </div>
      <button 
        onClick={handleInstallClick}
        className={`w-full py-3 rounded-xl ${theme.accentBg} text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2`}
      >
        <Download size={14} />
        Install
      </button>
    </div>
  );
}

