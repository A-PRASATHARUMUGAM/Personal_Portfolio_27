// src/App.tsx
import React, { useState, useEffect } from 'react';
import { FutureHero } from './components/hero/FutureHero';
import { FutureNavigation } from './components/navigation/FutureNavigation';
import { ArtifactGrid } from './components/projects/ArtifactGrid';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#08090a] flex flex-col items-center justify-center font-mono text-xs text-neutral-400 tracking-widest">
        <div className="animate-pulse flex flex-col gap-2">
          <span>INITIALIZING SPATIAL SYSTEM ... OK</span>
          <span>LOADING GPU SHADERS ......... OK</span>
          <span className="text-white mt-2">PRASATH / 2030</span>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#08090a] min-h-screen text-slate-100 selection:bg-white selection:text-black">
      <FutureNavigation />
      <FutureHero />
      <ArtifactGrid />  
    </main>
  );
}