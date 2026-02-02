/**
 * Edge-Compatible Auth.js Configuration for Curately Creator OS
 * 
 * This file contains ONLY Edge Runtime compatible code:
 * - Provider configuration (Google/YouTube)
 * - Authorization callback for route protection
 * - Custom pages configuration
 * 
 * IMPORTANT: Do NOT import Prisma, encryption utilities, or any Node.js-only
 * modules here. This file is used by middleware which runs on Edge Runtime.
 */

import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request YouTube-specific scopes for creator data access
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/yt-analytics.readonly",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    // Future providers will be added here:
    // Instagram Business API
    // TikTok Creator API
  ],

  callbacks: {
    /**
     * Authorization callback for middleware route protection.
     * Called by Edge Runtime to determine if a request should proceed.
     * 
     * @returns true to allow, false to redirect to signIn, or Response to redirect elsewhere
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      // Check if user is on auth pages (sign-in, error, etc.) but NOT api/auth routes
      const isAuthPage = pathname.startsWith("/auth") && !pathname.startsWith("/api/auth");
      
      // Redirect authenticated users away from auth pages (defense-in-depth)
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/", nextUrl));
      }
      
      // Public routes that don't require authentication
      const isPublicRoute = 
        pathname.startsWith("/auth") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/_next") ||
        pathname === "/favicon.ico" ||
        pathname === "/manifest.webmanifest";
      
      // Allow public routes
      if (isPublicRoute) {
        return true;
      }

      // Protected app routes
      const isProtectedRoute =
        pathname === "/" ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/invoices") ||
        pathname.startsWith("/settings");

      if (isProtectedRoute) {
        // Require authentication for protected routes
        return isLoggedIn;
      }

      // All other routes (like public [username] pages) are allowed
      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

