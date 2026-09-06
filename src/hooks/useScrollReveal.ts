// src/hooks/useScrollReveal.ts
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Extra delay in ms, useful for staggering a list of siblings. */
  delay?: number;
}

/**
 * Attach the returned ref to any element to have it fade/rise into view
 * the first time it crosses the viewport. Fires once, then disconnects —
 * this is a single orchestrated entrance, not a repeating scroll gimmick.
 * If the user prefers reduced motion, the element is simply marked
 * "visible" immediately with no transition.
 */
export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", delay = 0 } =
    options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const timer = window.setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
          return () => window.clearTimeout(timer);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, delay, prefersReducedMotion]);

  return { ref, isVisible };
}
