import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import { simulateFrame, velocityToColor } from './cpu-simulation-kernel';
import {
  DEFAULT_DELTA_TIME,
  GRAVITY,
  MAX_SPEED,
  Particle,
  REPULSION_RADIUS,
  Vec2,
  CYAN,
  PURPLE,
  COLOR_MAX_SPEED,
} from '../types';

const vec2Arb = fc.record({
  x: fc.float({ min: -1000, max: 1000, noNaN: true }),
  y: fc.float({ min: -1000, max: 1000, noNaN: true }),
});

const canvasSizeArb = fc.record({
  x: fc.float({ min: 100, max: 2000, noNaN: true }),
  y: fc.float({ min: 100, max: 2000, noNaN: true }),
});

const OFFSCREEN_MOUSE: Vec2 = { x: -10000, y: -10000 };

describe('CPUSimulationKernel', () => {
  describe('simulateFrame', () => {
    it('applies gravity using delta time', () => {
      // Use velocities well below MAX_SPEED so clamping never interferes.
      const lowVelocityArb = fc.record({
        x: fc.float({ min: -300, max: 300, noNaN: true }),
        y: fc.float({ min: -300, max: 300, noNaN: true }),
      });

      fc.assert(
        fc.property(
          lowVelocityArb,
          fc.float({ min: Math.fround(0.001), max: Math.fround(0.05), noNaN: true }),
          (velocity, dt) => {
            const particle: Particle = { x: 50, y: 50, vx: velocity.x, vy: velocity.y };
            const result = simulateFrame(
              [particle],
              {
                canvasSize: { x: 1000, y: 1000 },
                mousePos: OFFSCREEN_MOUSE,
                deltaTime: dt,
                gravity: GRAVITY,
              }
            );
            expect(result[0].vx).toBeCloseTo(velocity.x + GRAVITY.x * dt, 5);
            expect(result[0].vy).toBeCloseTo(velocity.y + GRAVITY.y * dt, 5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('applies no repulsion when the particle is outside the configured radius', () => {
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
            const particle: Particle = {
              x: position.x,
              y: position.y,
              vx: 0,
              vy: 0,
            };

            const result = simulateFrame(
              [particle],
              {
                canvasSize: { x: 10000, y: 10000 },
                mousePos,
                gravity: { x: 0, y: 0 },
              }
            );

            // With gravity disabled and mouse far away, velocity should remain ~0
            expect(result[0].vx).toBeCloseTo(0, 5);
            expect(result[0].vy).toBeCloseTo(0, 5);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('scales repulsion by inverse distance (closer = stronger)', () => {
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

            const nearResult = simulateFrame(
              [{ x: nearPos.x, y: nearPos.y, vx: 0, vy: 0 }],
              {
                canvasSize: { x: 10000, y: 10000 },
                mousePos,
                deltaTime: dt,
                gravity: { x: 0, y: 0 },
              }
            );
            const farResult = simulateFrame(
              [{ x: farPos.x, y: farPos.y, vx: 0, vy: 0 }],
              {
                canvasSize: { x: 10000, y: 10000 },
                mousePos,
                deltaTime: dt,
                gravity: { x: 0, y: 0 },
              }
            );

            const nearMagnitude = Math.hypot(nearResult[0].vx, nearResult[0].vy);
            const farMagnitude = Math.hypot(farResult[0].vx, farResult[0].vy);

            expect(nearMagnitude).toBeGreaterThan(farMagnitude);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('clamps velocity to the configured maximum speed', () => {
      fc.assert(
        fc.property(vec2Arb, (velocity) => {
          const particle: Particle = {
            x: 400,
            y: 300,
            vx: velocity.x * MAX_SPEED,
            vy: velocity.y * MAX_SPEED,
          };

          const result = simulateFrame(
            [particle],
            {
              canvasSize: { x: 800, y: 600 },
              mousePos: OFFSCREEN_MOUSE,
            }
          );

          expect(Math.hypot(result[0].vx, result[0].vy)).toBeLessThanOrEqual(MAX_SPEED + 1e-4);
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

            const result = simulateFrame(
              [particle],
              {
                canvasSize,
                mousePos: OFFSCREEN_MOUSE,
                deltaTime: dt,
                gravity: GRAVITY,
              }
            );

            // Mirror the shader logic step-by-step
            let evx = vx + GRAVITY.x * dt;
            let evy = vy + GRAVITY.y * dt;
            const speed = Math.hypot(evx, evy);
            if (speed > MAX_SPEED && speed !== 0) {
              const scale = MAX_SPEED / speed;
              evx *= scale;
              evy *= scale;
            }
            const ex = particle.x + evx * dt;
            const ey = particle.y + evy * dt;

            expect(result[0].x).toBeCloseTo(Math.max(0, Math.min(ex, canvasSize.x)), 4);
            expect(result[0].y).toBeCloseTo(Math.max(0, Math.min(ey, canvasSize.y)), 4);
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
          const result = simulateFrame(
            [particle],
            {
              canvasSize,
              mousePos: OFFSCREEN_MOUSE,
            }
          );

          expect(result[0].x).toBeGreaterThanOrEqual(0);
          expect(result[0].x).toBeLessThanOrEqual(canvasSize.x);
          expect(result[0].y).toBeGreaterThanOrEqual(0);
          expect(result[0].y).toBeLessThanOrEqual(canvasSize.y);
        }),
        { numRuns: 100 }
      );
    });

    it('returns zero repulsion at the exact mouse position', () => {
      const position: Vec2 = { x: 100, y: 100 };
      const particle: Particle = { x: position.x, y: position.y, vx: 0, vy: 0 };

      const result = simulateFrame(
        [particle],
        {
          canvasSize: { x: 1000, y: 1000 },
          mousePos: position,
          gravity: { x: 0, y: 0 },
        }
      );

      expect(result[0].vx).toBeCloseTo(0, 5);
      expect(result[0].vy).toBeCloseTo(0, 5);
    });

    it('uses the default delta time for zero-velocity updates', () => {
      const particle: Particle = { x: 400, y: 300, vx: 0, vy: 0 };

      const result = simulateFrame(
        [particle],
        {
          canvasSize: { x: 800, y: 600 },
          mousePos: OFFSCREEN_MOUSE,
        }
      );

      expect(result[0].vx).toBeCloseTo(0, 5);
      expect(result[0].vy).toBeCloseTo(GRAVITY.y * DEFAULT_DELTA_TIME, 5);
    });
  });

  describe('velocityToColor', () => {
    it('returns cyan with half brightness for zero velocity', () => {
      const color = velocityToColor({ x: 0, y: 0 });

      expect(color.r).toBeCloseTo(CYAN.r * 0.5, 5);
      expect(color.g).toBeCloseTo(CYAN.g * 0.5, 5);
      expect(color.b).toBeCloseTo(CYAN.b * 0.5, 5);
    });

    it('returns purple for velocities at or above the configured max speed', () => {
      fc.assert(
        fc.property(
          fc.float({ min: COLOR_MAX_SPEED, max: COLOR_MAX_SPEED * 2, noNaN: true }),
          fc.float({ min: 0, max: Math.fround(Math.PI * 2), noNaN: true }),
          (speed, angle) => {
            const velocity: Vec2 = {
              x: Math.cos(angle) * speed,
              y: Math.sin(angle) * speed,
            };
            const color = velocityToColor(velocity);

            expect(color.r).toBeCloseTo(PURPLE.r, 4);
            expect(color.g).toBeCloseTo(PURPLE.g, 4);
            expect(color.b).toBeCloseTo(PURPLE.b, 4);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('matches the documented interpolation formula', () => {
      const velocityArb = fc.record({
        x: fc.float({ min: -COLOR_MAX_SPEED * 2, max: COLOR_MAX_SPEED * 2, noNaN: true }),
        y: fc.float({ min: -COLOR_MAX_SPEED * 2, max: COLOR_MAX_SPEED * 2, noNaN: true }),
      });

      fc.assert(
        fc.property(velocityArb, (velocity) => {
          const color = velocityToColor(velocity);
          const speed = Math.hypot(velocity.x, velocity.y);
          const t = Math.min(speed / COLOR_MAX_SPEED, 1.0);
          const brightness = 0.5 + t * 0.5;

          expect(color.r).toBeCloseTo((CYAN.r + (PURPLE.r - CYAN.r) * t) * brightness, 4);
          expect(color.g).toBeCloseTo((CYAN.g + (PURPLE.g - CYAN.g) * t) * brightness, 4);
          expect(color.b).toBeCloseTo((CYAN.b + (PURPLE.b - CYAN.b) * t) * brightness, 4);
        }),
        { numRuns: 100 }
      );
    });

    it('keeps RGB output in the valid range', () => {
      const velocityArb = fc.record({
        x: fc.float({ min: -COLOR_MAX_SPEED * 2, max: COLOR_MAX_SPEED * 2, noNaN: true }),
        y: fc.float({ min: -COLOR_MAX_SPEED * 2, max: COLOR_MAX_SPEED * 2, noNaN: true }),
      });

      fc.assert(
        fc.property(velocityArb, (velocity) => {
          const color = velocityToColor(velocity);

          expect(color.r).toBeGreaterThanOrEqual(0);
          expect(color.r).toBeLessThanOrEqual(1);
          expect(color.g).toBeGreaterThanOrEqual(0);
          expect(color.g).toBeLessThanOrEqual(1);
          expect(color.b).toBeGreaterThanOrEqual(0);
          expect(color.b).toBeLessThanOrEqual(1);
        }),
        { numRuns: 100 }
      );
    });

    it('produces the same color for the same speed in different directions', () => {
      const speed = COLOR_MAX_SPEED / 2;
      const angles = [0, Math.PI / 4, Math.PI / 2, Math.PI];

      const colors = angles.map((angle) =>
        velocityToColor({
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        })
      );

      for (let index = 1; index < colors.length; index++) {
        expect(colors[index].r).toBeCloseTo(colors[0].r, 4);
        expect(colors[index].g).toBeCloseTo(colors[0].g, 4);
        expect(colors[index].b).toBeCloseTo(colors[0].b, 4);
      }
    });
  });
});
