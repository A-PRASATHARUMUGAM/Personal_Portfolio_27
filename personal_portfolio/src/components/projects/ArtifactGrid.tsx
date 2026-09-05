// src/components/projects/ArtifactGrid.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { PROJECTS_DATA, Project } from "../../data/projectsData";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { SpatialCard3D } from "./SpatialCard3D";

type FilterType = "ALL" | "PERSONAL" | "OFFICE" | "CURRENT";

// Particle Background Canvas covering the entire ArtifactGrid
const GridParticleCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      10,
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Floating Geometry Particle Nodes scaled for full screen container
    const particleCount = 250;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: new THREE.Color(0x38bdf8),
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      particles.rotation.y += 0.0015;
      particles.rotation.x += 0.0008;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />
  );
};

export const ArtifactGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return PROJECTS_DATA.filter((p) => {
      if (activeFilter === "PERSONAL") return p.type === "PERSONAL PROJECT";
      if (activeFilter === "OFFICE") return p.type === "OFFICE PROJECT";
      if (activeFilter === "CURRENT") return p.status === "Currently Working";
      return true;
    });
  }, [activeFilter]);

  return (
    <section
      id="work"
      className="relative min-h-screen bg-[#08090a] py-24 sm:py-32 px-6 sm:px-12 lg:px-16 text-[#e2e8f0] select-none border-t border-white/5 overflow-hidden"
    >
      {/* Micro Three.js Canvas Background for the Entire Grid */}
      <GridParticleCanvas />

      {/* Background 3D Grid Geometry Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Identity Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs tracking-[0.4em] uppercase text-neutral-500">
              01 // DIGITAL ARTIFACTS
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-4xl  font-mono uppercase text-white tracking-tight mb-4">
            Selected Projects
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            Systems, applications, experiments, and digital products I've
            designed, developed, tested, and contributed to.
          </p>
        </div>

        {/* Minimal Futuristic Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12 pb-4 border-b border-white/10 font-mono text-[10px] tracking-[0.25em]">
          <div className="flex items-center gap-2 sm:gap-4">
            {(["ALL", "PERSONAL", "OFFICE", "CURRENT"] as FilterType[]).map(
              (filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 transition-all duration-300 rounded border ${
                      isActive
                        ? "bg-white text-black border-white font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                );
              },
            )}
          </div>

          <div className="hidden sm:block text-neutral-500 text-[9px]">
            INDEX: [ 001 — 006 ]
          </div>
        </div>

        {/* Interactive Telemetry Index List */}
        <div className="mb-12 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
          <div className="flex items-center gap-6 font-mono text-[10px] whitespace-nowrap text-neutral-500">
            <span className="text-neutral-600">// TELEMETRY JUMP INDEX:</span>
            {PROJECTS_DATA.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
              >
                <span className="text-neutral-400">{p.id}</span>
                <span>/</span>
                <span>{p.title.split(" ")[0].toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Spatial Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredProjects.map((project) => (
            <SpatialCard3D
              key={project.id}
              project={project}
              onSelect={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      </div>

      {/* Detail Modal presentation */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
