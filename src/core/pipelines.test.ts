import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createComputePipeline, createRenderPipeline } from './pipelines';
import {
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

});
