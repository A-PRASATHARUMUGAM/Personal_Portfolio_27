import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Project } from "../../data/projectsData";

export const ACCENT: Record<
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
 */
export function ProjectCover({ project }: { project: Project }) {
  const [errored, setErrored] = useState(false);
  const accent = ACCENT[project.type];
  const showImage = Boolean(project.imageUrl) && !errored;

  if (showImage) {
    return (
      <img
        src={project.imageUrl}
        alt={`${project.title} preview`}
        loading="lazy"
        decoding="async"
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
