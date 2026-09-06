// ArtifactsBackground.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const CYAN = new THREE.Color("#22d3ee");
const EMERALD = new THREE.Color("#34d399");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);
  return reduced;
}

/**
 * Fine background dust — cheap, numerous, drifting far behind everything
 * else. Each point is tinted somewhere between the site's cyan and emerald
 * accents instead of one flat color, so the field reads as a soft gradient
 * haze rather than a uniform sphere of dots.
 */
function Dust({ reduced }: { reduced: boolean }) {
  const ref = useRef<any>(null);
  const count = 600;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;

      tmp.copy(CYAN).lerp(EMERALD, Math.random());
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y -= delta * 0.015;
    ref.current.rotation.x -= delta * 0.008;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
}

/**
 * A sparse dependency graph quietly drifting through the scene — nodes
 * connected to their nearest neighbours, like a live map of the systems
 * this site is actually about. It drifts on its own and eases toward the
 * cursor for a subtle parallax, echoing the tilt-on-hover effect already
 * used on the project cards.
 */
function CodeGraph({ reduced }: { reduced: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const drift = useRef({ x: 0.2, y: 0.4 });
  const parallax = useRef({ x: 0, y: 0 });
  const nodeCount = 46;

  const { nodePositions, nodeColors, linePositions, lineColors } =
    useMemo(() => {
      const points: THREE.Vector3[] = [];
      const nColors: THREE.Color[] = [];
      const tmp = new THREE.Color();

      for (let i = 0; i < nodeCount; i++) {
        points.push(
          new THREE.Vector3(
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 9,
            (Math.random() - 0.5) * 6,
          ),
        );
        nColors.push(tmp.copy(CYAN).lerp(EMERALD, Math.random()).clone());
      }

      const nodes = new Float32Array(nodeCount * 3);
      const ncolArr = new Float32Array(nodeCount * 3);
      points.forEach((p, i) => {
        nodes.set([p.x, p.y, p.z], i * 3);
        ncolArr.set([nColors[i].r, nColors[i].g, nColors[i].b], i * 3);
      });

      // Connect each node to its two nearest neighbours within range —
      // enough to read as a graph without turning into a solid mesh.
      const maxDist = 2.6;
      const lines: number[] = [];
      const lcolors: number[] = [];

      points.forEach((p, i) => {
        const nearest = points
          .map((q, j) => ({ j, d: i === j ? Infinity : p.distanceTo(q) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);

        nearest.forEach(({ j, d }) => {
          if (d < maxDist) {
            const q = points[j];
            lines.push(p.x, p.y, p.z, q.x, q.y, q.z);
            lcolors.push(
              nColors[i].r,
              nColors[i].g,
              nColors[i].b,
              nColors[j].r,
              nColors[j].g,
              nColors[j].b,
            );
          }
        });
      });

      return {
        nodePositions: nodes,
        nodeColors: ncolArr,
        linePositions: new Float32Array(lines),
        lineColors: new Float32Array(lcolors),
      };
    }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (!reduced) {
      drift.current.y += 0.0015;
      drift.current.x = 0.2 + Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
      const { pointer } = state;
      parallax.current.x += (pointer.y * 0.25 - parallax.current.x) * 0.03;
      parallax.current.y += (pointer.x * 0.25 - parallax.current.y) * 0.03;
    }
    groupRef.current.rotation.x = drift.current.x + parallax.current.x;
    groupRef.current.rotation.y = drift.current.y + parallax.current.y;
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0.4, 0]}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </lineSegments>

      <Points
        positions={nodePositions}
        colors={nodeColors}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          vertexColors
          size={0.05}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
    </group>
  );
}

const ARTIFACT_SHAPES = ["icosahedron", "octahedron", "tetrahedron"] as const;
type ArtifactShape = (typeof ARTIFACT_SHAPES)[number];

/** One faint wireframe polyhedron — a literal "digital artifact" adrift in the scene. */
function Artifact({
  position,
  shape,
  color,
  speed,
  reduced,
}: {
  position: [number, number, number];
  shape: ArtifactShape;
  color: string;
  speed: number;
  reduced: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const phase = useRef(Math.random() * Math.PI * 2);
  const baseY = position[1];

  useFrame((state, delta) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.x += delta * speed * 0.3;
    ref.current.rotation.y += delta * speed * 0.4;
    ref.current.position.y =
      baseY + Math.sin(state.clock.elapsedTime * speed + phase.current) * 0.35;
  });

  return (
    <mesh ref={ref} position={position}>
      {shape === "icosahedron" && <icosahedronGeometry args={[0.35, 0]} />}
      {shape === "octahedron" && <octahedronGeometry args={[0.32, 0]} />}
      {shape === "tetrahedron" && <tetrahedronGeometry args={[0.4, 0]} />}
      <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
    </mesh>
  );
}

function FloatingArtifacts({ reduced }: { reduced: boolean }) {
  const items = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5 + 1,
      ] as [number, number, number],
      shape: ARTIFACT_SHAPES[i % ARTIFACT_SHAPES.length],
      color: i % 2 === 0 ? "#22d3ee" : "#34d399",
      speed: 0.3 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <>
      {items.map((item, i) => (
        <Artifact key={i} {...item} reduced={reduced} />
      ))}
    </>
  );
}

export default function ArtifactsBackground() {
  const reduced = usePrefersReducedMotion();
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

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={inView && !reduced ? "always" : "never"}
      >
        <fog attach="fog" args={["#08090a", 6, 13]} />
        <Dust reduced={reduced} />
        <CodeGraph reduced={reduced} />
        <FloatingArtifacts reduced={reduced} />
      </Canvas>
    </div>
  );
}
