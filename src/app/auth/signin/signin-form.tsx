"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Google "G" logo SVG component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="20"
      height="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      // If signIn throws, reset loading state
      setIsLoading(false);
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 py-12">
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-8">
        {/* Logo / Brand */}
        <div className="space-y-2">
          <h1
            className="text-5xl text-white drop-shadow-[0_0_8px_rgba(163,230,53,0.4)]"
            style={{ fontFamily: "'Loved by the King', cursive" }}
          >
            Curately
          </h1>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2
            className="text-2xl font-semibold text-white tracking-tight"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enter the Studio
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
            Securely connect your platforms to sync your Live Media Kit.
          </p>
        </div>

        {/* Sign-in Button */}
        <div className="w-full pt-4">
          <Button
            onClick={handleSignIn}
            disabled={isLoading}
            size="lg"
            className="w-full h-12 bg-lime-400 text-black font-medium rounded-xl hover:bg-lime-300 transition-all duration-200 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Entering...</span>
              </>
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
        </div>

        {/* Terms & Privacy */}
        <div className="pt-8 space-y-4">
          <p className="text-zinc-600 text-xs leading-relaxed">
            By continuing, you agree to our{" "}
            <Link
              href="/terms"
              className="text-zinc-400 hover:text-lime-400 underline underline-offset-2 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-zinc-400 hover:text-lime-400 underline underline-offset-2 transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Data Sovereignty Statement */}
          <div className="flex items-center justify-center gap-2 text-zinc-500 text-xs">
            <svg
              className="w-4 h-4 text-lime-400/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-zinc-400">
              Data Sovereignty: You own your data. We just verify it.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

