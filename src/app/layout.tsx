import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StudioLayout } from "@/components/studio-layout";
import { PWAInstallPrompt } from "@/components/shared/pwa-install-prompt";
import { cn } from "@/lib/utils";
import { AppSessionProvider } from "@/components/session-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // NOTE: Root layout stays server-side; we hydrate a client SessionProvider for `useSession`.
  return (
    <html lang="en">
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
      >
        <ThemeProvider>
          <AppSessionProvider session={null}>
            <StudioLayout>
              {children}
              <PWAInstallPrompt />
            </StudioLayout>
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
