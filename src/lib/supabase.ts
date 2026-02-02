/**
 * Supabase Client for Curately Creator OS
 * 
 * Used for file uploads (avatar images) to Supabase Storage.
 * 
 * Required environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Public anon key for client-side operations
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Supabase] Missing environment variables. Avatar uploads will not work.",
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

/**
 * Supabase client for browser-side operations (file uploads)
 * This uses the anon key which has limited permissions based on RLS policies
 */
export const supabase = createClient(
  supabaseUrl || "",
  supabaseAnonKey || ""
);

/**
 * Storage bucket name for avatar images
 * Must be created in Supabase dashboard with public access
 */
export const AVATAR_BUCKET = "avatars";

/**
 * Generate a public URL for an avatar stored in Supabase Storage
 * @param path - The file path within the avatars bucket
 * @returns The public URL for the avatar
 */
export function getAvatarUrl(path: string): string {
  if (!supabaseUrl) return "";
  
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload an avatar image to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID (used to create unique file path)
 * @returns Object with success status and either the public URL or error message
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      error: "Supabase is not configured. Please set environment variables.",
    };
  }

  // Validate file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
    };
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      success: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  // Generate unique filename with timestamp to bust cache
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  try {
    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("[Supabase] Upload error:", uploadError);
      return {
        success: false,
        error: uploadError.message || "Failed to upload image.",
      };
    }

    // Get public URL
    const url = getAvatarUrl(fileName);
    return { success: true, url };
  } catch (err) {
    console.error("[Supabase] Unexpected error:", err);
    return {
      success: false,
      error: "An unexpected error occurred during upload.",
    };
  }
}

