// src/components/navigation/TopNavigation.tsx
import React, { useEffect, useState, useCallback } from "react";
import { NAV_SECTIONS, NAV_HEIGHT } from "./navigationConfig";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface TopNavigationProps {
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
}

/**
 * Fixed top navigation bar.
 *
 * Behaviour:
 * - Transparent when at the very top of the page
 * - Glassmorphic (backdrop-blur + subtle border) once the user scrolls
 * - Highlights the active section with vibrant cyan styling and an indicator dot
 * - Smooth hover feedback on all items
 * - Immediate active state update and smooth scroll on click
 * - Hides on small screens (replaced by MobileNavigation's hamburger)
 */
export default function TopNavigation({
  activeSection,
  onNavigate,
}: TopNavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    handleScroll(); // initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
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
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "bg-[#08090a]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent border-b border-transparent"
      }`}
      style={{ height: NAV_HEIGHT }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-14">
        {/* Logo / Brand mark */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "home")}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/25 transition-colors group-hover:border-cyan-400/50" />
            <div className="relative h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,.7)] transition-transform duration-500 group-hover:scale-[1.8]" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 transition-colors group-hover:text-white">
            PRASATH / 01
          </span>
        </a>

        {/* Desktop nav links — hidden below md */}
        <nav
          className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-md font-mono text-[11px] tracking-[0.18em]"
          aria-label="Main navigation"
        >
          {NAV_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleNavClick(e, section.id)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-all duration-200 ease-out select-none flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? "text-cyan-400 bg-cyan-500/[0.12] border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:bg-cyan-500/[0.18] hover:border-cyan-500/40"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] border border-transparent hover:border-white/15"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] flex-shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{section.label.toUpperCase()}</span>
              </a>
            );
          })}
        </nav>

        {/* Status badge — desktop only */}
        <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/50">
          <span className="relative inline-flex h-1.5 w-1.5 flex-shrink-0">
            <span
              className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 ${
                prefersReducedMotion ? "" : "animate-ping"
              }`}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]" />
          </span>
          SYSTEM ONLINE
        </div>
      </div>
    </header>
  );
}
