import { describe, expect, it } from 'vitest';
import { PARTICLE_COUNT, PARTICLE_SIZE } from '../types';
import { resolveSimulationSettings } from './quality';

describe('Quality heuristics', () => {
  it('keeps the default particle count on capable devices', () => {
    const settings = resolveSimulationSettings({
      hardwareConcurrency: 8,
      deviceMemory: 8,
      isFallbackAdapter: false,
      maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
      viewportPixels: 1920 * 1080,
    });

    expect(settings.particleCount).toBe(PARTICLE_COUNT);
    expect(settings.qualityTier).toBe('high');
    expect(settings.scale).toBe(1);
  });

  it('reduces particle count on constrained devices', () => {
    const settings = resolveSimulationSettings({
      hardwareConcurrency: 2,
      deviceMemory: 2,
      isFallbackAdapter: true,
      maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
      viewportPixels: 1920 * 1080,
    });

    expect(settings.particleCount).toBe(4000);
    expect(settings.qualityTier).toBe('low');
    expect(settings.scale).toBeCloseTo(0.4, 5);
  });

  it('reduces particle count on very large viewports', () => {
    const settings = resolveSimulationSettings({
      hardwareConcurrency: 8,
      deviceMemory: 8,
      isFallbackAdapter: false,
      maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
      viewportPixels: 3840 * 2160,
    });

    expect(settings.particleCount).toBe(6500);
    expect(settings.qualityTier).toBe('low');
  });

  it('never exceeds the storage buffer binding limit', () => {
    const settings = resolveSimulationSettings({
      hardwareConcurrency: 8,
      deviceMemory: 8,
      isFallbackAdapter: false,
      maxStorageBufferBindingSize: PARTICLE_SIZE * 1200,
      viewportPixels: 1280 * 720,
    });

    expect(settings.particleCount).toBe(1200);
    expect(settings.qualityTier).toBe('low');
  });
});
