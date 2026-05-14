import { beforeEach, describe, expect, it, vi } from 'vitest';
import { encodeFrame } from './frame-encoder';
import {
  createMockBuffer,
  createMockCommandEncoder,
  createMockComputePassEncoder,
  createMockDevice,
  createMockRenderPassEncoder,
  createMockTexture,
  installMockWebGPUConstants,
} from '../test/webgpu-mock';
import { WORKGROUP_SIZE, type ParticleBuffers, type Pipelines, type Vec2 } from '../types';
import * as buffersModule from './buffers';

function createFrameFixture(): {
  device: GPUDevice;
  commandEncoder: GPUCommandEncoder;
  computePass: GPUComputePassEncoder;
  trailPass: GPURenderPassEncoder;
  renderPass: GPURenderPassEncoder;
  presentPass: GPURenderPassEncoder;
  pipelines: Pipelines;
  buffers: ParticleBuffers;
  trailTextureView: GPUTextureView;
  presentBindGroup: GPUBindGroup;
} {
  const computePass = createMockComputePassEncoder();
  const trailPass = createMockRenderPassEncoder();
  const renderPass = createMockRenderPassEncoder();
  const presentPass = createMockRenderPassEncoder();

  const commandEncoder = createMockCommandEncoder();
  const renderPasses = [trailPass, renderPass, presentPass];
  let renderPassIndex = 0;
  const beginRenderPass = vi.fn().mockImplementation(() => {
    const pass = renderPasses[renderPassIndex % renderPasses.length];
    renderPassIndex += 1;
    return pass;
  });
  Object.assign(commandEncoder, {
    beginComputePass: vi.fn().mockReturnValue(computePass),
    beginRenderPass,
  });

  const presentBindGroup = {} as GPUBindGroup;
  const trailTextureView = { label: 'trail-view' } as unknown as GPUTextureView;

  const device = createMockDevice({
    createCommandEncoder: vi.fn().mockReturnValue(commandEncoder),
  });

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;

  const buffers: ParticleBuffers = {
    particleBuffer: createMockBuffer(),
    uniformBuffer: createMockBuffer(),
    particleCount: 128,
  };

  const pipelines: Pipelines = {
    computePipeline: {} as GPUComputePipeline,
    renderPipeline: {} as GPURenderPipeline,
    trailPipeline: {} as GPURenderPipeline,
    presentPipeline: {} as GPURenderPipeline,
    computeBindGroup: {} as GPUBindGroup,
    renderBindGroup: {} as GPUBindGroup,
  };

  return {
    device,
    commandEncoder,
    computePass,
    trailPass,
    renderPass,
    presentPass,
    pipelines,
    buffers,
    trailTextureView,
    presentBindGroup,
  };
}

describe('frame-encoder', () => {
  beforeEach(() => {
    installMockWebGPUConstants();
    vi.restoreAllMocks();
  });

  it('encodes a frame with compute, trail, render, and present passes', () => {
    const fixture = createFrameFixture();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const context = {
      getCurrentTexture: vi.fn().mockReturnValue(createMockTexture()),
      configure: vi.fn(),
    } as unknown as GPUCanvasContext;

    const updateUniformBufferSpy = vi
      .spyOn(buffersModule, 'updateUniformBuffer')
      .mockImplementation(() => {});

    const mousePosition: Vec2 = { x: 12, y: 34 };

    const commandBuffer = encodeFrame({
      device: fixture.device,
      context,
      canvas,
      pipelines: fixture.pipelines,
      buffers: fixture.buffers,
      mousePosition,
      deltaTime: 0.02,
      trailTextureView: fixture.trailTextureView,
      presentBindGroup: fixture.presentBindGroup,
      trailTextureInitialized: true,
    });

    expect(commandBuffer).not.toBeNull();
    expect(updateUniformBufferSpy).toHaveBeenCalledWith(
      fixture.device,
      fixture.buffers.uniformBuffer,
      800,
      600,
      12,
      34,
      0.02
    );
    expect(fixture.computePass.setPipeline).toHaveBeenCalledWith(fixture.pipelines.computePipeline);
    expect(fixture.computePass.dispatchWorkgroups).toHaveBeenCalledWith(
      Math.ceil(fixture.buffers.particleCount / WORKGROUP_SIZE)
    );
    expect(fixture.trailPass.draw).toHaveBeenCalledWith(4);
    expect(fixture.renderPass.draw).toHaveBeenCalledWith(fixture.buffers.particleCount);
    expect(fixture.presentPass.draw).toHaveBeenCalledWith(4);
  });

  it('returns null when the canvas has no drawable size', () => {
    const fixture = createFrameFixture();
    const canvas = document.createElement('canvas');
    canvas.width = 0;
    canvas.height = 0;

    const context = {
      getCurrentTexture: vi.fn().mockReturnValue(createMockTexture()),
      configure: vi.fn(),
    } as unknown as GPUCanvasContext;

    const updateUniformBufferSpy = vi
      .spyOn(buffersModule, 'updateUniformBuffer')
      .mockImplementation(() => {});

    const commandBuffer = encodeFrame({
      device: fixture.device,
      context,
      canvas,
      pipelines: fixture.pipelines,
      buffers: fixture.buffers,
      mousePosition: { x: 0, y: 0 },
      deltaTime: 0.02,
      trailTextureView: fixture.trailTextureView,
      presentBindGroup: fixture.presentBindGroup,
      trailTextureInitialized: true,
    });

    expect(commandBuffer).toBeNull();
    expect(updateUniformBufferSpy).not.toHaveBeenCalled();
  });

  it('uses clear loadOp on the first frame and load on subsequent frames', () => {
    const fixture = createFrameFixture();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const context = {
      getCurrentTexture: vi.fn().mockReturnValue(createMockTexture()),
      configure: vi.fn(),
    } as unknown as GPUCanvasContext;

    vi.spyOn(buffersModule, 'updateUniformBuffer').mockImplementation(() => {});

    // First frame: trailTextureInitialized = false
    encodeFrame({
      device: fixture.device,
      context,
      canvas,
      pipelines: fixture.pipelines,
      buffers: fixture.buffers,
      mousePosition: { x: 0, y: 0 },
      deltaTime: 0.016,
      trailTextureView: fixture.trailTextureView,
      presentBindGroup: fixture.presentBindGroup,
      trailTextureInitialized: false,
    });

    // Second frame: trailTextureInitialized = true
    const fixture2 = createFrameFixture();
    encodeFrame({
      device: fixture2.device,
      context,
      canvas,
      pipelines: fixture2.pipelines,
      buffers: fixture2.buffers,
      mousePosition: { x: 0, y: 0 },
      deltaTime: 0.016,
      trailTextureView: fixture2.trailTextureView,
      presentBindGroup: fixture2.presentBindGroup,
      trailTextureInitialized: true,
    });
  });
});
