import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";

import { FutureHero } from "./components/hero/Intelligence/FutureHero";
import { CyberCursor } from "./components/navigation/CyberCursor";
import { ScrollProgress } from "./components/navigation/ScrollProgress";
import TopNavigation from "./components/navigation/TopNavigation";
import MobileNavigation from "./components/navigation/MobileNavigation";
import SectionNavigation from "./components/navigation/SectionNavigation";
import BackToTop from "./components/navigation/BackToTop";

import { useActiveSection } from "./hooks/useActiveSection";

const DigitalArtifacts = lazy(() => import("./components/projects/DigitalArtifacts"));
const AboutSection = lazy(() => import("./components/about/AboutSection"));

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadBelowFold, setLoadBelowFold] = useState(false);
  const { activeSection, scrollToSection } = useActiveSection();

  useEffect(() => {
    const trigger = () => setLoadBelowFold(true);

    window.addEventListener("scroll", trigger, { once: true, passive: true });
    window.addEventListener("wheel", trigger, { once: true, passive: true });
    window.addEventListener("touchstart", trigger, { once: true, passive: true });

    const timer = setTimeout(trigger, 4000);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("wheel", trigger);
      window.removeEventListener("touchstart", trigger);
    };
  }, []);

  const handleNavigate = useCallback(
    (sectionId) => {
      setLoadBelowFold(true);
      scrollToSection(sectionId);
    },
    [scrollToSection],
  );

  const handleMobileToggle = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#08090a] text-slate-100 selection:bg-emerald-400 selection:text-black">
      <CyberCursor />
      <ScrollProgress />

      {/* Global Navigation System */}
      <TopNavigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      <MobileNavigation
        activeSection={activeSection}
        isOpen={mobileMenuOpen}
        onToggle={handleMobileToggle}
        onClose={handleMobileClose}
        onNavigate={handleNavigate}
      />
      <SectionNavigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      <BackToTop />

      {/* Page Sections */}
      <FutureHero />
      {loadBelowFold ? (
        <Suspense fallback={<div className="min-h-screen bg-[#08090a]" />}>
          <DigitalArtifacts />
          <AboutSection />
        </Suspense>
      ) : (
        <div className="min-h-screen bg-[#08090a]" />
      )}
    </main>
  );
}