import React, { useEffect, useState, useCallback } from "react";

import { FutureHero } from "./components/hero/Intelligence/FutureHero";
import { CyberCursor } from "./components/navigation/CyberCursor";
import { ScrollProgress } from "./components/navigation/ScrollProgress";
import TopNavigation from "./components/navigation/TopNavigation";
import MobileNavigation from "./components/navigation/MobileNavigation";
import SectionNavigation from "./components/navigation/SectionNavigation";
import BackToTop from "./components/navigation/BackToTop";

import DigitalArtifacts from "./components/projects/DigitalArtifacts";
import AboutSection from "./components/about/AboutSection";

import { useActiveSection } from "./hooks/useActiveSection";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { activeSection, scrollToSection } = useActiveSection();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const timer = setTimeout(
      () => setLoading(false),
      prefersReducedMotion ? 0 : 1200,
    );

    return () => clearTimeout(timer);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#08090a] flex flex-col items-center justify-center font-mono text-xs text-neutral-400 tracking-widest">
        <div className="animate-pulse flex flex-col gap-2 text-center">
          <span>Initializing spatial system</span>
          <span>Loading GPU shaders</span>
          <span className="text-white mt-2">Prasath Arumugam</span>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#08090a] text-slate-100 selection:bg-emerald-400 selection:text-black">
      <CyberCursor />
      <ScrollProgress />

      {/* Global Navigation System */}
      <TopNavigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
      <MobileNavigation
        activeSection={activeSection}
        isOpen={mobileMenuOpen}
        onToggle={handleMobileToggle}
        onClose={handleMobileClose}
        onNavigate={scrollToSection}
      />
      <SectionNavigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
      <BackToTop />

      {/* Page Sections */}
      <FutureHero />
      <DigitalArtifacts />
      <AboutSection />
    </main>
  );
}