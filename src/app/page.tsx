/**
 * Home Page - Creator Dashboard
 *
 * Server Component that fetches session and YouTube data,
 * then renders the home dashboard with Media Kit preview.
 * 
 * Note: Authentication is handled by middleware - if user reaches
 * this page, they are authenticated.
 */

import { auth } from "@/auth";
import { getYouTubeProfile } from "@/app/_actions/youtube";
import { HomeDashboard } from "@/components/home-dashboard";

export default async function HomePage() {
  // Server-side: Get authenticated session
  // Middleware ensures user is authenticated before reaching here
  const session = await auth();

  // Server-side: Fetch YouTube profile data
  const youtubeData = await getYouTubeProfile();

  // Extract user data from session (with safe defaults)
  const internalUid = session?.user?.internal_uid || "";
  const username = session?.user?.username || null;

  return (
    <HomeDashboard
      userName={session?.user?.name}
      username={username}
      internalUid={internalUid}
      youtubeData={youtubeData}
    />
  );
}
