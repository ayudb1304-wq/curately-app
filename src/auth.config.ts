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
     * @returns true to allow, false to redirect to signIn
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/admin") ||
        nextUrl.pathname.startsWith("/invoicer") ||
        nextUrl.pathname.startsWith("/settings");

      if (isProtectedRoute) {
        // Require authentication for protected routes
        return isLoggedIn;
      }

      // Allow all other routes
      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;

