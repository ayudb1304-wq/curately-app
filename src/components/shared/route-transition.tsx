"use client";

import { motion } from "framer-motion";

/**
 * RouteTransition - Simple fade-in animation for route changes
 * 
 * Note: AnimatePresence with mode="wait" was removed because it conflicts 
 * with React 18/19 concurrent rendering in Next.js App Router, causing
 * "finishedRoot.parentNode.removeChild" errors during fiber deletion.
 * 
 * This simplified version provides a smooth entrance animation without
 * exit animations that conflict with React's concurrent commit phase.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

