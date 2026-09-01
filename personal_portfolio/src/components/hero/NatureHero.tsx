// src/components/hero/NatureHero.tsx
import React, { useRef, useState } from "react";
import { NatureEnvironmentField } from "./NatureEnvironmentField";

export const NatureHero: React.FC = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const pointer = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
    };
  };

  const handlePulse = () => {
    if (isPulsing) return;
    setIsPulsing(true);
    window.setTimeout(() => {
      setIsPulsing(false);
    }, 1200);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#070809] text-white select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePulse}
    >
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070809_85%)]" />
      </div>

      <div className="absolute inset-0 z-0">
        <NatureEnvironmentField
          pointer={pointer}
          isPulsing={isPulsing}
          onPulseComplete={() => setIsPulsing(false)}
        />
      </div>

      <header className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="relative flex h-7 w-7 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/20" />
            <div
              className={`h-1.5 w-1.5 rounded-full bg-white transition-all duration-500 ${
                isHovered ? "scale-[1.8]" : ""
              }`}
            />
          </div>
          <span className="font-mono text-[10px] tracking-[0.25em] text-white/60">
            PRASATH / 02
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-mono text-[12px] tracking-[0.25em] text-white sm:flex">
          <a
            href="#work"
            onClick={(e) => e.stopPropagation()}
            className="transition-colors hover:text-white/70"
          >
            WORK
          </a>
          <a
            href="#about"
            onClick={(e) => e.stopPropagation()}
            className="transition-colors hover:text-white/70"
          >
            ABOUT
          </a>
          <a
            href="#contact"
            onClick={(e) => e.stopPropagation()}
            className="transition-colors hover:text-white/70"
          >
            CONTACT
          </a>
        </nav>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePulse();
          }}
          className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.25em] text-white/50 transition-colors hover:text-white"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
          ECO-SYSTEM ONLINE
        </button>
      </header>

      <main className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5">
        <div className="relative w-full max-w-6xl text-center">
          <span className="pointer-events-none absolute -left-4 -top-8 h-4 w-4 border-l border-t border-white/15 sm:-left-8 sm:-top-10 sm:h-6 sm:w-6" />
          <span className="pointer-events-none absolute -right-4 -top-8 h-4 w-4 border-r border-t border-white/15 sm:-right-8 sm:-top-10 sm:h-6 sm:w-6" />
          <span className="pointer-events-none absolute -bottom-8 -left-4 h-4 w-4 border-b border-l border-white/15 sm:-bottom-10 sm:-left-8 sm:h-6 sm:w-6" />
          <span className="pointer-events-none absolute -bottom-8 -right-4 h-4 w-4 border-b border-r border-white/15 sm:-bottom-10 sm:-right-8 sm:h-6 sm:w-6" />

          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-white/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white">
              NATURE INTEGRATION / 002
            </span>
            <span className="h-px w-8 bg-white/20" />
          </div>

          <div className="relative">
            <h1 className="relative font-mono font-extralight leading-[0.99] text-white text-[clamp(2.75rem,13vw,6.5rem)]">
              PRASATH ARUMUGAM
            </h1>
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          <div className="mt-8">
            <span className="font-mono text-xs uppercase tracking-[0.45em] text-white/55 sm:text-sm">
              Software Engineer
            </span>
          </div>

          <p className="mx-auto mt-7 max-w-[460px] text-xs font-light leading-6 tracking-wide text-white/35 sm:text-sm">
            Harmonizing intelligent dynamic environments with expressive visual
            elegance.
          </p>

          <div className="mt-9 flex items-center justify-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.7)]" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </div>
      </main>
    </section>
  );
};
