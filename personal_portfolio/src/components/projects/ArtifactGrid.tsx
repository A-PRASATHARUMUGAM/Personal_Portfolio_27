// src/components/projects/ArtifactGrid.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { PROJECTS_DATA, Project } from "../../data/projectsData";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { SpatialCard3D } from "./SpatialCard3D";
import { useOnScreen } from "../../hooks/useOnScreen";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type FilterType = "ALL" | "PERSONAL" | "OFFICE" | "CURRENT";

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PERSONAL", label: "Personal" },
  { id: "OFFICE", label: "Office" },
  { id: "CURRENT", label: "In progress" },
];

/**
 * Ambient constellation backdrop for the project section: floating nodes
 * with faint connecting lines when they drift close together. Pauses
 * itself when the section is off-screen and renders a single static
 * frame (no animation loop at all) when the user prefers reduced motion.
 */
const GridParticleCanvas: React.FC<{ isOnScreen: boolean }> = ({
  isOnScreen,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

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

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 90 : 180;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      velocities[i * 3] = (Math.random() - 0.5) * 0.0025;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0025;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0025;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: new THREE.Color(0x38bdf8),
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting lines, rebuilt each frame from current proximity.
    const maxLineSegments = particleCount * 4;
    const linePositions = new Float32Array(maxLineSegments * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const CONNECT_DISTANCE = 0.9;

    const updateLines = () => {
      let segmentIndex = 0;
      for (
        let i = 0;
        i < particleCount && segmentIndex < maxLineSegments;
        i++
      ) {
        const ax = positions[i * 3];
        const ay = positions[i * 3 + 1];
        const az = positions[i * 3 + 2];

        for (
          let j = i + 1;
          j < particleCount && segmentIndex < maxLineSegments;
          j++
        ) {
          const bx = positions[j * 3];
          const by = positions[j * 3 + 1];
          const bz = positions[j * 3 + 2];
          const dist = Math.hypot(ax - bx, ay - by, az - bz);

          if (dist < CONNECT_DISTANCE) {
            const base = segmentIndex * 6;
            linePositions[base] = ax;
            linePositions[base + 1] = ay;
            linePositions[base + 2] = az;
            linePositions[base + 3] = bx;
            linePositions[base + 4] = by;
            linePositions[base + 5] = bz;
            segmentIndex++;
          }
        }
      }
      lineGeometry.setDrawRange(0, segmentIndex * 2);
      lineGeometry.attributes.position.needsUpdate = true;
    };

    let animationId: number;
    let running = true;

    const animate = () => {
      if (!running) return;

      for (let i = 0; i < particleCount; i++) {
        for (let axis = 0; axis < 3; axis++) {
          const idx = i * 3 + axis;
          positions[idx] += velocities[idx];
          if (positions[idx] > 3 || positions[idx] < -3) {
            velocities[idx] *= -1;
          }
        }
      }
      geometry.attributes.position.needsUpdate = true;
      updateLines();

      particles.rotation.y += 0.0006;
      lines.rotation.y = particles.rotation.y;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    if (prefersReducedMotion) {
      // Single static frame — nodes placed, no drift, no rAF loop.
      updateLines();
      renderer.render(scene, camera);
    } else {
      animate();
    }

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // isOnScreen intentionally excluded from deps: the scene is created once
    // and toggled via canvas visibility below, avoiding a full teardown/
    // rebuild every time the user scrolls the section in and out of view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
      style={{ opacity: isOnScreen ? 1 : 0 }}
    />
  );
};

export const ArtifactGrid: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { ref: sectionRef, isOnScreen } = useOnScreen<HTMLElement>();

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
      ref={sectionRef}
      className="relative min-h-screen bg-[#08090a] py-24 sm:py-32 px-6 sm:px-12 lg:px-16 text-[#e2e8f0] select-none border-t border-white/5 overflow-hidden"
    >
      <GridParticleCanvas isOnScreen={isOnScreen} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 sm:mb-16">
          <span className="font-mono text-xs tracking-[0.3em] text-neutral-500">
            Selected work
          </span>
          <h2 className="text-2xl sm:text-4xl font-mono text-white tracking-tight mt-2 mb-4">
            Projects &amp; systems I've built
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-400 max-w-2xl font-light leading-relaxed">
            A mix of personal experiments and office builds — spanning
            full-stack apps, dashboards, and workflow tools I designed,
            developed, and tested end to end.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-12 pb-4 border-b border-white/10 font-mono text-[11px] tracking-[0.1em]">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 transition-all duration-300 rounded border ${
                  isActive
                    ? "bg-white text-black border-white font-semibold shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    : "bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
          <span className="ml-auto text-neutral-600 text-[10px] hidden sm:inline">
            {filteredProjects.length} of {PROJECTS_DATA.length}
          </span>
        </div>

        {/* Bento-style responsive grid: the in-progress project gets the
            wide featured treatment, everything else sits two-up. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {filteredProjects.map((project, index) => (
            <SpatialCard3D
              key={project.id}
              project={project}
              onSelect={(p) => setSelectedProject(p)}
              featured={project.status === "Currently Working"}
              revealDelay={Math.min(index, 5) * 90}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="py-20 text-center font-mono text-sm text-neutral-500">
            Nothing filed under this filter yet.
          </div>
        )}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
