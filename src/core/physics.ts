import {
  Particle,
  Vec2,
  DEFAULT_DELTA_TIME,
  GRAVITY,
  DAMPING,
  MAX_SPEED,
  REPULSION_RADIUS,
  REPULSION_STRENGTH,
} from '../types';

/**
 * Apply gravity to particle velocity
 */
export function applyGravity(
  velocity: Vec2,
  gravity: Vec2 = GRAVITY,
  deltaTime: number = DEFAULT_DELTA_TIME
): Vec2 {
  return {
    x: velocity.x + gravity.x * deltaTime,
    y: velocity.y + gravity.y * deltaTime,
  };
}

/**
 * Calculate repulsion force from mouse
 * Returns the force vector to add to velocity
 */
export function calculateRepulsion(
  position: Vec2,
  mousePos: Vec2,
  radius: number = REPULSION_RADIUS,
  repulsionStrength: number = REPULSION_STRENGTH,
  deltaTime: number = DEFAULT_DELTA_TIME
): Vec2 {
  const dx = mousePos.x - position.x;
  const dy = mousePos.y - position.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // No repulsion if outside radius or at exact same position
  if (dist >= radius || dist === 0) {
    return { x: 0, y: 0 };
  }

  // Normalize direction and apply inverse distance force
  const nx = dx / dist;
  const ny = dy / dist;
  const forceMagnitude = -repulsionStrength / dist;

  return {
    x: nx * forceMagnitude * deltaTime,
    y: ny * forceMagnitude * deltaTime,
  };
}

/**
 * Clamp velocity to the configured maximum speed
 */
export function clampVelocity(velocity: Vec2, maxSpeed: number = MAX_SPEED): Vec2 {
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

/**
 * Apply boundary bounce to particle
 * Returns updated position and velocity
 */
export function applyBoundaryBounce(
  position: Vec2,
  velocity: Vec2,
  canvasSize: Vec2,
  damping: number = DAMPING
): { position: Vec2; velocity: Vec2 } {
  let newVx = velocity.x;
  let newVy = velocity.y;
  let newX = position.x;
  let newY = position.y;

  // X boundary
  if (newX < 0 || newX > canvasSize.x) {
    newVx *= -damping;
    newX = Math.max(0, Math.min(newX, canvasSize.x));
  }

  // Y boundary
  if (newY < 0 || newY > canvasSize.y) {
    newVy *= -damping;
    newY = Math.max(0, Math.min(newY, canvasSize.y));
  }

  return {
    position: { x: newX, y: newY },
    velocity: { x: newVx, y: newVy },
  };
}

/**
 * Update a single particle for one frame
 * This mirrors the WGSL compute shader logic exactly
 */
export function updateParticle(
  particle: Particle,
  canvasSize: Vec2,
  mousePos: Vec2,
  deltaTime: number = DEFAULT_DELTA_TIME,
  gravity: Vec2 = GRAVITY
): Particle {
  // 1. Apply gravity
  let vx = particle.vx + gravity.x * deltaTime;
  let vy = particle.vy + gravity.y * deltaTime;

  // 2. Apply mouse repulsion
  const repulsion = calculateRepulsion(
    { x: particle.x, y: particle.y },
    mousePos,
    REPULSION_RADIUS,
    REPULSION_STRENGTH,
    deltaTime
  );
  vx += repulsion.x;
  vy += repulsion.y;

  // 3. Clamp speed to match the compute shader
  const clampedVelocity = clampVelocity({ x: vx, y: vy });
  vx = clampedVelocity.x;
  vy = clampedVelocity.y;

  // 4. Update position
  const x = particle.x + vx * deltaTime;
  const y = particle.y + vy * deltaTime;

  // 5. Apply boundary bounce
  const bounced = applyBoundaryBounce({ x, y }, { x: vx, y: vy }, canvasSize);

  return {
    x: bounced.position.x,
    y: bounced.position.y,
    vx: bounced.velocity.x,
    vy: bounced.velocity.y,
  };
}
