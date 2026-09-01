// src/components/hero/IntelligenceField.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  particleVertexShader,
  particleFragmentShader,
} from "../../../shaders/IntelligenceSHAD/neuralShaders";

interface IntelligenceFieldProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  isPulsing: boolean;
  onPulseComplete: () => void;
}

export const IntelligenceField: React.FC<IntelligenceFieldProps> = ({
  pointer,
  isPulsing,
  onPulseComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 5.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Adaptive Particle Density (Mobile / Desktop)
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 1800 : 4500;

    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const randomness = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Golden Spiral distribution for structural geometry
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 2.2 + (Math.random() - 0.5) * 0.8;

      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = Math.random() * 1.8 + 0.6;
      randomness[i * 3] = Math.random();
      randomness[i * 3 + 1] = Math.random();
      randomness[i * 3 + 2] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(randomness, 3),
    );

    // 3. Line Connections Structure
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4a5568,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // 4. Uniforms & Material
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector3() },
      uPulse: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 5. Animation Loop
    let animationFrameId: number;
    let pulseProgress = 0;

    const clock = new THREE.Clock();
    const targetPointer = new THREE.Vector3();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      uniforms.uTime.value = elapsedTime;

      // Smooth pointer interpolation
      targetPointer.x += (pointer.current.x * 3 - targetPointer.x) * 0.05;
      targetPointer.y += (pointer.current.y * 3 - targetPointer.y) * 0.05;
      uniforms.uPointer.value.copy(targetPointer);

      // Pulse Handling
      if (isPulsing || pulseProgress > 0) {
        pulseProgress += 0.025;
        uniforms.uPulse.value = Math.sin(pulseProgress);

        if (pulseProgress >= Math.PI) {
          pulseProgress = 0;
          uniforms.uPulse.value = 0;
          onPulseComplete();
        }
      }

      // Continuous spatial micro-rotation
      particles.rotation.y = elapsedTime * 0.04;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
      linesMesh.rotation.copy(particles.rotation);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full w-full cursor-pointer"
    />
  );
};
