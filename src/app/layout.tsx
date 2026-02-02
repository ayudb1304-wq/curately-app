import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StudioLayout } from "@/components/studio-layout";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";

export const metadata: Metadata = {
  title: "Unified Creator OS",
  description: "Curately Creator Operating System",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zooming to feel like a native app
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full overflow-hidden">
      <body className="h-full w-full overflow-hidden antialiased bg-white dark:bg-slate-950">
        <ThemeProvider>
          <StudioLayout>
            {children}
            <PWAInstallPrompt />
          </StudioLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
