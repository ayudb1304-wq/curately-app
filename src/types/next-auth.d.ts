/**
 * NextAuth.js Type Augmentations for Curately Creator OS
 * 
 * Extends the default Auth.js types to include our Identity Graph fields.
 * The `internal_uid` is the "Golden Record" identifier used across the platform.
 */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extended Session interface with Identity Graph fields
   */
  interface Session {
    user: {
      /** Database user ID (cuid) */
      id: string;
      /** Golden Record identifier (UUID) - used for PWA analytics and cross-platform identity */
      internal_uid: string;
    } & DefaultSession["user"];
  }
}

