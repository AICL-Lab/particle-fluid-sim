import { describe, it, expect } from 'vitest';
import {
  buildComputeShaderPreamble,
  buildRenderShaderPreamble,
  buildTrailShaderPreamble,
  GRAVITY,
  REPULSION_RADIUS,
  REPULSION_STRENGTH,
  DAMPING,
  MAX_SPEED,
  COLOR_MAX_SPEED,
  TRAIL_FADE_ALPHA,
  CYAN,
  PURPLE,
} from './sim';

describe('config/sim', () => {
  describe('constants', () => {
    it('should have valid gravity values', () => {
      expect(GRAVITY.x).toBe(0.0);
      expect(GRAVITY.y).toBe(600.0);
    });

    it('should have valid repulsion parameters', () => {
      expect(REPULSION_RADIUS).toBeGreaterThan(0);
      expect(REPULSION_STRENGTH).toBeGreaterThan(0);
    });

    it('should have valid damping between 0 and 1', () => {
      expect(DAMPING).toBeGreaterThan(0);
      expect(DAMPING).toBeLessThanOrEqual(1);
    });

    it('should have positive max speed', () => {
      expect(MAX_SPEED).toBeGreaterThan(0);
      expect(COLOR_MAX_SPEED).toBeGreaterThan(0);
    });

    it('should have valid trail fade alpha between 0 and 1', () => {
      expect(TRAIL_FADE_ALPHA).toBeGreaterThan(0);
      expect(TRAIL_FADE_ALPHA).toBeLessThan(1);
    });

    it('should have valid color definitions', () => {
      expect(CYAN.r).toBe(0.0);
      expect(CYAN.g).toBe(1.0);
      expect(CYAN.b).toBe(1.0);
      expect(PURPLE.r).toBe(0.9);
      expect(PURPLE.g).toBe(0.3);
      expect(PURPLE.b).toBe(1.0);
    });
  });

  describe('buildComputeShaderPreamble', () => {
    it('should return a non-empty string', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble.length).toBeGreaterThan(0);
    });

    it('should contain GRAVITY constant', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toContain('const GRAVITY: vec2f');
    });

    it('should contain REPULSION_RADIUS constant', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toContain('const REPULSION_RADIUS: f32');
    });

    it('should contain REPULSION_STRENGTH constant', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toContain('const REPULSION_STRENGTH: f32');
    });

    it('should contain DAMPING constant', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toContain('const DAMPING: f32');
    });

    it('should contain MAX_SPEED constant', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toContain('const MAX_SPEED: f32');
    });

    it('should have correct number of lines (5 constants)', () => {
      const preamble = buildComputeShaderPreamble();
      const lines = preamble.split('\n');
      expect(lines).toHaveLength(5);
    });

    it('should use WGSL f32 type for scalar constants', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toMatch(/REPULSION_RADIUS: f32/);
      expect(preamble).toMatch(/REPULSION_STRENGTH: f32/);
      expect(preamble).toMatch(/DAMPING: f32/);
      expect(preamble).toMatch(/MAX_SPEED: f32/);
    });

    it('should use WGSL vec2f type for GRAVITY', () => {
      const preamble = buildComputeShaderPreamble();
      expect(preamble).toMatch(/GRAVITY: vec2f = vec2f\(.*\)/);
    });
  });

  describe('buildRenderShaderPreamble', () => {
    it('should return a non-empty string', () => {
      const preamble = buildRenderShaderPreamble();
      expect(preamble.length).toBeGreaterThan(0);
    });

    it('should contain CYAN constant', () => {
      const preamble = buildRenderShaderPreamble();
      expect(preamble).toContain('const CYAN: vec3f');
    });

    it('should contain PURPLE constant', () => {
      const preamble = buildRenderShaderPreamble();
      expect(preamble).toContain('const PURPLE: vec3f');
    });

    it('should contain MAX_SPEED constant', () => {
      const preamble = buildRenderShaderPreamble();
      expect(preamble).toContain('const MAX_SPEED: f32');
    });

    it('should have correct number of lines (3 constants)', () => {
      const preamble = buildRenderShaderPreamble();
      const lines = preamble.split('\n');
      expect(lines).toHaveLength(3);
    });

    it('should use WGSL vec3f type for color constants', () => {
      const preamble = buildRenderShaderPreamble();
      expect(preamble).toMatch(/CYAN: vec3f = vec3f\(.*\)/);
      expect(preamble).toMatch(/PURPLE: vec3f = vec3f\(.*\)/);
    });
  });

  describe('buildTrailShaderPreamble', () => {
    it('should return a non-empty string', () => {
      const preamble = buildTrailShaderPreamble();
      expect(preamble.length).toBeGreaterThan(0);
    });

    it('should contain TRAIL_FADE_ALPHA constant', () => {
      const preamble = buildTrailShaderPreamble();
      expect(preamble).toContain('const TRAIL_FADE_ALPHA: f32');
    });

    it('should be a single line', () => {
      const preamble = buildTrailShaderPreamble();
      expect(preamble).not.toContain('\n');
    });

    it('should use WGSL f32 type', () => {
      const preamble = buildTrailShaderPreamble();
      expect(preamble).toMatch(/TRAIL_FADE_ALPHA: f32/);
    });
  });

  describe('shader preamble formatting', () => {
    it('should format integers with decimal point', () => {
      const preamble = buildComputeShaderPreamble();
      // GRAVITY.x is 0.0, should be formatted as "0.0"
      expect(preamble).toMatch(/vec2f\(0\.0,/);
    });

    it('should format decimal values correctly', () => {
      const preamble = buildComputeShaderPreamble();
      // DAMPING is 0.9, should appear as "0.9"
      expect(preamble).toMatch(/DAMPING: f32 = 0\.9/);
    });

    it('should produce valid WGSL syntax', () => {
      const computePreamble = buildComputeShaderPreamble();
      const renderPreamble = buildRenderShaderPreamble();
      const trailPreamble = buildTrailShaderPreamble();

      // All should start with 'const'
      expect(computePreamble.split('\n').every((line) => line.startsWith('const'))).toBe(true);
      expect(renderPreamble.split('\n').every((line) => line.startsWith('const'))).toBe(true);
      expect(trailPreamble.startsWith('const')).toBe(true);
    });
  });
});
