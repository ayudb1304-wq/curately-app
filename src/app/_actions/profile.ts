"use server";

/**
 * Server Actions for Profile Management
 * 
 * Handles username and profile image updates with validation.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Username validation regex: alphanumeric, underscores, 3-30 characters
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  "admin",
  "api",
  "auth",
  "settings",
  "invoices",
  "home",
  "dashboard",
  "profile",
  "account",
  "curately",
  "support",
  "help",
  "about",
  "terms",
  "privacy",
  "legal",
];

export type ProfileUpdateResult =
  | { success: true; username?: string; image?: string }
  | { success: false; error: string; field?: "username" | "image" };

/**
 * Validate username format and availability
 */
function validateUsername(username: string): { valid: true } | { valid: false; error: string } {
  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters." };
  }

  if (trimmed.length > 30) {
    return { valid: false, error: "Username must be 30 characters or less." };
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, and underscores.",
    };
  }

  if (RESERVED_USERNAMES.includes(trimmed)) {
    return { valid: false, error: "This username is reserved." };
  }

  return { valid: true };
}

/**
 * Check if a username is available (not taken by another user)
 */
async function isUsernameAvailable(username: string, currentUserId: string): Promise<boolean> {
  const existing = await prisma.user.findFirst({
    where: {
      username: username.toLowerCase(),
      NOT: { id: currentUserId },
    },
    select: { id: true },
  });

  return !existing;
}

/**
 * Update user profile (username and/or image)
 * 
 * @param data - Object containing optional username and imageUrl fields
 * @returns Result object with success status and updated fields or error
 */
export async function updateProfile(data: {
  username?: string;
  imageUrl?: string;
}): Promise<ProfileUpdateResult> {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "You must be signed in to update your profile." };
    }

    const userId = session.user.id;
    const updates: { username?: string; image?: string } = {};

    // Handle username update
    if (data.username !== undefined) {
      const trimmedUsername = data.username.trim().toLowerCase();

      // Skip validation if username is empty (clearing username)
      if (trimmedUsername === "") {
        updates.username = null as unknown as string; // Clear username
      } else {
        // Validate format
        const validation = validateUsername(trimmedUsername);
        if (!validation.valid) {
          return { success: false, error: validation.error, field: "username" };
        }

        // Check availability
        const available = await isUsernameAvailable(trimmedUsername, userId);
        if (!available) {
          return {
            success: false,
            error: "This username is already taken.",
            field: "username",
          };
        }

        updates.username = trimmedUsername;
      }
    }

    // Handle image URL update
    if (data.imageUrl !== undefined) {
      // Basic URL validation
      if (data.imageUrl && !data.imageUrl.startsWith("http")) {
        return {
          success: false,
          error: "Invalid image URL.",
          field: "image",
        };
      }
      updates.image = data.imageUrl || null as unknown as string;
    }

    // Perform database update if there are changes
    if (Object.keys(updates).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: updates,
      });

      // Revalidate settings page to reflect changes
      revalidatePath("/settings");
      revalidatePath("/"); // Also revalidate home where profile might be shown
    }

    return {
      success: true,
      username: updates.username ?? undefined,
      image: updates.image ?? undefined,
    };
  } catch (error) {
    console.error("[Profile] Update error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Check if a username is available (public endpoint for real-time validation)
 */
export async function checkUsernameAvailability(
  username: string
): Promise<{ available: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { available: false, error: "Not authenticated" };
    }

    const trimmed = username.trim().toLowerCase();
    
    // Validate format first
    const validation = validateUsername(trimmed);
    if (!validation.valid) {
      return { available: false, error: validation.error };
    }

    // Check database
    const available = await isUsernameAvailable(trimmed, session.user.id);
    return { available };
  } catch (error) {
    console.error("[Profile] Username check error:", error);
    return { available: false, error: "Failed to check username" };
  }
}

