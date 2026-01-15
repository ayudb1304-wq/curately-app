"use client";

import { useTheme } from "@/components/theme-provider";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
  const { theme } = useTheme();
  const params = useParams();
  const username = params.username as string;

  return (
    <div className={`min-h-screen p-8 flex flex-col items-center justify-center ${theme.bg} ${theme.text}`}>
       <h1 
          className="text-6xl mb-4 text-center"
          style={{ fontFamily: theme.signatureFont }}
        >
          {username}
        </h1>
        <p className={`text-sm font-bold uppercase tracking-widest ${theme.subtext}`}>
          Live Media Kit
        </p>
    </div>
  );
}

