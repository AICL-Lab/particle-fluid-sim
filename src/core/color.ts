import { Color, Vec2, COLOR_MAX_SPEED, CYAN as BASE_CYAN, PURPLE as BASE_PURPLE } from '../types';

export const CYAN: Color = BASE_CYAN;
export const PURPLE: Color = BASE_PURPLE;
export const MAX_SPEED = COLOR_MAX_SPEED;

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Linear interpolation between two colors
 */
export function mixColors(a: Color, b: Color, t: number): Color {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

/**
 * Calculate velocity magnitude from velocity vector
 */
export function velocityMagnitude(velocity: Vec2): number {
  return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
}

/**
 * Convert velocity to color
 * This mirrors the WGSL fragment shader logic exactly
 *
 * @param velocity - Particle velocity vector
 * @returns Color with brightness applied
 */
export function velocityToColor(velocity: Vec2): Color {
  const speed = velocityMagnitude(velocity);

  // Normalize speed to 0-1 range
  const t = clamp(speed / MAX_SPEED, 0.0, 1.0);

  // Interpolate between cyan and purple
  const baseColor = mixColors(CYAN, PURPLE, t);

  // Apply brightness (0.5 to 1.0 based on speed)
  const brightness = 0.5 + t * 0.5;

  return {
    r: baseColor.r * brightness,
    g: baseColor.g * brightness,
    b: baseColor.b * brightness,
  };
}

/**
 * Get the normalized speed factor (0-1) from velocity
 */
export function getSpeedFactor(velocity: Vec2): number {
  const speed = velocityMagnitude(velocity);
  return clamp(speed / MAX_SPEED, 0.0, 1.0);
}
