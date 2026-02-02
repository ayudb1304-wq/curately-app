/**
 * Admin Dashboard - Identity Engine
 *
 * Server Component that fetches YouTube profile data and session info,
 * then passes them to the themed client component for rendering.
 * 
 * Note: Authentication is handled by middleware - if user reaches
 * this page, they are authenticated.
 */

import { auth } from "@/auth";
import { getYouTubeProfile } from "@/app/_actions/youtube";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export default async function AdminDashboard() {
  // Server-side: Get authenticated session
  // Middleware ensures user is authenticated before reaching here
  const session = await auth();

  // Server-side: Fetch YouTube profile data
  const youtubeData = await getYouTubeProfile();

  // Extract internal_uid (Golden Record identifier) from session
  const internalUid = session?.user?.internal_uid || "";

  return (
    <AdminDashboardClient
      youtubeData={youtubeData}
      internalUid={internalUid}
      userName={session?.user?.name}
    />
  );
}
