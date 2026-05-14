import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSimulationResources, destroySimulationResources } from './simulation-resources';
import {
  createMockBuffer,
  createMockDevice,
  installMockWebGPUConstants,
} from '../test/webgpu-mock';
import { PARTICLE_COUNT, OFFSCREEN_COORDINATE } from '../types';

describe('simulation-resources', () => {
  beforeEach(() => {
    installMockWebGPUConstants();
    vi.restoreAllMocks();
  });

  it('creates particle and uniform buffers', () => {
    const device = createMockDevice();
    const canvasSize = { x: 800, y: 600 };

    device.createBuffer = vi.fn((descriptor) => {
      const buffer = createMockBuffer();
      if (descriptor.mappedAtCreation && descriptor.size) {
        buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
      }
      return buffer;
    });

    const resources = createSimulationResources(device, 'bgra8unorm', canvasSize, 10);

    expect(resources.buffers.particleBuffer).toBeDefined();
    expect(resources.buffers.uniformBuffer).toBeDefined();
  });

  it('returns the requested particle count', () => {
    const device = createMockDevice();
    const canvasSize = { x: 800, y: 600 };

    device.createBuffer = vi.fn((descriptor) => {
      const buffer = createMockBuffer();
      if (descriptor.mappedAtCreation && descriptor.size) {
        buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
      }
      return buffer;
    });

    const resources = createSimulationResources(device, 'bgra8unorm', canvasSize, 50);

    expect(resources.buffers.particleCount).toBe(50);
  });

  it('uses the default PARTICLE_COUNT when not specified', () => {
    const device = createMockDevice();
    const canvasSize = { x: 800, y: 600 };

    device.createBuffer = vi.fn((descriptor) => {
      const buffer = createMockBuffer();
      if (descriptor.mappedAtCreation && descriptor.size) {
        buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
      }
      return buffer;
    });

    const resources = createSimulationResources(device, 'bgra8unorm', canvasSize);

    expect(resources.buffers.particleCount).toBe(PARTICLE_COUNT);
  });

  it('initializes the uniform buffer with offscreen coordinates', () => {
    const device = createMockDevice();
    const canvasSize = { x: 1024, y: 768 };

    device.createBuffer = vi.fn((descriptor) => {
      const buffer = createMockBuffer();
      if (descriptor.mappedAtCreation && descriptor.size) {
        buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
      }
      return buffer;
    });

    createSimulationResources(device, 'bgra8unorm', canvasSize, 10);

    const callArgs = device.queue.writeBuffer as ReturnType<typeof vi.fn>;
    const writtenData = callArgs.mock.calls[0][2] as Float32Array;

    expect(writtenData[0]).toBe(1024);
    expect(writtenData[1]).toBe(768);
    expect(writtenData[2]).toBe(OFFSCREEN_COORDINATE);
    expect(writtenData[3]).toBe(OFFSCREEN_COORDINATE);
  });

  it('creates bind groups wired to the created buffers', () => {
    const device = createMockDevice();
    const canvasSize = { x: 800, y: 600 };

    device.createBuffer = vi.fn((descriptor) => {
      const buffer = createMockBuffer();
      if (descriptor.mappedAtCreation && descriptor.size) {
        buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
      }
      return buffer;
    });

    const createdBindGroups: unknown[] = [];
    device.createBindGroup = vi.fn().mockImplementation((descriptor) => {
      createdBindGroups.push(descriptor);
      return { descriptor } as unknown as GPUBindGroup;
    });

    const resources = createSimulationResources(device, 'bgra8unorm', canvasSize, 10);

    expect(device.createBindGroup).toHaveBeenCalledTimes(2);
    expect(createdBindGroups).toEqual([
      expect.objectContaining({
        label: 'Compute Bind Group',
        entries: [
          { binding: 0, resource: { buffer: resources.buffers.particleBuffer } },
          { binding: 1, resource: { buffer: resources.buffers.uniformBuffer } },
        ],
      }),
      expect.objectContaining({
        label: 'Render Bind Group',
        entries: [
          { binding: 0, resource: { buffer: resources.buffers.particleBuffer } },
          { binding: 1, resource: { buffer: resources.buffers.uniformBuffer } },
        ],
      }),
    ]);
    expect(resources.pipelines.computeBindGroup).toBeDefined();
    expect(resources.pipelines.renderBindGroup).toBeDefined();
  });

  it('destroys both buffers when destroyed', () => {
    const device = createMockDevice();
    const canvasSize = { x: 800, y: 600 };

    const particleBuffer = createMockBuffer();
    const uniformBuffer = createMockBuffer();
    let callCount = 0;
    device.createBuffer = vi.fn(() => {
      callCount++;
      return callCount === 1 ? particleBuffer : uniformBuffer;
    });

    const resources = createSimulationResources(device, 'bgra8unorm', canvasSize, 10);
    destroySimulationResources(resources);

    expect(particleBuffer.destroy).toHaveBeenCalled();
    expect(uniformBuffer.destroy).toHaveBeenCalled();
  });
});
