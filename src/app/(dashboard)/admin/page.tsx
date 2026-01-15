/**
 * Admin Dashboard - Identity Engine
 *
 * Server Component that fetches YouTube profile data and session info,
 * then passes them to the themed client component for rendering.
 */

import { auth } from "@/auth";
import { getYouTubeProfile } from "@/app/_actions/youtube";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  // Server-side: Get authenticated session
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Server-side: Fetch YouTube profile data
  const youtubeData = await getYouTubeProfile();

  // Extract internal_uid (Golden Record identifier) from session
  const internalUid = session.user.internal_uid || "Not assigned";

  return (
    <AdminDashboardClient
      youtubeData={youtubeData}
      internalUid={internalUid}
      userName={session.user.name}
    />
  );
}
