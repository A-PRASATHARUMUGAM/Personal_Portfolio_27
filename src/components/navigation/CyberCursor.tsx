// src/components/navigation/CyberCursor.tsx
import React, { useEffect, useRef } from "react";
import { useIsCoarsePointer } from "../../hooks/useIsCoarsePointer";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export const CyberCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const isCoarsePointer = useIsCoarsePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Touch devices have no hovering pointer, and reduced-motion users
  // don't want a cursor trail following them — bail out entirely in
  // both cases rather than rendering a cursor that can't be dismissed.
  const disabled = isCoarsePointer || prefersReducedMotion;

  useEffect(() => {
    if (disabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);

      frameRef.current = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        }

        const target = e.target as HTMLElement | null;
        const isHoverable = !!target?.closest(
          'button, a, input, [role="button"], .cursor-pointer, [data-cursor-hover]',
        );

        if (ringRef.current) {
          ringRef.current.setAttribute(
            "data-hover",
            isHoverable ? "true" : "false",
          );
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] will-change-transform"
      />
      <div
        ref={ringRef}
        data-hover="false"
        className="pointer-events-none fixed top-0 left-0 z-[9998] h-8 w-8 rounded-full border border-cyan-500/40 transition-[width,height,border-color,background-color] duration-150 ease-out will-change-transform flex items-center justify-center data-[hover=true]:h-12 data-[hover=true]:w-12 data-[hover=true]:border-emerald-400 data-[hover=true]:bg-emerald-500/10 data-[hover=true]:shadow-[0_0_20px_rgba(52,211,153,0.3)]"
      >
        <div className="absolute -top-1 h-1.5 w-[1px] bg-cyan-400/60" />
        <div className="absolute -bottom-1 h-1.5 w-[1px] bg-cyan-400/60" />
        <div className="absolute -left-1 h-[1px] w-1.5 bg-cyan-400/60" />
        <div className="absolute -right-1 h-[1px] w-1.5 bg-cyan-400/60" />
      </div>
    </>
  );
};
