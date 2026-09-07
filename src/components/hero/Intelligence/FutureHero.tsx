import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";

const IntelligenceField = lazy(() =>
  import("./IntelligenceField").then((m) => ({
    default: m.IntelligenceField,
  })),
);

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
  const [isFieldReady, setIsFieldReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const trigger = () => setIsFieldReady(true);

    const timer = window.setTimeout(trigger, 1500);
    window.addEventListener("pointermove", trigger, {
      once: true,
      passive: true,
    });
    window.addEventListener("scroll", trigger, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", trigger);
      window.removeEventListener("scroll", trigger);
    };
  }, []);

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

  // Smooth scroll handler for CTA links
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      e.stopPropagation();

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      }
    },
    [reducedMotion],
  );

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-[#070809] text-white select-none scroll-mt-[72px]"
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
        {isFieldReady && (
          <Suspense fallback={null}>
            <IntelligenceField
              pointer={pointer}
              isPulsing={isPulsing}
              onPulseComplete={() => setIsPulsing(false)}
            />
          </Suspense>
        )}
      </div>

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

            <h1 className="relative font-mono font-black leading-[0.99] text-white text-[clamp(2.75rem,13vw,6.5rem)] drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] ">
              PRASATH ARUMUGAM
            </h1>

            <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>

          <div className="mt-8">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs uppercase tracking-[0.4em] text-white shadow-lg backdrop-blur-md backdrop-saturate-150 transition-all hover:border-white/40 hover:bg-white/20 sm:text-sm bg-gradient-to-r from-cyan-600 to-blue-400 font-black">
              AI Software Developer
            </span>
          </div>
          <p className="mx-auto mt-7 max-w-[460px] text-xs font-light leading-6 tracking-wide text-slate-300 sm:text-sm ">
            Building intelligent systems, scalable applications, and meaningful
            digital experiences.
          </p>

          {/* Hero CTAs */}
          <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            <a
              href="#projects"
              onClick={(e) => handleNavClick(e, "projects")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 sm:px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] active:scale-95 cursor-pointer"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              View Projects
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 sm:px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 active:scale-95 cursor-pointer"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Contact Me
            </a>

            {/* View Resume Button */}
            <a
              href="/Resume/PRASATH_A_CV1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-5 sm:px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md transition-all duration-300 hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-95 cursor-pointer"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Resume
            </a>

            {/* Download Resume Button */}
            {/* <a
              href="/Resume/PRASATH_A_CV.pdf"
              download="PRASATH_A_CV.pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 sm:px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-emerald-300 backdrop-blur-md transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400 hover:text-emerald-200 hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] active:scale-95 cursor-pointer"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Resume
            </a> */}
          </div>

          <div className="mt-7 flex items-center justify-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 shadow-lg backdrop-blur-md transition-all hover:border-white/40 hover:bg-black/80">
              <StatusDot reduced={reducedMotion} />
              <span
                className={`font-mono text-[8px] uppercase tracking-[0.25em] text-white sm:text-[10px] ${reducedMotion ? "" : "animate-pulse"}`}
              >
                AVAILABLE FOR OPPORTUNITIES
              </span>
            </div>
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
