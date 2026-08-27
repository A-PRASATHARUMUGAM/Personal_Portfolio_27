// src/shaders/neuralShaders.ts

export const particleVertexShader = `
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPulse;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vPosition;
  varying float vDistance;
  varying float vPulse;

  void main() {
    vPosition = position;
    vec3 transformed = position;

    // Organic wave field deformation using sine/cosine combinations
    float wave = sin(uTime * 0.8 + position.x * 1.5) * cos(uTime * 0.6 + position.z * 1.5);
    transformed.y += wave * 0.25;

    // Pointer repulsion & magnetic response
    float dist = distance(transformed, uPointer);
    vDistance = dist;
    vPulse = uPulse;
    
    if (dist < 2.5) {
      vec3 dir = normalize(transformed - uPointer);
      float force = (2.5 - dist) * 0.4;
      transformed += dir * force;
    }

    // System Pulse interaction state expansion
    if (uPulse > 0.0) {
      float pulseForce = sin(uPulse * 3.14159) * 0.8;
      transformed += normalize(transformed) * pulseForce * aRandomness.x;
    }

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Attenuation based on depth
    gl_PointSize = aScale * (12.0 / -mvPosition.z);
  }
`;

export const particleFragmentShader = `
  varying vec3 vPosition;
  varying float vDistance;
  varying float vPulse;

  void main() {
    // Render soft circular anti-aliased particles
    float distToCenter = length(gl_PointCoord - vec2(0.5));
    if (distToCenter > 0.5) discard;

    // Soft core drop-off
    float alpha = smoothstep(0.5, 0.0, distToCenter) * 0.85;
    
    // Vibrant Bioluminescent Palette
    vec3 cyan     = vec3(0.0, 0.9, 1.0);   // Primary ambient neural nodes
    vec3 magenta  = vec3(0.9, 0.1, 0.8);   // Spatial gradient blend
    vec3 gold     = vec3(1.0, 0.65, 0.1);  // Pointer highlight glow
    vec3 whiteCore = vec3(1.0, 0.98, 0.9); // Intense interaction core

    // 1. Spatial base gradient (Cyan to Magenta based on particle X/Y position)
    float spatialMix = clamp((vPosition.x + vPosition.y) * 0.2 + 0.5, 0.0, 1.0);
    vec3 baseColor = mix(cyan, magenta, spatialMix);

    // 2. Pointer proximity glow (shifts to warm Gold as pointer gets closer)
    float proximity = clamp(1.0 - (vDistance / 2.5), 0.0, 1.0);
    vec3 finalColor = mix(baseColor, gold, proximity * 0.85);

    // 3. System pulse override (brightens to glowing hot white/yellow during pulse)
    if (vPulse > 0.0) {
      finalColor = mix(finalColor, whiteCore, sin(vPulse * 3.14159) * 0.6);
    }

    // Boost brightness at center of each particle for a subtle bloom effect
    float coreGlow = smoothstep(0.3, 0.0, distToCenter);
    finalColor += coreGlow * 0.25;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;