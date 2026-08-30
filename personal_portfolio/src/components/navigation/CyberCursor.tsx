import React, { useEffect, useRef } from 'react';

export const CyberCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Hide standard browser cursor globally
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;

        // Position core dot immediately
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }

        // Position outer reticle ring with slight inertia
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }

        // Detect hover over interactive elements
        const target = e.target as HTMLElement | null;
        const isHoverable = !!target?.closest('button, a, input, [role="button"], .cursor-pointer, [onClick]');

        if (ringRef.current) {
          ringRef.current.setAttribute('data-hover', isHoverable ? 'true' : 'false');
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] will-change-transform"
      />

      {/* Cyber Reticle Ring */}
      <div
        ref={ringRef}
        data-hover="false"
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-8 w-8 rounded-full border border-cyan-500/40 transition-[width,height,border-color,background-color] duration-150 ease-out will-change-transform flex items-center justify-center data-[hover=true]:h-12 data-[hover=true]:w-12 data-[hover=true]:border-emerald-400 data-[hover=true]:bg-emerald-500/10 data-[hover=true]:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
      >
        {/* Tactical Crosshair Accents */}
        <div className="absolute -top-1 h-1.5 w-[1px] bg-cyan-400/60" />
        <div className="absolute -bottom-1 h-1.5 w-[1px] bg-cyan-400/60" />
        <div className="absolute -left-1 h-[1px] w-1.5 bg-cyan-400/60" />
        <div className="absolute -right-1 h-[1px] w-1.5 bg-cyan-400/60" />
      </div>
    </>
  );
};