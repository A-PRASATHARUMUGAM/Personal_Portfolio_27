//src/shaders/environmentShaders.ts
export const skyVertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const skyFragmentShader = `
uniform float uCycle; // 0.0 to 1.0 dynamic day-night cycle
varying vec3 vWorldPosition;

void main() {
  vec3 normWorld = normalize(vWorldPosition);
  float height = clamp(normWorld.y, 0.0, 1.0);

  // Day Colors (Bright Blue to Soft Horizon Gold)
  vec3 dayTop = vec3(0.20, 0.45, 0.85);
  vec3 dayHorizon = vec3(0.85, 0.70, 0.55);
  vec3 daySky = mix(dayHorizon, dayTop, height);

  // Sunset Colors (Golden Orange to Deep Magenta)
  vec3 sunsetTop = vec3(0.25, 0.10, 0.35);
  vec3 sunsetHorizon = vec3(0.95, 0.45, 0.20);
  vec3 sunsetSky = mix(sunsetHorizon, sunsetTop, height);

  // Night Colors (Midnight Blue to Dark Charcoal Sky)
  vec3 nightTop = vec3(0.02, 0.03, 0.08);
  vec3 nightHorizon = vec3(0.08, 0.10, 0.18);
  vec3 nightSky = mix(nightHorizon, nightTop, height);

  // Dynamic Cycle Interpolation
  vec3 finalSky;
  if (uCycle < 0.33) {
    float t = uCycle / 0.33;
    finalSky = mix(daySky, sunsetSky, t);
  } else if (uCycle < 0.66) {
    float t = (uCycle - 0.33) / 0.33;
    finalSky = mix(sunsetSky, nightSky, t);
  } else {
    float t = (uCycle - 0.66) / 0.34;
    finalSky = mix(nightSky, daySky, t);
  }

  gl_FragColor = vec4(finalSky, 1.0);
}
`;