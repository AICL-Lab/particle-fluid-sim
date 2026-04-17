export const SIMULATION_CONFIG = {
  particleCount: 10000,
  particleSize: 16,
  workgroupSize: 64,
  gravity: { x: 0.0, y: 600.0 },
  damping: 0.9,
  repulsionRadius: 200.0,
  repulsionStrength: 3000.0,
  maxSpeed: 800.0,
  colorMaxSpeed: 800.0,
  defaultDeltaTime: 1 / 60,
  maxDeltaTime: 0.05,
  initialVelocityRange: 4.0,
  offscreenCoordinate: -1000.0,
  trailFadeAlpha: 0.05,
  uniformFloatCount: 8,
} as const;

export const PARTICLE_COUNT = SIMULATION_CONFIG.particleCount;
export const PARTICLE_SIZE = SIMULATION_CONFIG.particleSize;
export const WORKGROUP_SIZE = SIMULATION_CONFIG.workgroupSize;
export const GRAVITY = SIMULATION_CONFIG.gravity;
export const DAMPING = SIMULATION_CONFIG.damping;
export const REPULSION_RADIUS = SIMULATION_CONFIG.repulsionRadius;
export const REPULSION_STRENGTH = SIMULATION_CONFIG.repulsionStrength;
export const MAX_SPEED = SIMULATION_CONFIG.maxSpeed;
export const COLOR_MAX_SPEED = SIMULATION_CONFIG.colorMaxSpeed;
export const DEFAULT_DELTA_TIME = SIMULATION_CONFIG.defaultDeltaTime;
export const MAX_DELTA_TIME = SIMULATION_CONFIG.maxDeltaTime;
export const INITIAL_VELOCITY_RANGE = SIMULATION_CONFIG.initialVelocityRange;
export const OFFSCREEN_COORDINATE = SIMULATION_CONFIG.offscreenCoordinate;
export const TRAIL_FADE_ALPHA = SIMULATION_CONFIG.trailFadeAlpha;
export const UNIFORM_FLOAT_COUNT = SIMULATION_CONFIG.uniformFloatCount;
export const UNIFORM_BUFFER_SIZE = UNIFORM_FLOAT_COUNT * Float32Array.BYTES_PER_ELEMENT;

export const CYAN = { r: 0.0, g: 1.0, b: 1.0 } as const;
export const PURPLE = { r: 0.9, g: 0.3, b: 1.0 } as const;

/**
 * Formats a number for use in WGSL shader code.
 * Ensures proper decimal representation (e.g., "1.0" for integers).
 * @param value - The number to format
 * @returns A string representation suitable for WGSL
 */
function formatShaderFloat(value: number): string {
  const normalized = Number(value.toFixed(6));
  return Number.isInteger(normalized) ? `${normalized.toFixed(1)}` : `${normalized}`;
}

/**
 * Formats a 2D vector for use in WGSL shader code.
 * @param value - The vector with x and y components
 * @returns A WGSL vec2f string representation
 */
function formatShaderVec2(value: { x: number; y: number }): string {
  return `vec2f(${formatShaderFloat(value.x)}, ${formatShaderFloat(value.y)})`;
}

/**
 * Formats a 3D vector for use in WGSL shader code.
 * @param value - The vector with r, g, b components
 * @returns A WGSL vec3f string representation
 */
function formatShaderVec3(value: { r: number; g: number; b: number }): string {
  return `vec3f(${formatShaderFloat(value.r)}, ${formatShaderFloat(value.g)}, ${formatShaderFloat(value.b)})`;
}

export function buildComputeShaderPreamble(): string {
  return [
    `const GRAVITY: vec2f = ${formatShaderVec2(GRAVITY)};`,
    `const REPULSION_RADIUS: f32 = ${formatShaderFloat(REPULSION_RADIUS)};`,
    `const REPULSION_STRENGTH: f32 = ${formatShaderFloat(REPULSION_STRENGTH)};`,
    `const DAMPING: f32 = ${formatShaderFloat(DAMPING)};`,
    `const MAX_SPEED: f32 = ${formatShaderFloat(MAX_SPEED)};`,
  ].join('\n');
}

export function buildRenderShaderPreamble(): string {
  return [
    `const CYAN: vec3f = ${formatShaderVec3(CYAN)};`,
    `const PURPLE: vec3f = ${formatShaderVec3(PURPLE)};`,
    `const MAX_SPEED: f32 = ${formatShaderFloat(COLOR_MAX_SPEED)};`,
  ].join('\n');
}

export function buildTrailShaderPreamble(): string {
  return `const TRAIL_FADE_ALPHA: f32 = ${formatShaderFloat(TRAIL_FADE_ALPHA)};`;
}
