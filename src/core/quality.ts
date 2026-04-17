import { PARTICLE_COUNT, PARTICLE_SIZE } from '../types';

export type SimulationQualityTier = 'low' | 'medium' | 'high';

export interface RuntimeSimulationSettings {
  particleCount: number;
  qualityTier: SimulationQualityTier;
  scale: number;
}

export interface SimulationHeuristicsInput {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  isFallbackAdapter: boolean;
  maxStorageBufferBindingSize: number;
  viewportPixels: number;
}

const MIN_PARTICLE_COUNT = 2500;
const UHD_PIXEL_COUNT = 3840 * 2160;
const QHD_PIXEL_COUNT = 2560 * 1440;

export function resolveSimulationSettings(
  input: SimulationHeuristicsInput,
  preferredParticleCount: number = PARTICLE_COUNT
): RuntimeSimulationSettings {
  let scale = 1;

  if (input.isFallbackAdapter) {
    scale = Math.min(scale, 0.4);
  }

  if (input.deviceMemory !== undefined) {
    if (input.deviceMemory <= 2) {
      scale = Math.min(scale, 0.45);
    } else if (input.deviceMemory <= 4) {
      scale = Math.min(scale, 0.65);
    }
  }

  if (input.hardwareConcurrency !== undefined) {
    if (input.hardwareConcurrency <= 2) {
      scale = Math.min(scale, 0.45);
    } else if (input.hardwareConcurrency <= 4) {
      scale = Math.min(scale, 0.7);
    }
  }

  if (input.viewportPixels >= UHD_PIXEL_COUNT) {
    scale = Math.min(scale, 0.65);
  } else if (input.viewportPixels >= QHD_PIXEL_COUNT) {
    scale = Math.min(scale, 0.85);
  }

  const maxParticlesByStorageLimit = Math.max(
    1,
    Math.floor(input.maxStorageBufferBindingSize / PARTICLE_SIZE)
  );
  const preferredWithinLimits = Math.min(preferredParticleCount, maxParticlesByStorageLimit);
  const scaledParticleCount = Math.round(preferredWithinLimits * scale);
  const particleCount = Math.max(
    Math.min(preferredWithinLimits, MIN_PARTICLE_COUNT),
    Math.min(preferredWithinLimits, scaledParticleCount)
  );

  return {
    particleCount,
    qualityTier: resolveQualityTier(particleCount, preferredParticleCount),
    scale: particleCount / preferredParticleCount,
  };
}

export function readRuntimeHeuristics(
  adapter: GPUAdapter,
  device: GPUDevice
): SimulationHeuristicsInput {
  const adapterWithFallbackFlag = adapter as GPUAdapter & { isFallbackAdapter?: boolean };
  const navigatorWithDeviceMemory = navigator as Navigator & { deviceMemory?: number };
  const devicePixelRatio = Math.max(window.devicePixelRatio || 1, 1);

  return {
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: navigatorWithDeviceMemory.deviceMemory,
    isFallbackAdapter: adapterWithFallbackFlag.isFallbackAdapter ?? false,
    maxStorageBufferBindingSize: device.limits.maxStorageBufferBindingSize,
    viewportPixels: window.innerWidth * window.innerHeight * devicePixelRatio * devicePixelRatio,
  };
}

/**
 * Resolves the quality tier based on the ratio of actual to preferred particle count.
 * @param particleCount - The actual particle count after scaling
 * @param preferredParticleCount - The preferred (default) particle count
 * @returns A quality tier: 'high', 'medium', or 'low'
 */
function resolveQualityTier(
  particleCount: number,
  preferredParticleCount: number
): SimulationQualityTier {
  const ratio = particleCount / preferredParticleCount;
  if (ratio >= 0.95) {
    return 'high';
  }
  if (ratio >= 0.7) {
    return 'medium';
  }
  return 'low';
}
