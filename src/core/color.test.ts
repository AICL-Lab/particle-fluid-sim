import { describe, expect, it } from 'vitest';
import * as fc from 'fast-check';
import {
  velocityToColor,
  velocityMagnitude,
  getSpeedFactor,
  CYAN,
  PURPLE,
  MAX_SPEED,
} from './color';
import { Vec2 } from '../types';

const velocityArb = fc.record({
  x: fc.float({ min: -MAX_SPEED * 2, max: MAX_SPEED * 2, noNaN: true }),
  y: fc.float({ min: -MAX_SPEED * 2, max: MAX_SPEED * 2, noNaN: true }),
});

describe('Color Module', () => {
  it('returns cyan with half brightness for zero velocity', () => {
    const color = velocityToColor({ x: 0, y: 0 });

    expect(color.r).toBeCloseTo(CYAN.r * 0.5, 5);
    expect(color.g).toBeCloseTo(CYAN.g * 0.5, 5);
    expect(color.b).toBeCloseTo(CYAN.b * 0.5, 5);
  });

  it('returns purple for velocities at or above the configured max speed', () => {
    fc.assert(
      fc.property(
        fc.float({ min: MAX_SPEED, max: MAX_SPEED * 2, noNaN: true }),
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
    fc.assert(
      fc.property(velocityArb, (velocity) => {
        const color = velocityToColor(velocity);
        const speed = velocityMagnitude(velocity);
        const t = Math.min(speed / MAX_SPEED, 1.0);
        const brightness = 0.5 + t * 0.5;

        expect(color.r).toBeCloseTo((CYAN.r + (PURPLE.r - CYAN.r) * t) * brightness, 4);
        expect(color.g).toBeCloseTo((CYAN.g + (PURPLE.g - CYAN.g) * t) * brightness, 4);
        expect(color.b).toBeCloseTo((CYAN.b + (PURPLE.b - CYAN.b) * t) * brightness, 4);
      }),
      { numRuns: 100 }
    );
  });

  it('keeps RGB output in the valid range', () => {
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

  it('returns a normalized speed factor between 0 and 1', () => {
    fc.assert(
      fc.property(velocityArb, (velocity) => {
        const factor = getSpeedFactor(velocity);
        expect(factor).toBeGreaterThanOrEqual(0);
        expect(factor).toBeLessThanOrEqual(1);
      }),
      { numRuns: 100 }
    );
  });

  it('produces the same color for the same speed in different directions', () => {
    const speed = MAX_SPEED / 2;
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
