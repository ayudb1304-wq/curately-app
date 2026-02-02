/**
 * Sign-In Page
 * 
 * Server Component that checks if user is already authenticated.
 * If authenticated, redirects to dashboard. Otherwise, renders sign-in form.
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "./signin-form";

export default async function SignInPage() {
  // Server-side: Check if user is already authenticated
  const session = await auth();

  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect("/");
  }

  // Render sign-in form for unauthenticated users
  return <SignInForm />;
}
