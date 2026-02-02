"use client";

/**
 * Profile Editor Component
 * 
 * Allows users to edit their username and upload a profile picture.
 * Uses Supabase Storage for image uploads and server actions for profile updates.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { Camera, Check, Loader2, X, AtSign, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { uploadAvatar } from "@/lib/supabase";
import { updateProfile, checkUsernameAvailability } from "@/app/_actions/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function initialsFromName(name: string | null | undefined) {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "C";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase();
}

interface ProfileEditorProps {
  session: Session | null;
}

export function ProfileEditor({ session: sessionProp }: ProfileEditorProps) {
  const { theme } = useTheme();
  const { data: sessionHook, update: updateSession } = useSession();
  const session = sessionProp ?? sessionHook ?? null;

  // Form state
  const [username, setUsername] = useState(session?.user?.username ?? "");
  const [imageUrl, setImageUrl] = useState(session?.user?.image ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  // Track if form has changes
  const hasChanges =
    username !== (session?.user?.username ?? "") ||
    imageUrl !== (session?.user?.image ?? "") ||
    imagePreview !== null;

  // Debounced username availability check
  const checkUsername = useCallback(
    async (value: string) => {
      if (!value || value.length < 3) {
        setUsernameAvailable(null);
        return;
      }

      // Don't check if it's the current username
      if (value.toLowerCase() === session?.user?.username?.toLowerCase()) {
        setUsernameAvailable(true);
        return;
      }

      setIsCheckingUsername(true);
      const result = await checkUsernameAvailability(value);
      setIsCheckingUsername(false);

      if (result.error) {
        setUsernameAvailable(false);
      } else {
        setUsernameAvailable(result.available);
      }
    },
    [session?.user?.username]
  );

  // Handle username input changes with debounce
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(value);
    setError(null);
    setSuccess(null);
    setUsernameAvailable(null);

    // Clear existing timeout
    if (usernameCheckTimeout.current) {
      clearTimeout(usernameCheckTimeout.current);
    }

    // Set new timeout for availability check
    if (value.length >= 3) {
      usernameCheckTimeout.current = setTimeout(() => {
        checkUsername(value);
      }, 500);
    }
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    if (!session?.user?.id) {
      setError("You must be signed in to upload an image.");
      setImagePreview(null);
      return;
    }

    setIsUploading(true);
    const result = await uploadAvatar(file, session.user.id);
    setIsUploading(false);

    if (!result.success) {
      setError(result.error);
      setImagePreview(null);
      return;
    }

    setImageUrl(result.url);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Create a synthetic event to reuse handleFileSelect logic
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const updates: { username?: string; imageUrl?: string } = {};

    if (username !== (session?.user?.username ?? "")) {
      updates.username = username;
    }

    if (imageUrl !== (session?.user?.image ?? "")) {
      updates.imageUrl = imageUrl;
    }

    const result = await updateProfile(updates);

    setIsSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // Clear preview since the image is now saved
    setImagePreview(null);
    setSuccess("Profile updated successfully!");

    // Update the session to reflect changes
    await updateSession();

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameCheckTimeout.current) {
        clearTimeout(usernameCheckTimeout.current);
      }
    };
  }, []);

  const displayImage = imagePreview || imageUrl || session?.user?.image;

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-4">
        {/* Avatar Upload Button - Fixed size container */}
        <button
          type="button"
          className={cn(
            "relative group cursor-pointer shrink-0 rounded-2xl p-[3px]",
            theme.accentBg
          )}
          style={{ width: 72, height: 72 }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div 
            className="relative rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
            style={{ width: 66, height: 66 }}
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={session?.user?.name ?? "Profile"}
                width={66}
                height={66}
                className="object-cover"
                style={{ width: 66, height: 66 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-black text-zinc-500 dark:text-zinc-400">
                {initialsFromName(session?.user?.name)}
              </div>
            )}

            {/* Upload overlay */}
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity",
                isUploading && "opacity-100"
              )}
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Camera className="h-5 w-5 text-white" />
              )}
            </div>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Profile Picture Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            Profile Picture
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Click or drag & drop. Max 5MB.
          </p>
          {imagePreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 h-7 px-2 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              onClick={() => {
                setImagePreview(null);
                setImageUrl(session?.user?.image ?? "");
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Username Section */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Username
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            <AtSign className="h-4 w-4" />
          </div>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="your_username"
            maxLength={30}
            className={cn(
              "pl-9 pr-10 font-mono text-sm",
              "border-zinc-200/60 dark:border-zinc-800/80",
              "bg-white/60 dark:bg-zinc-950/20",
              usernameAvailable === false && "border-red-500 focus-visible:ring-red-500",
              usernameAvailable === true && username !== (session?.user?.username ?? "") && "border-emerald-500 focus-visible:ring-emerald-500"
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isCheckingUsername && (
              <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
            )}
            {!isCheckingUsername && usernameAvailable === true && username !== (session?.user?.username ?? "") && (
              <Check className="h-4 w-4 text-emerald-500" />
            )}
            {!isCheckingUsername && usernameAvailable === false && (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          3-30 characters. Letters, numbers, and underscores only.
          {username && (
            <span className="ml-1">
              Your profile URL: <span className="font-mono text-zinc-700 dark:text-zinc-300">curately.app/{username || "username"}</span>
            </span>
          )}
        </p>
        {usernameAvailable === false && !isCheckingUsername && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            This username is not available
          </p>
        )}
      </div>

      {/* Display Name (read-only) */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
          Display Name
        </Label>
        <Input
          type="text"
          value={session?.user?.name ?? ""}
          disabled
          className="font-medium text-sm border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 cursor-not-allowed"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          This is synced from your Google account and cannot be changed here.
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="rounded-xl border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-3">
          <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
          <p className="text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            {success}
          </p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isSaving || isUploading || usernameAvailable === false}
          className={cn(
            "min-w-[120px]",
            theme.accentBg,
            theme.id === "cyber" ? "text-black" : "text-white"
          )}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

