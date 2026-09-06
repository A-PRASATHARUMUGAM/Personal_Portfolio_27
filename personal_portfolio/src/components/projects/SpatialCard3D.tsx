// src/components/projects/SpatialCard3D.tsx
import React, { useRef, useState } from "react";
import { Project } from "../../data/projectsData";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { useIsCoarsePointer } from "../../hooks/useIsCoarsePointer";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

interface SpatialCard3DProps {
  project: Project;
  onSelect: (project: Project) => void;
  /** Larger, two-column treatment for the project that most deserves it. */
  featured?: boolean;
  /** Stagger delay (ms) so a grid of cards reveals in sequence, not at once. */
  revealDelay?: number;
}

const IDLE_TRANSFORM =
  "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";

export const SpatialCard3D: React.FC<SpatialCard3DProps> = ({
  project,
  onSelect,
  featured = false,
  revealDelay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(IDLE_TRANSFORM);
  const [glarePosition, setGlarePosition] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const isCurrent = project.status === "Currently Working";
  const isCoarsePointer = useIsCoarsePointer();
  const prefersReducedMotion = usePrefersReducedMotion();
  const allowTilt = !isCoarsePointer && !prefersReducedMotion;

  const { ref: revealRef, isVisible } = useScrollReveal<HTMLDivElement>({
    delay: revealDelay,
  });

  const setRefs = (node: HTMLDivElement | null) => {
    cardRef.current = node;
    revealRef.current = node;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!allowTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`,
    );
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.3,
    });
  };

  const handleMouseLeave = () => {
    setTransform(IDLE_TRANSFORM);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleActivate = () => onSelect(project);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      style={{
        transform: allowTilt ? transform : undefined,
        transformStyle: "preserve-3d",
        transition: allowTilt
          ? "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), opacity 0.6s ease, translate 0.6s ease"
          : "opacity 0.6s ease, translate 0.6s ease",
        opacity: isVisible ? 1 : 0,
        translate: isVisible ? "0 0" : "0 24px",
      }}
      className={`group relative cursor-pointer rounded-xl bg-[#090c10]/90 border backdrop-blur-xl flex flex-col justify-between overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 active:scale-[0.99] transition-transform ${
        featured ? "md:col-span-2" : ""
      } ${
        isCurrent
          ? "border-emerald-500/50 shadow-[0_0_35px_rgba(52,211,153,0.15)]"
          : "border-cyan-500/20 hover:border-cyan-400/80 shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
      }`}
    >
      {/* Corner crosshair accents — kept minimal (top-left / bottom-right) */}
      <div className="absolute top-2 left-2 text-[8px] font-mono text-cyan-500/30 z-30 group-hover:text-cyan-400 transition-colors">
        +
      </div>
      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-cyan-500/30 z-30 group-hover:text-cyan-400 transition-colors">
        +
      </div>

      {/* Pointer-follow glare — desktop only, real mouse cursor required */}
      {allowTilt && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(56, 189, 248, 0.22) 0%, transparent 60%)`,
            opacity: glarePosition.opacity,
          }}
        />
      )}

      {/* Preview image */}
      <div
        style={{ transform: allowTilt ? "translateZ(15px)" : undefined }}
        className={`relative w-full overflow-hidden border-b border-white/10 bg-[#040608] ${
          featured ? "h-56 sm:h-72" : "h-44 sm:h-52"
        }`}
      >
        {project.imageUrl || project.image ? (
          <img
            src={project.imageUrl || project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cyan-950/20 via-black to-emerald-950/20 p-4 text-center">
            <span className="font-mono text-[10px] text-cyan-400/60 tracking-[0.2em] uppercase mb-1">
              Preview pending
            </span>
            <span className="font-mono text-xs text-neutral-500">
              {project.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div
          style={{ transform: allowTilt ? "translateZ(35px)" : undefined }}
          className="z-20 relative"
        >
          <div className="flex justify-between items-start mb-4 font-mono text-[10px] tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 group-hover:text-cyan-300 transition-colors">
                {project.number || `ID // 0${project.id || "1"}`}
              </span>
              {isCurrent && (
                <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In progress
                </span>
              )}
            </div>
            <span className="text-neutral-400 bg-white/5 border border-white/10 px-2 py-1 rounded tracking-widest">
              {project.type === "PERSONAL PROJECT" ? "Personal" : "Office"}
            </span>
          </div>

          <h3
            className={`font-light font-mono tracking-tight text-white mb-3 group-hover:text-cyan-300 transition-colors ${
              featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {project.title}
          </h3>

          <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed mb-6 line-clamp-3">
            {project.description}
          </p>
        </div>

        <div
          style={{ transform: allowTilt ? "translateZ(25px)" : undefined }}
          className="z-20 mt-auto relative"
        >
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.technology?.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono text-cyan-300/80 border border-cyan-500/20 bg-cyan-950/30 px-2 py-0.5 rounded group-hover:border-cyan-500/50 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
            <span className="text-white/80 group-hover:text-cyan-400 flex items-center gap-2 tracking-wider transition-colors">
              View project
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>

            {project.githubUrl && (
              <span className="text-[10px] text-neutral-500 group-hover:text-white transition-colors">
                GitHub
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
