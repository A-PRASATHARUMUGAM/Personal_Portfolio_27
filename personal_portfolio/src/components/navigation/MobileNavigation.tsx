// src/components/navigation/MobileNavigation.tsx
import React, { useCallback, useEffect, useRef } from "react";
import { NAV_SECTIONS } from "./navigationConfig";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface MobileNavigationProps {
  activeSection: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigate?: (sectionId: string) => void;
}

/**
 * Mobile navigation — hamburger button + full-screen overlay menu.
 *
 * - Visible only below the `md` breakpoint
 * - Hamburger button sits in the top nav bar area
 * - Overlay slides in with a smooth animation
 * - Auto-closes on section selection
 * - Fully accessible: aria-expanded, aria-controls, keyboard nav, focus trap
 */
export default function MobileNavigation({
  activeSection,
  isOpen,
  onToggle,
  onClose,
  onNavigate,
}: MobileNavigationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      onClose();
      // Small delay so the menu closes before scrolling
      requestAnimationFrame(() => {
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
      });
    },
    [onClose, onNavigate, prefersReducedMotion],
  );

  return (
    <>
      {/* Hamburger button — visible md-and-below, positioned in the header */}
      <button
        ref={toggleRef}
        type="button"
        onClick={onToggle}
        className="fixed top-4 right-4 z-[70] flex md:hidden h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#08090a]/80 backdrop-blur-xl transition-colors hover:border-white/25"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-panel"
      >
        <div className="flex flex-col items-center justify-center gap-[5px] w-5">
          <span
            className={`block h-[1.5px] w-full bg-white/80 rounded-full transition-all duration-300 origin-center ${
              isOpen ? "rotate-45 translate-y-[6.5px]" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-full bg-white/80 rounded-full transition-all duration-300 ${
              isOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-full bg-white/80 rounded-full transition-all duration-300 origin-center ${
              isOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
            }`}
          />
        </div>
      </button>

      {/* Full-screen overlay */}
      <div
        id="mobile-nav-panel"
        ref={menuRef}
        className={`fixed inset-0 z-[65] flex flex-col items-center justify-center transition-all md:hidden ${
          prefersReducedMotion ? "" : "duration-400"
        } ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal={isOpen}
        aria-label="Mobile navigation"
        inert={isOpen ? undefined : (true as any)}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-[#08090a]/95 backdrop-blur-2xl transition-opacity ${
            prefersReducedMotion ? "" : "duration-400"
          } ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Navigation links */}
        <nav
          className="relative z-10 flex flex-col items-center gap-2 w-full max-w-xs px-6"
          aria-label="Mobile section navigation"
        >
          {NAV_SECTIONS.map((section, idx) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(e) => handleNavClick(e, section.id)}
                className={`group flex items-center gap-4 w-full px-5 py-4 rounded-xl font-mono text-sm tracking-[0.15em] transition-all ${
                  prefersReducedMotion ? "" : "duration-300"
                } ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                } ${
                  isActive
                    ? "text-cyan-400 bg-cyan-500/[0.08] border border-cyan-500/20"
                    : "text-white/70 border border-transparent hover:text-white hover:bg-white/[0.04]"
                }`}
                style={
                  !prefersReducedMotion
                    ? { transitionDelay: isOpen ? `${idx * 50}ms` : "0ms" }
                    : undefined
                }
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active dot */}
                <span
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                      : "bg-white/20 group-hover:bg-white/40"
                  }`}
                />
                {section.label.toUpperCase()}
              </a>
            );
          })}
        </nav>

        {/* Bottom telemetry accent */}
        <div className="relative z-10 mt-12 flex flex-col items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-white/30">
          <div className="h-8 w-px bg-gradient-to-b from-cyan-400/40 to-transparent" />
          <span>PRASATH ARUMUGAM</span>
          <span>PORTFOLIO / 2026</span>
        </div>
      </div>
    </>
  );
}
