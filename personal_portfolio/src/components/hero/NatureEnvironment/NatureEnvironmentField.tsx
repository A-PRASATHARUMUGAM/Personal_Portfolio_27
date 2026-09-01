//src/components/hero/NatureEnvironmentField.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  realisticSkyVertexShader,
  realisticSkyFragmentShader,
  foliageVertexShader,
  foliageFragmentShader,
} from "../../../shaders/NatuerEnvironmentSHAD/realisticEnvironmentShaders";

interface NatureEnvironmentFieldProps {
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  isPulsing: boolean;
  onPulseComplete: () => void;
}

export const NatureEnvironmentField: React.FC<NatureEnvironmentFieldProps> = ({
  pointer,
  isPulsing,
  onPulseComplete,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.FogExp2(fogColor, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 300);
    camera.position.set(0, 5, 24);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Dynamic Skybox Setup
    const skyUniforms = {
      uCycle: { value: 0 },
      uSunPosition: { value: new THREE.Vector3(30, 20, -40) },
    };

    const skyGeo = new THREE.SphereGeometry(150, 32, 20);
    const skyMat = new THREE.ShaderMaterial({
      vertexShader: realisticSkyVertexShader,
      fragmentShader: realisticSkyFragmentShader,
      uniforms: skyUniforms,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // Dynamic Starfield
    const starCount = 1000;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 200;
      starPos[i * 3 + 1] = Math.random() * 80 + 10;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.0,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xfffaaa }),
    );
    scene.add(sunMesh);

    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.8, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0xddddff,
        roughness: 0.8,
        emissive: 0x111122,
      }),
    );
    scene.add(moonMesh);

    // 3. Terrain
    const terrainGeo = new THREE.PlaneGeometry(160, 160, 48, 48);
    terrainGeo.rotateX(-Math.PI / 2);
    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const elevation =
        Math.sin(x * 0.08) * Math.cos(z * 0.08) * 1.5 + Math.sin(x * 0.2) * 0.4;
      posAttr.setY(i, elevation - 2);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e16,
      roughness: 0.85,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // 4. Procedural Wind-Sway Trees
    const foliageUniforms = {
      uTime: { value: 0 },
      uLeafColor: { value: new THREE.Color(0x2d5e2a) },
      uSunPosition: skyUniforms.uSunPosition,
      uLightIntensity: { value: 1.0 },
    };

    const treeGroup = new THREE.Group();
    const leafMaterial = new THREE.ShaderMaterial({
      vertexShader: foliageVertexShader,
      fragmentShader: foliageFragmentShader,
      uniforms: foliageUniforms,
      side: THREE.DoubleSide,
    });

    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b1810,
      roughness: 0.9,
    });

    const createRealisticTree = (x: number, z: number, scale: number) => {
      const tree = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(
        0.18 * scale,
        0.35 * scale,
        3.5 * scale,
        8,
      );
      const trunk = new THREE.Mesh(trunkGeo, trunkMaterial);
      trunk.position.y = 1.75 * scale - 2;
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      tree.add(trunk);

      for (let i = 0; i < 4; i++) {
        const foliageGeo = new THREE.ConeGeometry(
          (1.6 - i * 0.3) * scale,
          (2.2 - i * 0.3) * scale,
          8,
        );
        const foliage = new THREE.Mesh(foliageGeo, leafMaterial);
        foliage.position.y = (2.5 + i * 1.0) * scale - 2;
        foliage.castShadow = true;
        tree.add(foliage);
      }
      tree.position.set(x, 0, z);
      return tree;
    };

    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 65;
      const z = -4 - Math.random() * 45;
      const scale = 0.8 + Math.random() * 0.6;
      treeGroup.add(createRealisticTree(x, z, scale));
    }
    scene.add(treeGroup);

    // 5. Flocking Birds
    const birdCount = window.innerWidth < 768 ? 20 : 40;
    const birds: {
      mesh: THREE.Group;
      leftWing: THREE.Mesh;
      rightWing: THREE.Mesh;
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      wingSpeed: number;
    }[] = [];

    const createBird = () => {
      const group = new THREE.Group();
      const birdMat = new THREE.MeshStandardMaterial({
        color: 0x151515,
        roughness: 0.3,
      });

      const bodyGeo = new THREE.ConeGeometry(0.09, 0.6, 6);
      bodyGeo.rotateX(Math.PI / 2);
      const body = new THREE.Mesh(bodyGeo, birdMat);
      group.add(body);

      const wingGeo = new THREE.BufferGeometry();
      const wingVertices = new Float32Array([
        0, 0, 0, 0.65, 0.05, -0.15, 0, 0, -0.35,
      ]);
      wingGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(wingVertices, 3),
      );
      wingGeo.computeVertexNormals();

      const leftWing = new THREE.Mesh(wingGeo, birdMat);
      const rightWing = new THREE.Mesh(wingGeo, birdMat);
      rightWing.scale.set(-1, 1, 1);

      group.add(leftWing);
      group.add(rightWing);
      return { group, leftWing, rightWing };
    };

    for (let i = 0; i < birdCount; i++) {
      const { group, leftWing, rightWing } = createBird();
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 40,
        4 + Math.random() * 10,
        (Math.random() - 0.5) * 30,
      );
      group.position.copy(pos);
      scene.add(group);

      birds.push({
        mesh: group,
        leftWing,
        rightWing,
        position: pos,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.1,
        ),
        wingSpeed: 9 + Math.random() * 5,
      });
    }

    // 6. Animation Loop
    let animationFrameId: number;
    let pulseProgress = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      foliageUniforms.uTime.value = elapsedTime;

      const cycle = (elapsedTime * 0.018) % 1.0;
      skyUniforms.uCycle.value = cycle;

      const angle = cycle * Math.PI * 2;
      const orbitRadius = 60;
      const sunX = Math.cos(angle) * orbitRadius;
      const sunY = Math.sin(angle) * orbitRadius;
      const sunZ = -30;

      skyUniforms.uSunPosition.value.set(sunX, sunY, sunZ);
      sunMesh.position.copy(skyUniforms.uSunPosition.value);
      moonMesh.position.set(-sunX, -sunY, sunZ);

      const isDaytime = sunY > 0;
      if (isDaytime) {
        sunLight.position.copy(sunMesh.position);
        const dayProgress = Math.sin(angle);
        sunLight.intensity = Math.max(0.3, dayProgress * 2.4);
        ambientLight.intensity = 0.3 * dayProgress + 0.15;
        starMat.opacity = Math.max(0.0, 1.0 - dayProgress * 2.5);
        foliageUniforms.uLightIntensity.value = Math.max(0.3, dayProgress);
        fogColor.setHSL(0.55, 0.4, Math.max(0.12, dayProgress * 0.65));
      } else {
        sunLight.position.copy(moonMesh.position);
        sunLight.intensity = 0.25;
        ambientLight.intensity = 0.08;
        starMat.opacity = Math.min(0.85, (-sunY / orbitRadius) * 1.2);
        foliageUniforms.uLightIntensity.value = 0.2;
        fogColor.setHex(0x05070f);
      }
      (scene.fog as THREE.FogExp2).color.copy(fogColor);

      // Camera pointer motion
      camera.position.x += (pointer.current.x * 2.5 - camera.position.x) * 0.04;
      camera.position.y +=
        (5 + pointer.current.y * 1.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 3, 0);

      // Birds update
      birds.forEach((b) => {
        b.velocity.clampLength(0.04, 0.12);
        b.position.add(b.velocity);
        b.mesh.position.copy(b.position);

        if (Math.abs(b.position.x) > 30) b.velocity.x *= -0.8;
        if (b.position.y < 3 || b.position.y > 16) b.velocity.y *= -0.8;
        if (Math.abs(b.position.z) > 25) b.velocity.z *= -0.8;

        const targetYaw = Math.atan2(-b.velocity.z, b.velocity.x) + Math.PI / 2;
        b.mesh.rotation.y += (targetYaw - b.mesh.rotation.y) * 0.1;
        b.mesh.rotation.z += (-b.velocity.x * 3.0 - b.mesh.rotation.z) * 0.1;

        const flap = Math.sin(elapsedTime * b.wingSpeed) * 0.65;
        b.leftWing.rotation.z = flap;
        b.rightWing.rotation.z = -flap;
      });

      if (isPulsing || pulseProgress > 0) {
        pulseProgress += 0.035;
        treeGroup.rotation.y = Math.sin(pulseProgress) * 0.08;
        if (pulseProgress >= Math.PI) {
          pulseProgress = 0;
          onPulseComplete();
        }
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      skyGeo.dispose();
      skyMat.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      leafMaterial.dispose();
      trunkMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full w-full min-h-screen cursor-pointer z-0"
    />
  );
};
