// src/components/about/AboutBackground.tsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const CYAN = new THREE.Color("#22d3ee");
const EMERALD = new THREE.Color("#34d399");

/**
 * A calm, lightweight particle drift for the About section — deliberately
 * simpler than the projects section's background (no per-frame neighbour
 * search, single mesh) since this section sits further down the page and
 * only needs ambience, not its own showpiece.
 */
function AmbientDust({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const parallax = useRef({ x: 0, y: 0 });
  const count = 220;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      tmp.copy(CYAN).lerp(EMERALD, Math.random());
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    return [pos, col];
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    if (!reduced) {
      ref.current.rotation.y += delta * 0.01;
      const { pointer } = state;
      parallax.current.x += (pointer.y * 0.06 - parallax.current.x) * 0.02;
      parallax.current.y += (pointer.x * 0.06 - parallax.current.y) * 0.02;
    }
    ref.current.rotation.x = parallax.current.x;
    ref.current.position.x = parallax.current.y;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.016}
        sizeAttenuation
        depthWrite={false}
        opacity={0.28}
      />
    </Points>
  );
}

export default function AboutBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Skip mounting the WebGL canvas entirely for reduced-motion users —
  // there's nothing static worth keeping here, unlike a data chart.
  if (prefersReducedMotion) {
    return <div className="absolute inset-0 bg-[#08090a]" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={inView ? "always" : "never"}
      >
        <fog attach="fog" args={["#08090a", 6, 12]} />
        <AmbientDust reduced={prefersReducedMotion} />
      </Canvas>
    </div>
  );
}
