"use server";

/**
 * YouTube API Server Actions for Curately Creator OS
 *
 * Handles YouTube Data API connectivity verification and profile fetching.
 * Uses google-auth-library for OAuth2 token refresh and API calls.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { decryptToken } from "@/lib/encryption";
import { OAuth2Client } from "google-auth-library";

// Type definitions for the server action response
export type YouTubeProfileResult =
  | {
      success: true;
      channelTitle: string;
      subscriberCount: string;
      channelId: string;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Fetches the current user's YouTube channel profile.
 *
 * Flow:
 * 1. Get current session
 * 2. Query Prisma for YouTube account
 * 3. Decrypt the stored refresh token
 * 4. Use google-auth-library to refresh the access token
 * 5. Call YouTube Data API
 * 6. Return channel info or error
 */
export async function getYouTubeProfile(): Promise<YouTubeProfileResult> {
  // Step 1: Get current session
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "Not authenticated - please sign in",
    };
  }

  // Step 2: Query Prisma for YouTube account
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      platform_type: "YOUTUBE",
    },
    select: {
      encrypted_refresh_token: true,
      access_token: true,
      expires_at: true,
    },
  });

  if (!account) {
    return {
      success: false,
      error: "No YouTube account linked",
    };
  }

  if (!account.encrypted_refresh_token) {
    return {
      success: false,
      error: "No refresh token stored - reauthorize required",
    };
  }

  // Step 3: Decrypt the stored refresh token
  let refreshToken: string;
  try {
    refreshToken = decryptToken(account.encrypted_refresh_token);
  } catch (error) {
    console.error("[YouTube Action] Decryption failed:", error);
    return {
      success: false,
      error: "Security Error: Key Mismatch",
    };
  }

  // Step 4: Use google-auth-library to refresh the access token
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  let accessToken: string;
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    if (!credentials.access_token) {
      throw new Error("No access token returned from refresh");
    }
    accessToken = credentials.access_token;
  } catch (error) {
    console.error("[YouTube Action] Token refresh failed:", error);
    return {
      success: false,
      error: "OAuth Scope Missing: Ensure youtube.readonly is active",
    };
  }

  // Step 5: Call YouTube Data API
  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[YouTube Action] API error:", response.status, errorData);

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error: "OAuth Scope Missing: Ensure youtube.readonly is active",
        };
      }

      return {
        success: false,
        error: `YouTube API error: ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return {
        success: false,
        error: "No YouTube channel found for this account",
      };
    }

    const channel = data.items[0];

    // Step 6: Return channel info
    return {
      success: true,
      channelTitle: channel.snippet?.title || "Unknown Channel",
      subscriberCount: formatSubscriberCount(
        channel.statistics?.subscriberCount || "0"
      ),
      channelId: channel.id,
    };
  } catch (error) {
    console.error("[YouTube Action] API call failed:", error);
    return {
      success: false,
      error: "Failed to connect to YouTube API",
    };
  }
}

/**
 * Formats subscriber count with K/M suffix for display
 */
function formatSubscriberCount(count: string): string {
  const num = parseInt(count, 10);
  if (isNaN(num)) return "0";

  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return count;
}

