"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration. Check if all environment variables are set correctly (AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET).",
  AccessDenied: "Access was denied. You may not have permission to sign in.",
  Verification: "The verification link has expired or has already been used.",
  OAuthSignin: "Error during OAuth sign-in. Try again.",
  OAuthCallback: "Error during OAuth callback. Check that your Google Cloud Console callback URL matches: http://localhost:3000/api/auth/callback/google",
  OAuthCreateAccount: "Could not create OAuth account. The email may already be linked to another account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "Error in the OAuth callback handler.",
  OAuthAccountNotLinked: "This email is already associated with another account. Sign in with the original provider.",
  EmailSignin: "Error sending the email sign-in link.",
  CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An unexpected authentication error occurred.",
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const errorMessage = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-foreground">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            {errorMessage}
          </p>
        </div>

        {error === "Configuration" && (
          <div className="bg-muted/50 rounded-lg p-4 text-left text-sm space-y-2">
            <p className="font-semibold">Common causes:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Missing <code className="bg-muted px-1 rounded">AUTH_SECRET</code> in .env.local</li>
              <li>Missing <code className="bg-muted px-1 rounded">GOOGLE_CLIENT_ID</code></li>
              <li>Missing <code className="bg-muted px-1 rounded">GOOGLE_CLIENT_SECRET</code></li>
              <li>Database not migrated (run <code className="bg-muted px-1 rounded">npx prisma db push</code>)</li>
              <li>OAuth callback URL mismatch in Google Console</li>
            </ul>
          </div>
        )}

        {error === "OAuthCallback" && (
          <div className="bg-muted/50 rounded-lg p-4 text-left text-sm space-y-2">
            <p className="font-semibold">Required callback URL in Google Console:</p>
            <code className="block bg-muted px-2 py-1 rounded text-xs break-all">
              http://localhost:3000/api/auth/callback/google
            </code>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Return Home
          </Link>
        </div>

        <p className="text-xs text-muted-foreground">
          Error code: <code className="bg-muted px-1 rounded">{error}</code>
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}

