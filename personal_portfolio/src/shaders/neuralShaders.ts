// src/shaders/neuralShaders.ts

export const particleVertexShader = `
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uPulse;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vPosition;
  varying float vDistance;

  void main() {
    vPosition = position;
    vec3 transformed = position;

    // Organic wave field deformation using sine/cosine combinations
    float wave = sin(uTime * 0.8 + position.x * 1.5) * cos(uTime * 0.6 + position.z * 1.5);
    transformed.y += wave * 0.25;

    // Pointer repulsion & magnetic response
    float dist = distance(transformed, uPointer);
    vDistance = dist;
    
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

  void main() {
    // Render soft circular anti-aliased particles
    float distToCenter = length(gl_PointCoord - vec2(0.5));
    if (distToCenter > 0.5) discard;

    // Soft core drop-off
    float alpha = smoothstep(0.5, 0.0, distToCenter) * 0.75;
    
    // Monochromatic futuristic warm silver color palette
    vec3 baseColor = vec3(0.88, 0.90, 0.92);
    vec3 accentColor = vec3(0.95, 0.98, 1.0);
    
    vec3 finalColor = mix(accentColor, baseColor, clamp(vDistance * 0.2, 0.0, 1.0));
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;