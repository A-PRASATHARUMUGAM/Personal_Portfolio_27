import React, { useEffect, useState } from "react";

import { FutureHero } from "./components/hero/Intelligence/FutureHero";
import { NatureHero } from "./components/hero/NatureEnvironment/NatureHero";

import { FutureNavigation } from "./components/navigation/FutureNavigation";
import { CustomCursor } from "./components/navigation/CustomCursor";
import { ScrollProgress } from "./components/navigation/ScrollProgress";
import { CyberCursor } from "./components/navigation/CyberCursor";

import { ArtifactGrid } from "./components/projects/ArtifactGrid";

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // 1. Initial Loading Screen
  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#08090a] flex flex-col items-center justify-center font-mono text-xs text-neutral-400 tracking-widest">
        <div className="animate-pulse flex flex-col gap-2 text-center">
          <span>INITIALIZING SPATIAL SYSTEM ... OK</span>
          <span>LOADING GPU SHADERS ......... OK</span>
          <span className="text-white mt-2">PRASATH / 2030</span>
        </div>
      </div>
    );
  }

  // 2. Main Application View
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#08090a] text-slate-100 selection:bg-emerald-400 selection:text-black cursor-none">

      <CyberCursor />
      <CustomCursor />
      <ScrollProgress />
      <FutureNavigation />
      <FutureHero />
      <ArtifactGrid />
    </main>
  );
}