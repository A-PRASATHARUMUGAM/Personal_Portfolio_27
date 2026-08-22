// src/components/projects/ArtifactGrid.tsx
import React from 'react';

interface Project {
  id: string;
  title: string;
  category: string;
  stack: string[];
}

const PROJECTS: Project[] = [
  { id: '001', title: 'CRM ENTERPRISE SYSTEM', category: 'FULL STACK ARCHITECTURE', stack: ['React', 'Node.js', 'MySQL', 'Prisma'] },
  { id: '002', title: 'DATA DIGITIZATION ENGINE', category: 'INTELLIGENT PARSER', stack: ['TypeScript', 'Python', 'Tailwind', 'REST'] },
];

export const ArtifactGrid: React.FC = () => {
  return (
    <section id="work" className="min-h-screen bg-[#08090a] py-32 px-8 sm:px-16 text-[#e2e8f0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs font-mono tracking-[0.4em] uppercase text-neutral-500 mb-16">
          01 // DIGITAL ARTIFACTS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group relative bg-[#0d0f12] border border-white/5 hover:border-white/20 p-8 rounded-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-[10px] font-mono text-neutral-500">PROJECT {project.id}</span>
                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-1 rounded">
                  {project.category}
                </span>
              </div>

              <h3 className="text-2xl font-light tracking-tight text-white mb-6 group-hover:text-neutral-200">
                {project.title}
              </h3>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.stack.map((tech) => (
                  <span key={tech} className="text-[11px] font-mono text-neutral-500 border border-neutral-800 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>

              <button className="text-xs font-mono text-white/80 group-hover:text-white flex items-center gap-2 tracking-wider">
                [ EXPLORE ARTIFACT ]
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};