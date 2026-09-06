// src/hooks/useOnScreen.ts
import { useEffect, useRef, useState } from "react";

/**
 * Tracks on/off-screen visibility for a node, so continuous work like a
 * Three.js render loop can pause while the section is scrolled out of
 * view instead of burning GPU/battery in the background.
 */
export function useOnScreen<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [isOnScreen, setIsOnScreen] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isOnScreen };
}
