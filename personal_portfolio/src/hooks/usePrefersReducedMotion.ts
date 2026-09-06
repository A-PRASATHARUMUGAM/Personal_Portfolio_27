// src/hooks/usePrefersReducedMotion.ts
import { useEffect, useState } from "react";

/**
 * Returns true when the user's OS/browser has "reduce motion" enabled.
 * Every animated surface in the app (Three.js scenes, CSS transitions,
 * cursor, scroll-reveal) should check this and fall back to a static
 * or near-instant presentation.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
