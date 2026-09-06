import React, { useEffect, useState } from "react";

import { FutureHero } from "./components/hero/Intelligence/FutureHero";
// import { FutureNavigation } from "./components/navigation/FutureNavigation";
import { CyberCursor } from "./components/navigation/CyberCursor";
import { ScrollProgress } from "./components/navigation/ScrollProgress";

// Replace ArtifactGrid with DigitalArtifacts
import DigitalArtifacts from "./components/projects/DigitalArtifacts";

import AboutSection from "./components/about/AboutSection";

export default function App() {
  const [loading, setLoading] = useState(true);

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
      {/* <FutureNavigation /> */}
      <FutureHero />
      {/* Redesigned 4-chapter project section */}
      <DigitalArtifacts />
      <AboutSection />
    </main>
  );
}