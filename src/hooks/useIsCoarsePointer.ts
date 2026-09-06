// src/hooks/useIsCoarsePointer.ts
import { useEffect, useState } from "react";

/**
 * Returns true on touch / coarse-pointer devices (phones, most tablets).
 * Anything that depends on a hovering mouse — the custom cursor, 3D card
 * tilt, magnetic hover — should check this and fall back to a tap-friendly
 * interaction instead of silently doing nothing.
 */
export function useIsCoarsePointer(): boolean {
  const [isCoarse, setIsCoarse] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(pointer: coarse)");
    const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isCoarse;
}
