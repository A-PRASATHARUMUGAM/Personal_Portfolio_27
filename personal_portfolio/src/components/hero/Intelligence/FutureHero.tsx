// src/components/hero/Intelligence/FutureHero.tsx
import React, { useEffect, useRef, useState } from "react";
import { IntelligenceField } from "./IntelligenceField";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
  return reduced;
}

/**
 * A small status dot reused everywhere the page reports a live signal
 * (online, active, available) — a soft ping ring plus a glow, so the same
 * "this is alive" cue reads consistently instead of a different treatment
 * per instance. The ping ring is skipped entirely under reduced motion.
 */
function StatusDot({
  color = "bg-emerald-400",
  glow = "rgba(52,211,153,0.85)",
  reduced,
}: {
  color?: string;
  glow?: string;
  reduced: boolean;
}) {
  return (
    <span className="relative inline-flex h-1.5 w-1.5 flex-shrink-0">
      {!reduced && (
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
          style={{ backgroundColor: glow }}
        />
      )}
      <span
        className={`relative inline-flex h-1.5 w-1.5 rounded-full ${color}`}
        style={{ boxShadow: `0 0 10px ${glow}` }}
      />
    </span>
  );
}

export const FutureHero: React.FC = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

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

  // Smooth scroll handler for anchor links
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-[#070809] text-white select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePulse}
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.035] blur-[140px] ${
            reducedMotion ? "" : "animate-[heroGlow_8s_ease-in-out_infinite]"
          }`}
        />
        <div
          className={`absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px] ${
            reducedMotion ? "" : "animate-[heroGlow_8s_ease-in-out_infinite_1s]"
          }`}
        />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#070809_85%)]" />
      </div>

      {/* Three.js Intelligence Field - Click-through enabled to allow header clicks */}
      <div className="pointer-events-none absolute inset-0">
        <IntelligenceField
          pointer={pointer}
          isPulsing={isPulsing}
          onPulseComplete={() => setIsPulsing(false)}
        />
      </div>

      {/* Header Navigation - High z-index & explicit pointer events */}
      <header className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between gap-3 px-4 py-5 sm:px-10 sm:py-8 lg:px-14">
        <div className="flex items-center gap-3">
          <div className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/25" />
            {!reducedMotion && (
              <span className="absolute h-1.5 w-1.5 animate-ping rounded-full bg-white/50" />
            )}
            <div
              className={`relative h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,.7)] transition-transform duration-500 ${
                isHovered ? "scale-[1.8]" : ""
              }`}
            />
          </div>

          <span className="font-mono text-[10px] tracking-[0.2em] text-white/80">
            PRASATH / 01
          </span>
        </div>

        {/* Interactive Navigation Bar */}
        <nav className="pointer-events-auto flex items-center gap-4 font-mono text-[11px] tracking-[0.2em] text-white sm:gap-8 sm:text-[12px] sm:tracking-[0.25em]">
          <a
            href="#a1-dev"
            onClick={(e) => handleNavClick(e, "a1-dev")}
            className="cursor-pointer transition-colors hover:text-cyan-400"
          >
            WORK
          </a>

          <a
            href="#a2-qa"
            onClick={(e) => handleNavClick(e, "a2-qa")}
            className="cursor-pointer transition-colors hover:text-cyan-400"
          >
            ABOUT
          </a>

          <a
            href="#a4-marketing"
            onClick={(e) => handleNavClick(e, "a4-marketing")}
            className="cursor-pointer transition-colors hover:text-cyan-400"
          >
            SERVICES
          </a>
        </nav>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePulse();
          }}
          className="pointer-events-auto group hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white/70 transition-colors hover:text-white sm:flex"
        >
          <StatusDot reduced={reducedMotion} />
          SYSTEM ONLINE
        </button>
      </header>

      {/* Left telemetry display */}
      <div className="pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1.5 font-mono text-[10px] tracking-[0.18em] text-white/55 lg:flex">
        <span className="text-white/80">SYSTEM / 2026</span>
        <div className="my-3 h-px w-20 bg-white/10" />
        <span className="flex items-center gap-2">
          <StatusDot reduced={reducedMotion} />
          NEURAL FIELD: <span className="text-emerald-400">ACTIVE</span>
        </span>
        <span>CORE ENGINE: ONLINE</span>
        <span>LATENCY: 08ms</span>
        <span>PARTICLES: 12,048</span>
        <div className="mt-4 h-20 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Main hero title banner */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-5">
        <div className="relative w-full max-w-6xl text-center">
          <span className="pointer-events-none absolute -left-4 -top-8 h-4 w-4 border-l border-t border-white/20 sm:-left-8 sm:-top-10 sm:h-6 sm:w-6" />
          <span className="pointer-events-none absolute -right-4 -top-8 h-4 w-4 border-r border-t border-white/20 sm:-right-8 sm:-top-10 sm:h-6 sm:w-6" />
          <span className="pointer-events-none absolute -bottom-8 -left-4 h-4 w-4 border-b border-l border-white/20 sm:-bottom-10 sm:-left-8 sm:h-6 sm:w-6" />
          <span className="pointer-events-none absolute -bottom-8 -right-4 h-4 w-4 border-b border-r border-white/20 sm:-bottom-10 sm:-right-8 sm:h-6 sm:w-6" />

          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-white/25" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">
              Digital Intelligence / 001
            </span>
            <span className="h-px w-8 bg-white/25" />
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[70px]" />
            <h1 className="relative font-mono font-extralight leading-[0.99] text-white text-[clamp(2.75rem,13vw,6.5rem)] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]">
              PRASATH ARUMUGAM
            </h1>
            <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>

          <div className="mt-8">
            <span className="font-mono text-xs uppercase tracking-[0.4em] text-white/85 sm:text-sm">
              Full Stack Developer
            </span>
          </div>

          <p className="mx-auto mt-7 max-w-[460px] text-xs font-light leading-6 tracking-wide text-slate-300 sm:text-sm">
            Building intelligent systems, scalable applications, and meaningful
            digital experiences.
          </p>

          <div className="mt-9 flex items-center justify-center gap-2.5">
            <StatusDot reduced={reducedMotion} />
            <span className="font-mono text-[10px] tracking-[0.28em] text-white/75">
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </div>
      </div>

      {/* Bottom telemetry */}
      <div className="pointer-events-none absolute bottom-7 left-6 z-20 sm:left-10 lg:left-14">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/50">
            CURRENT LOCATION
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/85">
            CHENNAI, INDIA
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pointer-events-none absolute bottom-7 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="font-mono text-[8px] tracking-[0.35em] text-white/90">
          SCROLL TO EXPLORE
        </span>
        <div className="relative h-8 w-px overflow-hidden bg-white/15">
          {reducedMotion ? (
            <div className="absolute left-0 top-0 h-3 w-px bg-white/70" />
          ) : (
            <div className="absolute left-0 top-0 h-3 w-px bg-white animate-[scrollLine_1.8s_ease-in-out_infinite]" />
          )}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); opacity: 0; }
          25% { opacity: 1; }
          70% { opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        @keyframes heroGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};
