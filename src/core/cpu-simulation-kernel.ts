import {
  Particle,
  Vec2,
  Color,
  DEFAULT_DELTA_TIME,
  GRAVITY,
  DAMPING,
  MAX_SPEED,
  REPULSION_RADIUS,
  REPULSION_STRENGTH,
  COLOR_MAX_SPEED,
  CYAN as BASE_CYAN,
  PURPLE as BASE_PURPLE,
} from '../types';

// ============================================================================
// Physics helpers (private to the kernel — not exported)
// ============================================================================

function calculateRepulsion(
  position: Vec2,
  mousePos: Vec2,
  radius: number = REPULSION_RADIUS,
  repulsionStrength: number = REPULSION_STRENGTH,
  deltaTime: number = DEFAULT_DELTA_TIME
): Vec2 {
  const dx = mousePos.x - position.x;
  const dy = mousePos.y - position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist >= radius || dist === 0) {
    return { x: 0, y: 0 };
  }

  const nx = dx / dist;
  const ny = dy / dist;
  const forceMagnitude = -repulsionStrength / dist;

  return {
    x: nx * forceMagnitude * deltaTime,
    y: ny * forceMagnitude * deltaTime,
  };
}

function clampVelocity(velocity: Vec2, maxSpeed: number = MAX_SPEED): Vec2 {
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  if (speed <= maxSpeed || speed === 0) {
    return velocity;
  }

  const scale = maxSpeed / speed;
  return {
    x: velocity.x * scale,
    y: velocity.y * scale,
  };
}

function applyBoundaryBounce(
  position: Vec2,
  velocity: Vec2,
  canvasSize: Vec2,
  damping: number = DAMPING
): { position: Vec2; velocity: Vec2 } {
  let newVx = velocity.x;
  let newVy = velocity.y;
  let newX = position.x;
  let newY = position.y;

  if (newX < 0 || newX > canvasSize.x) {
    newVx *= -damping;
    newX = Math.max(0, Math.min(newX, canvasSize.x));
  }

  if (newY < 0 || newY > canvasSize.y) {
    newVy *= -damping;
    newY = Math.max(0, Math.min(newY, canvasSize.y));
  }

  return {
    position: { x: newX, y: newY },
    velocity: { x: newVx, y: newVy },
  };
}

function updateParticle(
  particle: Particle,
  canvasSize: Vec2,
  mousePos: Vec2,
  deltaTime: number = DEFAULT_DELTA_TIME,
  gravity: Vec2 = GRAVITY
): Particle {
  let vx = particle.vx + gravity.x * deltaTime;
  let vy = particle.vy + gravity.y * deltaTime;

  const repulsion = calculateRepulsion(
    { x: particle.x, y: particle.y },
    mousePos,
    REPULSION_RADIUS,
    REPULSION_STRENGTH,
    deltaTime
  );
  vx += repulsion.x;
  vy += repulsion.y;

  const clampedVelocity = clampVelocity({ x: vx, y: vy });
  vx = clampedVelocity.x;
  vy = clampedVelocity.y;

  const x = particle.x + vx * deltaTime;
  const y = particle.y + vy * deltaTime;

  const bounced = applyBoundaryBounce({ x, y }, { x: vx, y: vy }, canvasSize);

  return {
    x: bounced.position.x,
    y: bounced.position.y,
    vx: bounced.velocity.x,
    vy: bounced.velocity.y,
  };
}

// ============================================================================
// Color helpers (private to the kernel — not exported)
// ============================================================================

const CYAN: Color = BASE_CYAN;
const PURPLE: Color = BASE_PURPLE;
const COLOR_MAX_SPEED_VALUE = COLOR_MAX_SPEED;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function mixColors(a: Color, b: Color, t: number): Color {
  return {
    r: lerp(a.r, b.r, t),
    g: lerp(a.g, b.g, t),
    b: lerp(a.b, b.b, t),
  };
}

function velocityMagnitude(velocity: Vec2): number {
  return Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
}

// ============================================================================
// Public seam — narrow interface, deep implementation
// ============================================================================

export interface SimulationFrameParams {
  canvasSize: Vec2;
  mousePos: Vec2;
  deltaTime?: number;
  gravity?: Vec2;
}

/**
 * Simulate one CPU frame for the entire particle set.
 *
 * This mirrors the WGSL compute shader logic exactly and is the
 * single seam for CPU-side physics validation.
 */
export function simulateFrame(
  particles: Particle[],
  params: SimulationFrameParams
): Particle[] {
  const dt = params.deltaTime ?? DEFAULT_DELTA_TIME;
  const gravity = params.gravity ?? GRAVITY;

  return particles.map((p) =>
    updateParticle(p, params.canvasSize, params.mousePos, dt, gravity)
  );
}

/**
 * Convert velocity to particle color.
 *
 * This mirrors the WGSL fragment shader logic exactly.
 */
export function velocityToColor(velocity: Vec2): Color {
  const speed = velocityMagnitude(velocity);
  const t = clamp(speed / COLOR_MAX_SPEED_VALUE, 0.0, 1.0);
  const baseColor = mixColors(CYAN, PURPLE, t);
  const brightness = 0.5 + t * 0.5;

  return {
    r: baseColor.r * brightness,
    g: baseColor.g * brightness,
    b: baseColor.b * brightness,
  };
}
