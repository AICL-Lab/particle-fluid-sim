import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import {
  applyBoundaryBounce,
  applyGravity,
  calculateRepulsion,
  clampVelocity,
  updateParticle,
} from './physics';
import {
  DEFAULT_DELTA_TIME,
  DAMPING,
  GRAVITY,
  MAX_SPEED,
  Particle,
  REPULSION_RADIUS,
  REPULSION_STRENGTH,
  Vec2,
} from '../types';

const vec2Arb = fc.record({
  x: fc.float({ min: -1000, max: 1000, noNaN: true }),
  y: fc.float({ min: -1000, max: 1000, noNaN: true }),
});

const canvasSizeArb = fc.record({
  x: fc.float({ min: 100, max: 2000, noNaN: true }),
  y: fc.float({ min: 100, max: 2000, noNaN: true }),
});

describe('Physics Module', () => {
  it('applies gravity using delta time', () => {
    fc.assert(
      fc.property(
        vec2Arb,
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }),
        (velocity, dt) => {
          const result = applyGravity(velocity, GRAVITY, dt);
          expect(result.x).toBeCloseTo(velocity.x + GRAVITY.x * dt, 5);
          expect(result.y).toBeCloseTo(velocity.y + GRAVITY.y * dt, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('applies no repulsion when outside the configured radius', () => {
    fc.assert(
      fc.property(
        vec2Arb,
        fc.float({ min: REPULSION_RADIUS + 1, max: REPULSION_RADIUS + 1000, noNaN: true }),
        fc.float({ min: 0, max: Math.fround(Math.PI * 2), noNaN: true }),
        (mousePos, distance, angle) => {
          const position = {
            x: mousePos.x + Math.cos(angle) * distance,
            y: mousePos.y + Math.sin(angle) * distance,
          };

          const force = calculateRepulsion(position, mousePos);
          expect(force.x).toBe(0);
          expect(force.y).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scales repulsion by inverse distance and delta time', () => {
    fc.assert(
      fc.property(
        vec2Arb,
        fc.float({ min: 10, max: REPULSION_RADIUS - 60, noNaN: true }),
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }),
        fc.float({ min: 0, max: Math.fround(Math.PI * 2), noNaN: true }),
        (mousePos, nearDistance, dt, angle) => {
          const farDistance = nearDistance + 50;
          const nearPos = {
            x: mousePos.x + Math.cos(angle) * nearDistance,
            y: mousePos.y + Math.sin(angle) * nearDistance,
          };
          const farPos = {
            x: mousePos.x + Math.cos(angle) * farDistance,
            y: mousePos.y + Math.sin(angle) * farDistance,
          };

          const nearForce = calculateRepulsion(
            nearPos,
            mousePos,
            REPULSION_RADIUS,
            REPULSION_STRENGTH,
            dt
          );
          const farForce = calculateRepulsion(
            farPos,
            mousePos,
            REPULSION_RADIUS,
            REPULSION_STRENGTH,
            dt
          );

          const nearMagnitude = Math.hypot(nearForce.x, nearForce.y);
          const farMagnitude = Math.hypot(farForce.x, farForce.y);

          expect(nearMagnitude).toBeGreaterThan(farMagnitude);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('clamps velocity to the configured maximum speed', () => {
    fc.assert(
      fc.property(vec2Arb, (velocity) => {
        const clamped = clampVelocity({
          x: velocity.x * MAX_SPEED,
          y: velocity.y * MAX_SPEED,
        });
        expect(Math.hypot(clamped.x, clamped.y)).toBeLessThanOrEqual(MAX_SPEED + 1e-4);
      }),
      { numRuns: 100 }
    );
  });

  it('matches the compute shader integration steps without mouse interaction', () => {
    fc.assert(
      fc.property(
        canvasSizeArb,
        fc.float({ min: 50, max: 500, noNaN: true }),
        fc.float({ min: 50, max: 500, noNaN: true }),
        fc.float({ min: -100, max: 100, noNaN: true }),
        fc.float({ min: -100, max: 100, noNaN: true }),
        fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }),
        (canvasSize, px, py, vx, vy, dt) => {
          const particle: Particle = {
            x: Math.min(px, canvasSize.x - 50),
            y: Math.min(py, canvasSize.y - 50),
            vx,
            vy,
          };
          const mousePos = { x: -10000, y: -10000 };

          const result = updateParticle(particle, canvasSize, mousePos, dt, GRAVITY);
          const velocityAfterGravity = applyGravity({ x: vx, y: vy }, GRAVITY, dt);
          const clampedVelocity = clampVelocity(velocityAfterGravity);
          const expectedPosition = {
            x: particle.x + clampedVelocity.x * dt,
            y: particle.y + clampedVelocity.y * dt,
          };
          const bounced = applyBoundaryBounce(
            expectedPosition,
            clampedVelocity,
            canvasSize,
            DAMPING
          );

          expect(result.x).toBeCloseTo(bounced.position.x, 4);
          expect(result.y).toBeCloseTo(bounced.position.y, 4);
          expect(result.vx).toBeCloseTo(bounced.velocity.x, 4);
          expect(result.vy).toBeCloseTo(bounced.velocity.y, 4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('keeps particles inside bounds after a full update', () => {
    const particleArb = fc.record({
      x: fc.float({ min: 0, max: 1000, noNaN: true }),
      y: fc.float({ min: 0, max: 1000, noNaN: true }),
      vx: fc.float({ min: -MAX_SPEED, max: MAX_SPEED, noNaN: true }),
      vy: fc.float({ min: -MAX_SPEED, max: MAX_SPEED, noNaN: true }),
    });

    fc.assert(
      fc.property(particleArb, canvasSizeArb, (particle, canvasSize) => {
        const mousePos = { x: -10000, y: -10000 };
        const result = updateParticle(particle, canvasSize, mousePos);

        expect(result.x).toBeGreaterThanOrEqual(0);
        expect(result.x).toBeLessThanOrEqual(canvasSize.x);
        expect(result.y).toBeGreaterThanOrEqual(0);
        expect(result.y).toBeLessThanOrEqual(canvasSize.y);
      }),
      { numRuns: 100 }
    );
  });

  it('returns zero repulsion at the exact mouse position', () => {
    const position: Vec2 = { x: 100, y: 100 };
    expect(calculateRepulsion(position, position)).toEqual({ x: 0, y: 0 });
  });

  it('uses the default delta time for zero-velocity updates', () => {
    const particle: Particle = { x: 400, y: 300, vx: 0, vy: 0 };
    const canvasSize = { x: 800, y: 600 };
    const mousePos = { x: -10000, y: -10000 };

    const result = updateParticle(particle, canvasSize, mousePos);

    expect(result.vx).toBeCloseTo(0, 5);
    expect(result.vy).toBeCloseTo(GRAVITY.y * DEFAULT_DELTA_TIME, 5);
  });
});
