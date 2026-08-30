import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { Project } from '../../data/projectsData';

interface SpatialCard3DProps {
  project: Project;
  onSelect: (project: Project) => void;
}

// Micro Three.js Canvas Background for Card Hover Visuals
const CardParticleCanvas: React.FC<{ isHovered: boolean; isCurrent: boolean }> = ({ isHovered, isCurrent }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 10);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic Geometry: Floating Geometry Nodes
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const color = isCurrent ? new THREE.Color(0x34d399) : new THREE.Color(0x38bdf8);
    const material = new THREE.PointsMaterial({
      size: 0.035,
      color,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      particles.rotation.y += 0.003;
      particles.rotation.x += 0.001;
      
      // Accelerate rotation and opacity during hover
      material.opacity = THREE.MathUtils.lerp(material.opacity, isHovered ? 0.65 : 0.2, 0.05);
      
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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isHovered, isCurrent]);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0" />;
};

export const SpatialCard3D: React.FC<SpatialCard3DProps> = ({ project, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = project.status === 'Currently Working';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.2,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(project)}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)',
      }}
      className={`group relative cursor-pointer rounded-xl bg-[#090b0e]/90 border p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isCurrent
          ? 'border-emerald-500/50 shadow-[0_0_35px_rgba(52,211,153,0.12)]'
          : 'border-white/10 hover:border-cyan-500/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Embedded WebGL Canvas */}
      <CardParticleCanvas isHovered={isHovered} isCurrent={isCurrent} />

      {/* Cybernetic Technical Corner Crosshairs */}
      <div className="absolute top-2 left-2 text-[8px] font-mono text-white/20 z-20 group-hover:text-emerald-400 transition-colors">+</div>
      <div className="absolute top-2 right-2 text-[8px] font-mono text-white/20 z-20 group-hover:text-emerald-400 transition-colors">+</div>
      <div className="absolute bottom-2 left-2 text-[8px] font-mono text-white/20 z-20 group-hover:text-emerald-400 transition-colors">+</div>
      <div className="absolute bottom-2 right-2 text-[8px] font-mono text-white/20 z-20 group-hover:text-emerald-400 transition-colors">+</div>

      {/* Holographic Light Reflection Surface */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
          opacity: glarePosition.opacity,
        }}
      />

      {/* Primary Content (Elevation Z: 35px) */}
      <div style={{ transform: 'translateZ(35px)' }} className="z-20 relative">
        <div className="flex justify-between items-start mb-6 font-mono text-[10px] tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 group-hover:text-neutral-300 transition-colors">{project.number}</span>
            {isCurrent && (
              <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ● CURRENTLY WORKING
              </span>
            )}
          </div>
          <span className="text-neutral-400 bg-white/5 border border-white/10 px-2 py-1 rounded tracking-widest uppercase">
            {project.type}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-light font-mono tracking-tight text-white mb-3 group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h3>

        <p className="font-sans text-xs text-neutral-400 font-light leading-relaxed mb-6 line-clamp-3">
          {project.description}
        </p>
      </div>

      {/* Secondary Tech Stack & Action Footer (Elevation Z: 25px) */}
      <div style={{ transform: 'translateZ(25px)' }} className="z-20 mt-auto relative">
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technology.map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono text-neutral-300 border border-neutral-800 bg-black/60 px-2 py-0.5 rounded group-hover:border-neutral-600 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10 font-mono text-xs">
          <span className="text-white/80 group-hover:text-cyan-400 flex items-center gap-2 tracking-wider transition-colors">
            [ EXPLORE PROJECT ]
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>

          {project.githubUrl && (
            <span className="text-[10px] text-neutral-500 group-hover:text-white transition-colors">
              [ GITHUB ]
            </span>
          )}
        </div>
      </div>
    </div>
  );
};