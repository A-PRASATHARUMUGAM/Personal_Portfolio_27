// src/hooks/useActiveSection.ts
import { useEffect, useState, useRef, useCallback } from "react";
import {
  NAV_SECTIONS,
  NAV_HEIGHT,
} from "../components/navigation/navigationConfig";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const isClickNavigatingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setActiveSection(sectionId);
      isClickNavigatingRef.current = true;
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      clickTimeoutRef.current = window.setTimeout(() => {
        isClickNavigatingRef.current = false;
      }, 800);

      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    },
    [prefersReducedMotion],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (isClickNavigatingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // 1. Near the top of the page -> "home"
      if (scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // 2. Near the bottom of the page -> activate last section ("contact")
      if (windowHeight + scrollY >= scrollHeight - 60) {
        const lastSection = NAV_SECTIONS[NAV_SECTIONS.length - 1];
        if (lastSection) {
          setActiveSection(lastSection.id);
          return;
        }
      }

      // 3. Trigger line sits just below the top fixed header
      const triggerY = NAV_HEIGHT + 80;

      // Check sections in reverse order so nested / more specific sections
      // (like skills, education, contact inside about) take precedence.
      const reversedSections = [...NAV_SECTIONS].reverse();
      for (const sec of reversedSections) {
        const el = document.getElementById(sec.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Check if section top has reached or passed the trigger line
        // and its bottom hasn't completely scrolled past.
        if (rect.top <= triggerY && rect.bottom >= triggerY - 50) {
          setActiveSection(sec.id);
          return;
        }
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Run initial check
    handleScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return { activeSection, setActiveSection, scrollToSection };
}
