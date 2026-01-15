/**
 * Auth.js (NextAuth) v5 Configuration for Curately Creator OS
 * 
 * Configures authentication with:
 * - Prisma Adapter for database persistence
 * - Google (YouTube) provider for initial OAuth testing
 * - Secure session handling with JWT strategy
 * 
 * Future providers: Instagram Business, TikTok Creator
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  
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
     * Extend session with user ID and internal UID for API calls
     */
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },

    /**
     * Control which users can sign in
     * Can be extended to implement waitlist or invite-only access
     */
    async signIn({ account }) {
      // Allow all sign-ins for now
      // Future: Check waitlist, verify creator status, etc.
      if (account?.provider === "google") {
        // Mark as YouTube platform type in the future
        return true;
      }
      return true;
    },
  },

  events: {
    /**
     * Handle post-account-link events
     * Use this to encrypt and store refresh tokens
     */
    async linkAccount({ user, account }) {
      // Future: Encrypt refresh_token and store in encrypted_refresh_token field
      // const { encryptToken } = await import("@/lib/encryption");
      // if (account.refresh_token) {
      //   await prisma.account.update({
      //     where: { provider_providerAccountId: { provider: account.provider, providerAccountId: account.providerAccountId } },
      //     data: { encrypted_refresh_token: encryptToken(account.refresh_token) }
      //   });
      // }
      console.log(`[Auth] Account linked for user ${user.id}: ${account.provider}`);
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  session: {
    strategy: "database",
  },

  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

