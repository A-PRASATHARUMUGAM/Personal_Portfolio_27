import React, { useEffect, useState } from "react";

import { FutureHero } from "./components/hero/FutureHero";
import { NatureHero } from "./components/hero/NatureHero";

import { FutureNavigation } from "./components/navigation/FutureNavigation";
import { CustomCursor } from "./components/navigation/CustomCursor";
import { ScrollProgress } from "./components/navigation/ScrollProgress";
import { CyberCursor } from "./components/navigation/CyberCursor";

import { ArtifactGrid } from "./components/projects/ArtifactGrid";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeDesign, setActiveDesign] = useState("nature");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Initial loading screen
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

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#08090a] text-slate-100 selection:bg-emerald-400 selection:text-black cursor-none">

      {/* =========================================================
          GLOBAL INTERACTION LAYER
      ========================================================= */}

      <CyberCursor />
      <CustomCursor />
      <ScrollProgress />

      {/* =========================================================
          FUTURE NAVIGATION
      ========================================================= */}

      <FutureNavigation />

      {/* =========================================================
          DESIGN SWITCHER
      ========================================================= */}

      <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1.5 shadow-2xl backdrop-blur-xl">

        {/* Neural Design */}
        <button
          type="button"
          onClick={() => setActiveDesign("neural")}
          className={`
            rounded-full
            px-3
            py-1.5
            font-mono
            text-[9px]
            tracking-widest
            transition-all
            duration-300
            ${
              activeDesign === "neural"
                ? "bg-white text-black font-semibold shadow-lg"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }
          `}
        >
          01: NEURAL
        </button>

        {/* Nature Design */}
        <button
          type="button"
          onClick={() => setActiveDesign("nature")}
          className={`
            rounded-full
            px-3
            py-1.5
            font-mono
            text-[9px]
            tracking-widest
            transition-all
            duration-300
            ${
              activeDesign === "nature"
                ? "bg-white text-black font-semibold shadow-lg"
                : "text-white/50 hover:bg-white/10 hover:text-white"
            }
          `}
        >
          02: NATURE
        </button>

      </div>

      {/* =========================================================
          ACTIVE DESIGN
      ========================================================= */}

      {activeDesign === "neural" ? (
        <section
          key="neural"
          className="relative min-h-screen animate-in fade-in duration-700"
        >
          {/* Futuristic / Neural Hero */}
          <FutureHero />

          {/* Projects / Artifacts */}
          <ArtifactGrid />
        </section>
      ) : (
        <section
          key="nature"
          className="relative min-h-screen animate-in fade-in duration-700"
        >
          {/* Nature / Living Environment Hero */}
          <NatureHero />
        </section>
      )}

    </main>
  );
}

