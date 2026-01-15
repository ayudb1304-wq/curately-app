/**
 * Prisma Client Singleton for Next.js
 * 
 * Prevents connection pooling issues in development mode where
 * Next.js hot reloading would create multiple Prisma Client instances.
 * 
 * In production, a single instance is created and reused.
 * In development, the instance is stored on globalThis to persist across hot reloads.
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

