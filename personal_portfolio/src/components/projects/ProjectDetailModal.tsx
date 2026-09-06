// src/components/projects/ProjectDetailModal.tsx
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ExternalLink,
  Target,
  Compass,
  ListChecks,
  LayoutGrid,
  Lock,
} from "lucide-react";
import { Project } from "../../data/projectsData";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

// Custom GitHub icon component since lucide-react does not provide brand logos
const Github = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

// Accent tokens keyed by project type — cyan for personal work, emerald for
// office/client work — reused for the cover, badges, bullets and CTAs so a
// single glance tells you which bucket a project belongs to.
const ACCENT: Record<
  Project["type"],
  { text: string; dot: string; ring: string; bg: string }
> = {
  "PERSONAL PROJECT": {
    text: "text-cyan-300",
    dot: "bg-cyan-400",
    ring: "border-cyan-500/30",
    bg: "from-cyan-500/15 via-slate-900 to-slate-950",
  },
  "OFFICE PROJECT": {
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    ring: "border-emerald-500/30",
    bg: "from-emerald-500/15 via-slate-900 to-slate-950",
  },
};

/**
 * Renders a project's preview art. Falls back to a generated, abstract cover
 * (a faint diagonal grid + the project number) whenever there's no public
 * imageUrl, the image fails to load, or the project is flagged
 * `hasScreenshots` (client screenshots kept private) — so the grid and modal
 * never show a broken image, and confidential work never leaks a real shot.
 * Exported so the projects grid can reuse the exact same cover treatment.
 */
export function ProjectCover({ project }: { project: Project }) {
  const [errored, setErrored] = useState(false);
  const accent = ACCENT[project.type];
  const showImage =
    Boolean(project.imageUrl) && !project.hasScreenshots && !errored;

  if (showImage) {
    return (
      <img
        src={project.imageUrl}
        alt={`${project.title} preview`}
        loading="lazy"
        onError={() => setErrored(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${accent.bg}`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-mono text-6xl font-bold tracking-tighter ${accent.text} opacity-60`}
        >
          {project.number.replace("PROJECT ", "")}
        </span>
      </div>
      {project.hasScreenshots && (
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-1 font-mono text-[10px] text-slate-300 backdrop-blur-sm">
          <Lock className="h-3 w-3" />
          Private build
        </div>
      )}
    </div>
  );
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  const accent = project ? ACCENT[project.type] : null;

  return (
    <AnimatePresence>
      {project && accent && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            key="panel"
            className={`relative w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-2xl border ${accent.ring} bg-[#0b0d10] text-slate-100 shadow-[0_0_60px_rgba(0,0,0,0.85)]`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16, scale: 0.97 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.98 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero cover */}
            <div className="relative h-52 sm:h-64 w-full overflow-hidden rounded-t-2xl">
              <ProjectCover project={project} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/25 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/40 text-slate-300 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-neutral-300">
                <div className="flex items-center gap-3">
                  <span>{project.number}</span>
                  <span className="text-neutral-500">/</span>
                  <span className={accent.text}>
                    {project.type === "PERSONAL PROJECT"
                      ? "Personal"
                      : "Office"}
                  </span>
                </div>
                <span className="flex items-center gap-1.5">
                  {project.status === "Currently Working" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  {project.status}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h2
                id="modal-title"
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"
              >
                {project.title}
              </h2>
              <p className="mt-2 text-sm font-light leading-relaxed text-neutral-400">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.technology.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-neutral-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {(project.problemStatement || project.solutionStatement) && (
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {project.problemStatement && (
                    <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Target className="h-3.5 w-3.5" />
                        <span className="font-mono text-[10px] tracking-[0.15em]">
                          The problem
                        </span>
                      </div>
                      <p className="text-sm font-light leading-relaxed text-neutral-300">
                        {project.problemStatement}
                      </p>
                    </div>
                  )}
                  {project.solutionStatement && (
                    <div className="rounded-xl border border-white/5 bg-white/[0.015] p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Compass className="h-3.5 w-3.5" />
                        <span className="font-mono text-[10px] tracking-[0.15em]">
                          The approach
                        </span>
                      </div>
                      <p className="text-sm font-light leading-relaxed text-neutral-300">
                        {project.solutionStatement}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {project.myContribution && project.myContribution.length > 0 && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2 text-neutral-500">
                    <ListChecks className="h-3.5 w-3.5" />
                    <span className="font-mono text-[10px] tracking-[0.15em]">
                      My contribution
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {project.myContribution.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-sm font-light leading-relaxed text-neutral-300"
                      >
                        <span
                          className={`mt-2 h-1 w-1 flex-shrink-0 rounded-full ${accent.dot}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="mt-8">
                  <div className="mb-3 flex items-center gap-2 text-neutral-500">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="font-mono text-[10px] tracking-[0.15em]">
                      Key features
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {project.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-white/5 bg-white/[0.015] p-3 font-mono text-[11px] leading-relaxed text-neutral-300"
                      >
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6 text-xs">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-black transition-colors hover:bg-neutral-200"
                  >
                    <Github className="h-3.5 w-3.5" />
                    View source
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-lg border ${accent.ring} px-4 py-2 font-medium ${accent.text} transition-colors hover:bg-white/5`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit live
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="ml-auto rounded-lg border border-white/20 px-4 py-2 text-neutral-300 transition-colors hover:border-white hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
