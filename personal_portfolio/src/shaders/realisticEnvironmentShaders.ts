//src/shaders/realisticEnvironmentShaders.ts

// Sky & Atmosphere Shader (Rayleigh & Mie Scattering Simulation)
export const realisticSkyVertexShader = `
varying vec3 vWorldPosition;
varying vec3 vSunDirection;

uniform vec3 uSunPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vSunDirection = normalize(uSunPosition);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const realisticSkyFragmentShader = `
uniform float uCycle;
varying vec3 vWorldPosition;
varying vec3 vSunDirection;

void main() {
  vec3 viewDirection = normalize(vWorldPosition);
  float sunHeight = vSunDirection.y;
  float cosTheta = dot(viewDirection, vSunDirection);

  // Dynamic atmospheric colors
  vec3 skyDay = vec3(0.18, 0.42, 0.85);
  vec3 skySunset = vec3(0.85, 0.35, 0.15);
  vec3 skyNight = vec3(0.01, 0.02, 0.06);
  vec3 horizonColor = vec3(0.75, 0.65, 0.55);

  // Atmospheric scattering weight
  float rayleigh = max(0.0, cosTheta);
  float sunGlow = pow(max(0.0, cosTheta), 32.0);

  vec3 baseSky;
  if (sunHeight > 0.1) {
    baseSky = mix(horizonColor, skyDay, clamp(viewDirection.y + 0.2, 0.0, 1.0));
  } else if (sunHeight > -0.2) {
    float t = (sunHeight + 0.2) / 0.3;
    baseSky = mix(skySunset, skyDay, t);
  } else {
    baseSky = skyNight;
  }

  // Sun disc intensity dynamic glow
  vec3 sunColor = vec3(1.0, 0.9, 0.7) * sunGlow * max(0.0, sunHeight);

  gl_FragColor = vec4(baseSky + sunColor, 1.0);
}
`;

// Organic Foliage Wind Shader
export const foliageVertexShader = `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec3 pos = position;

  // Organic wind sway effect based on height
  float heightFactor = max(0.0, pos.y);
  float wind = sin(uTime * 2.5 + pos.x * 0.5 + pos.z * 0.5) * 0.12 * heightFactor;
  pos.x += wind;
  pos.z += wind * 0.5;

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const foliageFragmentShader = `
uniform vec3 uLeafColor;
uniform vec3 uSunPosition;
uniform float uLightIntensity;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 lightDir = normalize(uSunPosition - vWorldPosition);
  float diff = max(0.2, dot(vNormal, lightDir));

  // Translucency / Subsurface scattering simulation for natural leaf lighting
  float backLight = max(0.0, dot(-vNormal, lightDir)) * 0.4;
  vec3 finalColor = uLeafColor * (diff + backLight) * uLightIntensity;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;