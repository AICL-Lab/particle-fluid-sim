import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createComputePipeline, createPipelines, createRenderPipeline } from './pipelines';
import {
  createMockBuffer,
  createMockDevice,
  installMockWebGPUConstants,
} from '../test/webgpu-mock';

describe('pipelines', () => {
  beforeEach(() => {
    installMockWebGPUConstants();
  });

  it('creates the compute pipeline with expected bindings', () => {
    const bindGroupLayout = {} as GPUBindGroupLayout;
    const pipeline = {} as GPUComputePipeline;
    const device = createMockDevice({
      createBindGroupLayout: vi.fn().mockReturnValue(bindGroupLayout),
      createComputePipeline: vi.fn().mockReturnValue(pipeline),
    });

    const result = createComputePipeline(device);

    expect(device.createShaderModule).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Compute Shader',
        code: expect.stringContaining('const GRAVITY'),
      })
    );
    expect(device.createBindGroupLayout).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Compute Bind Group Layout',
        entries: [
          expect.objectContaining({
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
          }),
          expect.objectContaining({
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
          }),
        ],
      })
    );
    expect(result).toEqual({
      pipeline,
      bindGroupLayout,
    });
  });

  it('creates the render pipeline with point rendering and alpha blending', () => {
    const bindGroupLayout = {} as GPUBindGroupLayout;
    const pipeline = {} as GPURenderPipeline;
    const device = createMockDevice({
      createBindGroupLayout: vi.fn().mockReturnValue(bindGroupLayout),
      createRenderPipeline: vi.fn().mockReturnValue(pipeline),
    });

    const result = createRenderPipeline(device, 'bgra8unorm');

    expect(device.createShaderModule).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Render Shader',
        code: expect.stringContaining('const CYAN'),
      })
    );
    expect(device.createRenderPipeline).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Render Pipeline',
        primitive: {
          topology: 'point-list',
        },
        fragment: expect.objectContaining({
          targets: [
            expect.objectContaining({
              format: 'bgra8unorm',
            }),
          ],
        }),
      })
    );
    expect(result).toEqual({
      pipeline,
      bindGroupLayout,
    });
  });

  it('creates bind groups that point at the supplied buffers', () => {
    const particleBuffer = createMockBuffer();
    const uniformBuffer = createMockBuffer();
    const createdBindGroups: unknown[] = [];
    const device = createMockDevice({
      createBindGroup: vi.fn().mockImplementation((descriptor) => {
        createdBindGroups.push(descriptor);
        return { descriptor } as unknown as GPUBindGroup;
      }),
    });

    const result = createPipelines(device, 'bgra8unorm', {
      particleBuffer,
      uniformBuffer,
      particleCount: 256,
    });

    expect(device.createBindGroup).toHaveBeenCalledTimes(2);
    expect(createdBindGroups).toEqual([
      expect.objectContaining({
        label: 'Compute Bind Group',
        entries: [
          { binding: 0, resource: { buffer: particleBuffer } },
          { binding: 1, resource: { buffer: uniformBuffer } },
        ],
      }),
      expect.objectContaining({
        label: 'Render Bind Group',
        entries: [
          { binding: 0, resource: { buffer: particleBuffer } },
          { binding: 1, resource: { buffer: uniformBuffer } },
        ],
      }),
    ]);
    expect(result.computeBindGroup).toBeDefined();
    expect(result.renderBindGroup).toBeDefined();
  });
});
