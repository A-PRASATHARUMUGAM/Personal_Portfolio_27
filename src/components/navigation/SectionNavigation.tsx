// src/components/navigation/SectionNavigation.tsx
import React, { useCallback } from "react";
import { NAV_SECTIONS } from "./navigationConfig";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface SectionNavigationProps {
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
}

/**
 * Right-side vertical section navigation (desktop only).
 *
 * Features:
 * - Single unified right-side section indicator
 * - Entire row (label + dot) is an interactive, accessible target
 * - Smooth hover feedback on both label and dot
 * - Active state highlighted with glowing cyan accents
 * - Immediate active state update and smooth scroll on click
 * - Hidden on screens smaller than `lg` to preserve screen real estate
 */
export default function SectionNavigation({
  activeSection,
  onNavigate,
}: SectionNavigationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
          });
        }
      }
    },
    [onNavigate, prefersReducedMotion],
  );

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-end pointer-events-none select-none"
      aria-label="Section navigation"
    >
      {NAV_SECTIONS.map((section, idx) => {
        const isActive = activeSection === section.id;
        const isLast = idx === NAV_SECTIONS.length - 1;

        return (
          <div key={section.id} className="flex flex-col items-end">
            {/* Interactive button enclosing label and dot */}
            <button
              onClick={(e) => handleClick(e, section.id)}
              className="group pointer-events-auto flex items-center gap-2.5 py-1.5 pl-4 pr-1 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 transition-all duration-200"
              aria-label={`Navigate to ${section.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              {/* Label — visible if active or on hover */}
              <span
                className={`font-mono text-[10px] tracking-[0.16em] uppercase transition-all duration-200 ease-out whitespace-nowrap px-2 py-0.5 rounded-md ${
                  isActive
                    ? "text-cyan-400 opacity-100 translate-x-0 bg-cyan-500/[0.1] border border-cyan-500/25 shadow-[0_0_10px_rgba(34,211,238,0.15)] font-semibold"
                    : "text-white/60 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white group-hover:bg-white/[0.07] border border-transparent group-hover:border-white/15"
                }`}
              >
                {section.label}
              </span>

              {/* Dot wrapper */}
              <div className="relative flex h-5 w-5 items-center justify-center">
                {/* Active pulse aura */}
                {isActive && (
                  <span
                    className={`absolute inset-0 rounded-full bg-cyan-400/25 ${
                      prefersReducedMotion ? "" : "animate-ping opacity-75"
                    }`}
                    aria-hidden="true"
                  />
                )}

                {/* Outer border ring on active / hover */}
                <span
                  className={`absolute inset-0.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "border border-cyan-400/50 scale-100"
                      : "border border-transparent group-hover:border-white/30 group-hover:scale-100"
                  }`}
                  aria-hidden="true"
                />

                {/* Core dot */}
                <span
                  className={`rounded-full transition-all duration-200 ${
                    isActive
                      ? "h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
                      : "h-1.5 w-1.5 bg-white/30 group-hover:bg-cyan-300 group-hover:scale-125 group-hover:shadow-[0_0_8px_#22d3ee]"
                  }`}
                />
              </div>
            </button>

            {/* Vertical connector line */}
            {!isLast && (
              <div
                className="mr-[9.5px] w-px h-3.5 my-0.5 transition-colors duration-200"
                style={{
                  background: isActive
                    ? "linear-gradient(to bottom, rgba(34,211,238,0.5), rgba(255,255,255,0.1))"
                    : "rgba(255,255,255,0.1)",
                }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
