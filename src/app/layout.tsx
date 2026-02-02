import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StudioLayout } from "@/components/studio-layout";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";
import { cn } from "@/lib/utils";
import { AppSessionProvider } from "@/components/session-provider";
import { auth } from "@/auth";
import {
  Inter,
  Playfair_Display,
  Space_Grotesk,
  JetBrains_Mono,
  Quicksand,
  Archivo_Black,
} from "next/font/google";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
  weight: "400",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session server-side to hydrate SessionProvider immediately
  // This ensures client components have session data on first render
  const session = await auth();

  return (
    <html lang="en" data-theme="noir" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased bg-background text-foreground",
          inter.variable,
          playfair.variable,
          space.variable,
          jetbrains.variable,
          quicksand.variable,
          archivoBlack.variable
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AppSessionProvider session={session}>
            <StudioLayout session={session}>
              {children}
              <PWAInstallPrompt />
            </StudioLayout>
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
