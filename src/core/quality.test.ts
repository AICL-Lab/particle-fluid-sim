import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { PARTICLE_COUNT, PARTICLE_SIZE } from '../types';
import { resolveSimulationSettings, readRuntimeHeuristics } from './quality';

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

  describe('resolveSimulationSettings edge cases', () => {
    it('handles undefined hardwareConcurrency', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: undefined,
        deviceMemory: 8,
        isFallbackAdapter: false,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 1920 * 1080,
      });

      expect(settings.particleCount).toBe(PARTICLE_COUNT);
      expect(settings.qualityTier).toBe('high');
    });

    it('handles undefined deviceMemory', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: 8,
        deviceMemory: undefined,
        isFallbackAdapter: false,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 1920 * 1080,
      });

      expect(settings.particleCount).toBe(PARTICLE_COUNT);
      expect(settings.qualityTier).toBe('high');
    });

    it('handles medium memory devices (4GB)', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: 8,
        deviceMemory: 4,
        isFallbackAdapter: false,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 1920 * 1080,
      });

      // 4GB memory gives scale of 0.65, so 6500 particles
      // 6500/10000 = 0.65, which is < 0.7, so 'low' tier
      expect(settings.particleCount).toBeLessThan(PARTICLE_COUNT);
      expect(settings.qualityTier).toBe('low');
      expect(settings.scale).toBe(0.65);
    });

    it('handles medium concurrency devices (4 cores)', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: 4,
        deviceMemory: 8,
        isFallbackAdapter: false,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 1920 * 1080,
      });

      expect(settings.particleCount).toBeLessThan(PARTICLE_COUNT);
      expect(settings.particleCount).toBeGreaterThan(5000);
    });

    it('handles QHD viewport', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        isFallbackAdapter: false,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 2560 * 1440,
      });

      expect(settings.particleCount).toBe(8500);
      expect(settings.qualityTier).toBe('medium');
    });

    it('never goes below minimum particle count due to scaling', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: 2,
        deviceMemory: 2,
        isFallbackAdapter: true,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 3840 * 2160,
      });

      // All constraints combined, but should still have minimum
      expect(settings.particleCount).toBeGreaterThanOrEqual(2500);
    });

    it('respects custom preferredParticleCount', () => {
      const customCount = 20000;
      const settings = resolveSimulationSettings(
        {
          hardwareConcurrency: 8,
          deviceMemory: 8,
          isFallbackAdapter: false,
          maxStorageBufferBindingSize: customCount * PARTICLE_SIZE * 2,
          viewportPixels: 1920 * 1080,
        },
        customCount
      );

      expect(settings.particleCount).toBe(customCount);
      expect(settings.qualityTier).toBe('high');
    });

    it('returns correct quality tier for medium ratio', () => {
      const settings = resolveSimulationSettings({
        hardwareConcurrency: 8,
        deviceMemory: 8,
        isFallbackAdapter: false,
        maxStorageBufferBindingSize: PARTICLE_COUNT * PARTICLE_SIZE * 2,
        viewportPixels: 2560 * 1440,
      });

      // scale is 0.85, which gives ~8500 particles
      expect(settings.qualityTier).toBe('medium');
    });
  });
});

describe('readRuntimeHeuristics', () => {
  let mockAdapter: GPUAdapter;
  let mockDevice: GPUDevice;

  beforeEach(() => {
    mockAdapter = {
      isFallbackAdapter: false,
    } as unknown as GPUAdapter;

    mockDevice = {
      limits: {
        maxStorageBufferBindingSize: 65536,
      },
    } as unknown as GPUDevice;

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1920);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(1080);
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return correct heuristics', () => {
    const heuristics = readRuntimeHeuristics(mockAdapter, mockDevice);

    expect(heuristics.viewportPixels).toBe(1920 * 1080);
    expect(heuristics.maxStorageBufferBindingSize).toBe(65536);
    expect(heuristics.isFallbackAdapter).toBe(false);
  });

  it('should detect fallback adapter', () => {
    const fallbackAdapter = {
      isFallbackAdapter: true,
    } as unknown as GPUAdapter & { isFallbackAdapter: boolean };

    const heuristics = readRuntimeHeuristics(fallbackAdapter, mockDevice);

    expect(heuristics.isFallbackAdapter).toBe(true);
  });

  it('should scale viewport by devicePixelRatio', () => {
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2);

    const heuristics = readRuntimeHeuristics(mockAdapter, mockDevice);

    // 1920 * 1080 * 2 * 2 = 8294400
    expect(heuristics.viewportPixels).toBe(1920 * 1080 * 4);
  });

  it('should handle zero devicePixelRatio', () => {
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(0);

    const heuristics = readRuntimeHeuristics(mockAdapter, mockDevice);

    // Should use minimum of 1
    expect(heuristics.viewportPixels).toBe(1920 * 1080);
  });
});
