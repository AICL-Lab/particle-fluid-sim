import {
  Vec2,
  PARTICLE_COUNT,
  OFFSCREEN_COORDINATE,
} from '../types';
import type { ParticleBuffers, Pipelines } from '../types';
import {
  initializeParticles,
  createParticleBuffer,
  createUniformBuffer,
  updateUniformBuffer,
} from './buffers';
import {
  createComputePipeline,
  createRenderPipeline,
  createTrailPipeline,
  createPresentPipeline,
} from './pipelines';

/**
 * Bundles all GPU resources needed for a single simulation instance.
 *
 * This is the single seam for resource creation and destruction.
 * Callers do not need to know the ordering dependency between
 * buffers and pipelines (bind groups require both).
 */
export interface SimulationResources {
  buffers: ParticleBuffers;
  pipelines: Pipelines;
}

/**
 * Create all GPU resources needed for the particle simulation.
 *
 * Ordering invariants:
 * 1. Buffers must exist before bind groups are created.
 * 2. Pipeline layouts must exist before pipelines are created.
 * 3. Pipelines must exist before bind groups reference their layouts.
 */
export function createSimulationResources(
  device: GPUDevice,
  format: GPUTextureFormat,
  canvasSize: Vec2,
  particleCount: number = PARTICLE_COUNT
): SimulationResources {
  const particleData = initializeParticles(canvasSize, particleCount);
  const particleBuffer = createParticleBuffer(device, particleData);
  const uniformBuffer = createUniformBuffer(device);

  // Initialize uniform buffer with offscreen mouse coordinates
  updateUniformBuffer(
    device,
    uniformBuffer,
    canvasSize.x,
    canvasSize.y,
    OFFSCREEN_COORDINATE,
    OFFSCREEN_COORDINATE
  );

  const buffers: ParticleBuffers = { particleBuffer, uniformBuffer, particleCount };

  const { pipeline: computePipeline, bindGroupLayout: computeBindGroupLayout } =
    createComputePipeline(device);

  const { pipeline: renderPipeline, bindGroupLayout: renderBindGroupLayout } = createRenderPipeline(
    device,
    format
  );

  const trailPipeline = createTrailPipeline(device, format);
  const presentPipeline = createPresentPipeline(device, format);

  const computeBindGroup = device.createBindGroup({
    label: 'Compute Bind Group',
    layout: computeBindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: particleBuffer } },
      { binding: 1, resource: { buffer: uniformBuffer } },
    ],
  });

  const renderBindGroup = device.createBindGroup({
    label: 'Render Bind Group',
    layout: renderBindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: particleBuffer } },
      { binding: 1, resource: { buffer: uniformBuffer } },
    ],
  });

  const pipelines: Pipelines = {
    computePipeline,
    renderPipeline,
    trailPipeline,
    presentPipeline,
    computeBindGroup,
    renderBindGroup,
  };

  return { buffers, pipelines };
}

/**
 * Destroy all mutable GPU resources owned by the simulation.
 */
export function destroySimulationResources(resources: SimulationResources): void {
  resources.buffers.particleBuffer.destroy();
  resources.buffers.uniformBuffer.destroy();
}
