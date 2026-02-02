"use server";

/**
 * Data Sovereignty Actions (Phase 1)
 *
 * Implements a "hard delete" of user PII and revocation of all linked tokens by
 * deleting the User record. Prisma cascading deletes ensure:
 * - Accounts (OAuth tokens, encrypted refresh tokens)
 * - Sessions
 * - Audience snapshots
 *
 * This is intentionally irreversible.
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type SovereigntyNukeResult =
  | { success: true }
  | { success: false; error: string };

export async function hardDeleteMyData(): Promise<SovereigntyNukeResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await prisma.user.delete({
      where: { id: session.user.id },
    });
    return { success: true };
  } catch (error) {
    console.error("[Sovereignty] hardDeleteMyData failed:", error);
    return { success: false, error: "Delete failed" };
  }
}

