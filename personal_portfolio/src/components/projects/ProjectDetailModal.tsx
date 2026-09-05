//src/
import React, { useEffect } from "react";
import { Project } from "../../data/projectsData";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/80 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0b0d10] border border-white/15 rounded-xl p-6 sm:p-10 text-slate-100 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Utility Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 font-mono text-[10px] tracking-[0.25em] text-neutral-400">
          <div className="flex items-center gap-3">
            <span>{project.number}</span>
            <span className="text-neutral-600">//</span>
            <span className="text-emerald-400">{project.type}</span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 border border-white/20 hover:border-white hover:text-white transition-colors rounded text-neutral-400"
            aria-label="Close dialog"
          >
            [ ESC / CLOSE ]
          </button>
        </div>

        {/* Project Title & Status */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {project.status === "Currently Working" && (
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            )}
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
              {project.status}
            </span>
          </div>
          <h2
            id="modal-title"
            className="text-2xl sm:text-4xl font-light text-white tracking-tight font-mono"
          >
            {project.title}
          </h2>
        </div>

        {/* Tech Stack Tags */}
        <div className="mb-8">
          <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-3">
            SYSTEM TECHNOLOGY
          </span>
          <div className="flex flex-wrap gap-2">
            {project.technology.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs text-neutral-300 border border-white/10 bg-white/[0.02] px-3 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Specification Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 font-mono text-xs leading-relaxed text-neutral-300">
          {project.problemStatement && (
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded">
              <span className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                // PROBLEM STATEMENT
              </span>
              <p className="font-sans text-sm font-light text-neutral-300">
                {project.problemStatement}
              </p>
            </div>
          )}
          {project.solutionStatement && (
            <div className="bg-white/[0.01] border border-white/5 p-4 rounded">
              <span className="block text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
                // ARCHITECTURAL SOLUTION
              </span>
              <p className="font-sans text-sm font-light text-neutral-300">
                {project.solutionStatement}
              </p>
            </div>
          )}
        </div>

        {/* Contributions */}
        {project.myContribution && project.myContribution.length > 0 && (
          <div className="mb-8">
            <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-3">
              // ENGINEERING CONTRIBUTIONS
            </span>
            <ul className="space-y-2 font-mono text-xs text-neutral-300 list-disc list-inside">
              {project.myContribution.map((item, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="font-sans text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Features */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="mb-8">
            <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-3">
              // CORE SYSTEM FEATURES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {project.keyFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="border border-white/5 bg-white/[0.01] p-3 rounded font-mono text-[11px] text-neutral-300"
                >
                  {feat}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Screenshot Placeholder / Viewer */}
        {project.type === "OFFICE PROJECT" && project.hasScreenshots && (
          <div className="mb-8">
            <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 mb-3">
              // SYSTEM TELEMETRY PREVIEW
            </span>
            <div className="w-full h-48 sm:h-64 border border-dashed border-white/15 bg-white/[0.01] rounded flex flex-col items-center justify-center p-6 text-center font-mono">
              <div className="h-2 w-2 rounded-full bg-emerald-400 mb-3 animate-ping" />
              <span className="text-xs text-neutral-400 tracking-widest mb-1">
                CONFIDENTIAL DATA REDACTED
              </span>
              <span className="text-[10px] text-neutral-600">
                INTERNAL OFFICE PREVIEW // SCREENSHOTS SANITIZED
              </span>
            </div>
          </div>
        )}

        {/* Action Footers */}
        <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10 font-mono text-xs">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-black font-medium rounded hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              [ VIEW SOURCE ON GITHUB ]
            </a>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-colors rounded"
          >
            [ CLOSE TELEMETRY ]
          </button>
        </div>
      </div>
    </div>
  );
};
