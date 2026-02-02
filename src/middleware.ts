/**
 * NextAuth v5 Middleware for Curately Creator OS
 * 
 * Uses Edge-compatible auth configuration to protect routes.
 * Route protection logic is handled by the `authorized` callback
 * in auth.config.ts.
 * 
 * Protected Routes:
 * - / - Home dashboard (requires auth)
 * - /admin/* - Admin dashboard and management pages
 * - /invoices/* - Invoice management
 * - /settings/* - User settings
 */

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Match protected routes - exclude auth routes and public pages
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth API routes)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, manifest, etc.
     * - Public media kit pages (handled by [username] route)
     */
    "/((?!api/auth|auth|_next/static|_next/image|favicon.ico|manifest|.*\\..*$).*)",
  ],
};
