// src/components/navigation/BackToTop.tsx
import React, { useEffect, useState, useCallback } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/**
 * Back-to-top button.
 *
 * - Appears after the user scrolls past the first viewport height
 * - Fixed bottom-right
 * - Glassmorphic styling matching the site's design language
 * - Accessible: aria-label, keyboard focusable
 * - Respects prefers-reduced-motion
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    const home = document.getElementById("home");
    if (home) {
      home.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    } else {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [prefersReducedMotion]);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#08090a]/70 backdrop-blur-xl text-white/60 transition-all duration-300 hover:border-cyan-500/40 hover:text-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
