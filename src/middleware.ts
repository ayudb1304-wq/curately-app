/**
 * NextAuth v5 Middleware for Curately Creator OS
 * 
 * Uses Edge-compatible auth configuration to protect routes.
 * Route protection logic is handled by the `authorized` callback
 * in auth.config.ts.
 * 
 * Protected Routes:
 * - /admin/* - Admin dashboard and management pages
 * - /invoicer/* - Signal Invoicer tool (Phase 1 data ingestion)
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Match protected routes
  matcher: ["/admin/:path*", "/invoicer/:path*"],
};
