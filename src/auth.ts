/**
 * Auth.js (NextAuth) v5 Configuration for Curately Creator OS
 * 
 * Configures authentication with:
 * - Prisma Adapter for database persistence
 * - JWT session strategy (required for Edge Runtime compatibility)
 * - AES-256-GCM encryption for OAuth refresh tokens
 * 
 * This file extends the Edge-compatible auth.config.ts with database
 * and Node.js-specific functionality.
 * 
 * Future providers: Instagram Business, TikTok Creator
 */

import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { encryptToken } from "@/lib/encryption";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  callbacks: {
    ...authConfig.callbacks,

    /**
     * JWT callback - Persist user ID in the token
     * Required when using JWT strategy
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    /**
     * Extend session with user ID, internal UID (Golden Record), username, and image for API calls
     * With JWT strategy, we receive token instead of user
     */
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;

        try {
          // Fetch user data from database for profile information
          // This includes internal_uid, username, and custom profile image
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { 
              internal_uid: true,
              username: true,
              image: true,
            },
          });

          if (dbUser) {
            session.user.internal_uid = dbUser.internal_uid;
            session.user.username = dbUser.username ?? null;
            
            // Use database image if available (user may have uploaded custom avatar)
            // This overrides the OAuth provider's default profile picture
            if (dbUser.image) {
              session.user.image = dbUser.image;
            }
          }
        } catch (error) {
          console.error("[Auth] Error fetching user data for session:", error);
          // Set defaults if database query fails
          session.user.internal_uid = "";
          session.user.username = null;
        }
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
        // Google accounts are mapped to YOUTUBE platform type in linkAccount event
        return true;
      }
      return true;
    },

    /**
     * PHASE 2 PLACEHOLDER: Refresh Token Rotation
     * 
     * When implementing persistent background syncing, add token rotation logic here:
     * - Check if access_token is expired
     * - Use decryptToken() to retrieve the stored refresh_token
     * - Call the provider's token refresh endpoint
     * - Re-encrypt and store the new refresh_token
     * - Update access_token and expires_at in the database
     * 
     * Reference: https://authjs.dev/guides/refresh-token-rotation
     */
  },

  events: {
    /**
     * Handle post-account-link events
     * Encrypts refresh tokens and maps platform types for Identity Graph
     */
    async linkAccount({ user, account }) {
      // Platform normalization: Map provider to PlatformType enum
      const platformType = account.provider === "google" ? "YOUTUBE" : null;

      // Encrypt refresh_token if present and store securely
      if (account.refresh_token) {
        const encryptedRefreshToken = encryptToken(account.refresh_token);

        await prisma.account.update({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          data: {
            encrypted_refresh_token: encryptedRefreshToken,
            platform_type: platformType,
            // Clear raw refresh_token to prevent plain-text storage
            refresh_token: null,
          },
        });

        console.log(`[Identity Graph] Refresh token encrypted and secured for ${account.provider}`);
      } else {
        // Still set platform_type even if no refresh_token
        await prisma.account.update({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          data: {
            platform_type: platformType,
          },
        });
      }

      console.log(`[Auth] Account linked for user ${user.id}: ${account.provider}`);
    },
  },
});
