import React, { useRef, useState } from 'react';
import { IntelligenceField } from './IntelligenceField';

export const FutureHero: React.FC = () => {
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
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute left-1/2 top-1/2
            h-[700px] w-[700px]
            -translate-x-1/2 -translate-y-1/2
            rounded-full
            bg-white/[0.025]
            blur-[140px]
          "
        />

        <div
          className="
            absolute left-1/2 top-0
            h-[420px] w-[800px]
            -translate-x-1/2
            rounded-full
            bg-white/[0.018]
            blur-[120px]
          "
        />

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
            bg-[size:80px_80px]
          "
        />

        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_center,transparent_20%,#070809_85%)]
          "
        />
      </div>

      {/* Three.js Intelligence Field */}
      <div className="absolute inset-0  ">
        <IntelligenceField
          pointer={pointer}
          isPulsing={isPulsing}
          onPulseComplete={() => setIsPulsing(false)}
        />

      </div>

      {/* Top navigation */}
      <header
        className="
          absolute left-0 right-0 top-0 z-30
          flex items-center justify-between
          px-6 py-6
          sm:px-10 sm:py-8
          lg:px-14
        "
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-7 w-7 items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-white/20" />

            <div
              className={`
                h-1.5 w-1.5 rounded-full bg-white
                transition-all duration-500
                ${isHovered ? 'scale-[1.8]' : ''}
              `}
            />
          </div>

          <span className="font-mono text-[10px] tracking-[0.28em] text-white/60">
            PRASATH / 01
          </span>
        </div>

        <nav className="hidden items-center gap-8 font-mono text-[10px] tracking-[0.25em] text-white/35 sm:flex">
          <a
            href="#work"
            onClick={(e) => e.stopPropagation()}
            className="transition-colors hover:text-white"
          >
            WORK
          </a>

          <a
            href="#about"
            onClick={(e) => e.stopPropagation()}
            className="transition-colors hover:text-white"
          >
            ABOUT
          </a>

          <a
            href="#contact"
            onClick={(e) => e.stopPropagation()}
            className="transition-colors hover:text-white"
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
          className="
            group flex items-center gap-2
            font-mono text-[9px]
            tracking-[0.25em]
            text-white/50
            transition-colors
            hover:text-white
          "
        >
          <span
            className="
              h-1.5 w-1.5 rounded-full
              bg-emerald-400
              shadow-[0_0_12px_rgba(52,211,153,.8)]
            "
          />

          SYSTEM ONLINE
        </button>
      </header>

      {/* Left telemetry */}
      <div
        className="
          absolute left-6 top-1/2 z-20
          hidden -translate-y-1/2
          flex-col gap-1.5
          font-mono text-[9px]
          tracking-[0.18em]
          text-white/30
          lg:flex
        "
      >
        <span className="text-white/60">
          SYSTEM / 2030
        </span>

        <div className="my-3 h-px w-20 bg-white/10" />

        <span>
          NEURAL FIELD:
          <span className="ml-2 text-emerald-400">
            ACTIVE
          </span>
        </span>

        <span>CORE ENGINE: ONLINE</span>
        <span>LATENCY: 08ms</span>
        <span>PARTICLES: 12,048</span>

        <div className="mt-4 h-20 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Main identity */}
      <main
        className="
          pointer-events-none
          absolute inset-0 z-10
          flex items-center justify-center 
          px-5
        "
      >
        <div className="relative w-full max-w-6xl text-center">

          {/* Label */}
          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-white/20" />

            <span
              className="
                font-mono text-[9px]
                uppercase
                tracking-[0.38em]
                text-white/40
              "
            >
              Digital Intelligence / 001
            </span>

            <span className="h-px w-8 bg-white/20" />
          </div>

          {/* Name */}
          <div className="relative">
            <div
              className="
                pointer-events-none
                absolute left-1/2 top-1/2
                h-32 w-[70%]
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                bg-white/[0.035]
                blur-[70px]
              "
            />

            <h1
        className="relative
                text-[17vw]
                font-extralight 
                leading-[0.99]
                text-white
                sm:text-[6vw]
                md:text-[6vw]
                lg:text-[5vw]
                font-mono 

              "
            >
              PRASATH ARUMUGAM 
            </h1>

            <div
              className="
                pointer-events-none
                absolute left-0 right-0 top-1/2
                h-px
                bg-gradient-to-r
                from-transparent
                via-white/15
                to-transparent
              "
            />
          </div>

          {/* Role */}
          <div className="mt-8">
            <span
              className="
                font-mono text-xs
                uppercase
                tracking-[0.48em]
                text-white/55
                sm:text-sm
              "
            >
              Software Engineer
            </span>
          </div>

          {/* Description */}
          <p
            className="
              mx-auto mt-7
              max-w-[460px]
              text-xs
              font-light
              leading-6
              tracking-wide
              text-white/35
              sm:text-sm
            "
          >
            Building intelligent systems, scalable applications,
            and meaningful digital experiences.
          </p>

          {/* Availability */}
          <div className="mt-9 flex items-center justify-center gap-3">
            <span
              className="
                h-1.5 w-1.5 rounded-full
                bg-emerald-400
                shadow-[0_0_14px_rgba(52,211,153,.7)]
              "
            />

            <span
              className="
                font-mono text-[9px]
                tracking-[0.3em]
                text-white/40
              "
            >
              AVAILABLE FOR OPPORTUNITIES
            </span>
          </div>
        </div>
      </main>

      {/* Bottom left */}
      <div
        className="
          absolute bottom-7 left-6 z-20
          sm:left-10
          lg:left-14
        "
      >
        <div className="flex flex-col gap-2">
          <span
            className="
              font-mono text-[9px]
              tracking-[0.22em]
              text-white/25
            "
          >
            CURRENT LOCATION
          </span>

          <span
            className="
              font-mono text-[9px]
              tracking-[0.18em]
              text-white/50
            "
          >
            11.9416° N / 79.8083° E
          </span>
        </div>
      </div>

      {/* Bottom center */}
      <div
        className="
          absolute bottom-7 left-1/2
          z-20
          -translate-x-1/2
          flex flex-col
          items-center gap-3
        "
      >
        <span
          className="
            font-mono text-[8px]
            tracking-[0.35em]
            text-white/25
          "
        >
          SCROLL TO EXPLORE
        </span>

        <div className="relative h-8 w-px overflow-hidden bg-white/10">
          <div
            className="
              absolute left-0 top-0
              h-3 w-px
              bg-white/60
              animate-[scrollLine_1.8s_ease-in-out_infinite]
            "
          />
        </div>
      </div>

      {/* Bottom right */}
      <div
        className="
          absolute bottom-7 right-6 z-20
          sm:right-10
          lg:right-14
        "
      >
        <div className="flex items-center gap-2 font-mono text-[9px]">
          <span className="text-white/20">2026</span>

          <span className="h-px w-8 bg-white/10" />

          <span className="text-white/20">2028</span>

          <span className="h-px w-8 bg-white/10" />

          <span
            className="
              border border-white/15
              bg-white/[0.04]
              px-2 py-1
              text-white/70
            "
          >
            2030
          </span>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes scrollLine {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          70% {
            opacity: 1;
          }

          100% {
            transform: translateY(300%);
            opacity: 0;
          }
        }
      `}</style>

    </section>
  );
};