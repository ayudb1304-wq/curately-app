/**
 * Auth.js Route Handlers
 * 
 * Exposes the NextAuth API routes at /api/auth/*
 * Handles: signin, signout, callback, session, csrf, providers
 */

import { handlers } from "@/auth";

export const { GET, POST } = handlers;

