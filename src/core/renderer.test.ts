import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Renderer, createRenderer } from './renderer';
import {
  createMockBuffer,
  createMockCommandEncoder,
  createMockComputePassEncoder,
  createMockDevice,
  createMockRenderPassEncoder,
  createMockTexture,
  installMockWebGPUConstants,
} from '../test/webgpu-mock';
import { WORKGROUP_SIZE, type ParticleBuffers, type Pipelines, type WebGPUContext } from '../types';
import * as buffersModule from './buffers';

function createRendererFixture(): {
  renderer: Renderer;
  ctx: WebGPUContext;
  buffers: ParticleBuffers;
  pipelines: Pipelines;
  device: GPUDevice;
  commandEncoder: GPUCommandEncoder;
  computePass: GPUComputePassEncoder;
  trailPass: GPURenderPassEncoder;
  renderPass: GPURenderPassEncoder;
  presentPass: GPURenderPassEncoder;
  trailTexture: GPUTexture;
} {
  const computePass = createMockComputePassEncoder();
  const trailPass = createMockRenderPassEncoder();
  const renderPass = createMockRenderPassEncoder();
  const presentPass = createMockRenderPassEncoder();
  const commandEncoder = createMockCommandEncoder();
  const trailTexture = createMockTexture({
    createView: vi.fn().mockReturnValue({ label: 'trail-view' } as unknown as GPUTextureView),
  });
  const currentTexture = createMockTexture({
    createView: vi.fn().mockReturnValue({ label: 'current-view' } as unknown as GPUTextureView),
  });

  const beginComputePass = vi.fn().mockReturnValue(computePass);
  const renderPasses = [trailPass, renderPass, presentPass];
  let renderPassIndex = 0;
  const beginRenderPass = vi.fn().mockImplementation(() => {
    const pass = renderPasses[renderPassIndex % renderPasses.length];
    renderPassIndex += 1;
    return pass;
  });
  const finish = vi.fn().mockReturnValue({} as GPUCommandBuffer);
  Object.assign(commandEncoder, {
    beginComputePass,
    beginRenderPass,
    finish,
  });

  const presentPipeline = {
    getBindGroupLayout: vi.fn().mockReturnValue({ label: 'present-layout' } as GPUBindGroupLayout),
  } as unknown as GPURenderPipeline;

  const device = createMockDevice({
    createCommandEncoder: vi.fn().mockReturnValue(commandEncoder),
    createTexture: vi.fn().mockReturnValue(trailTexture),
  });

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;

  const ctx = {
    adapter: {} as GPUAdapter,
    device,
    context: {
      getCurrentTexture: vi.fn().mockReturnValue(currentTexture),
      configure: vi.fn(),
    } as unknown as GPUCanvasContext,
    format: 'bgra8unorm' as GPUTextureFormat,
    canvas,
  };

  const buffers: ParticleBuffers = {
    particleBuffer: createMockBuffer(),
    uniformBuffer: createMockBuffer(),
    particleCount: 128,
  };

  const pipelines: Pipelines = {
    computePipeline: {} as GPUComputePipeline,
    renderPipeline: {} as GPURenderPipeline,
    trailPipeline: {} as GPURenderPipeline,
    presentPipeline,
    computeBindGroup: {} as GPUBindGroup,
    renderBindGroup: {} as GPUBindGroup,
  };

  const renderer = createRenderer(ctx, pipelines, buffers, () => ({ x: 12, y: 34 }), vi.fn());

  return {
    renderer,
    ctx,
    buffers,
    pipelines,
    device,
    commandEncoder,
    computePass,
    trailPass,
    renderPass,
    presentPass,
    trailTexture,
  };
}

describe('renderer', () => {
  beforeEach(() => {
    installMockWebGPUConstants();
    vi.restoreAllMocks();
  });

  it('creates a renderer instance', () => {
    const fixture = createRendererFixture();

    expect(fixture.renderer).toBeInstanceOf(Renderer);
  });

  it('renders a frame with compute, trail, render, and present passes', () => {
    const fixture = createRendererFixture();
    const updateUniformBufferSpy = vi
      .spyOn(buffersModule, 'updateUniformBuffer')
      .mockImplementation(() => {});

    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.02);

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
    expect(fixture.device.queue.submit).toHaveBeenCalledTimes(1);
  });

  it('reuses trail resources until the canvas size changes', () => {
    const fixture = createRendererFixture();
    vi.spyOn(buffersModule, 'updateUniformBuffer').mockImplementation(() => {});

    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.02);
    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.03);

    expect(fixture.device.createTexture).toHaveBeenCalledTimes(1);

    fixture.ctx.canvas.width = 1024;
    fixture.ctx.canvas.height = 768;
    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.04);

    expect(fixture.device.createTexture).toHaveBeenCalledTimes(2);
    expect(fixture.trailTexture.destroy).toHaveBeenCalledTimes(1);
  });

  it('skips rendering when the canvas has no drawable size', () => {
    const fixture = createRendererFixture();
    const updateUniformBufferSpy = vi
      .spyOn(buffersModule, 'updateUniformBuffer')
      .mockImplementation(() => {});

    fixture.ctx.canvas.width = 0;
    fixture.ctx.canvas.height = 0;

    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.02);

    expect(updateUniformBufferSpy).not.toHaveBeenCalled();
    expect(fixture.device.queue.submit).not.toHaveBeenCalled();
  });

  it('start and stop manage the animation loop', () => {
    const fixture = createRendererFixture();
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(99);
    const cancelAnimationFrameSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});

    fixture.renderer.start();
    fixture.renderer.stop();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(99);
  });

  it('destroy stops the animation loop and destroys trail resources', () => {
    const fixture = createRendererFixture();
    vi.spyOn(buffersModule, 'updateUniformBuffer').mockImplementation(() => {});
    const cancelAnimationFrameSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});

    // First render to initialize trail texture
    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.02);

    fixture.renderer.start();
    fixture.renderer.destroy();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(fixture.trailTexture.destroy).toHaveBeenCalled();
  });

  it('destroy is idempotent - can be called multiple times', () => {
    const fixture = createRendererFixture();
    vi.spyOn(buffersModule, 'updateUniformBuffer').mockImplementation(() => {});

    // First render to initialize trail texture
    (fixture.renderer as unknown as { render: (deltaTime: number) => void }).render(0.02);

    fixture.renderer.destroy();
    fixture.renderer.destroy();

    expect(fixture.trailTexture.destroy).toHaveBeenCalledTimes(1);
  });

  it('start is idempotent - calling twice does not start two loops', () => {
    const fixture = createRendererFixture();
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);

    fixture.renderer.start();
    fixture.renderer.start();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
  });

  it('animation loop calls render and schedules next frame', () => {
    const fixture = createRendererFixture();
    vi.spyOn(buffersModule, 'updateUniformBuffer').mockImplementation(() => {});

    let frameCallback: FrameRequestCallback | undefined;
    const requestAnimationFrameSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        frameCallback = cb;
        return 1;
      });

    fixture.renderer.start();

    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);

    // Simulate first frame
    if (frameCallback) {
      frameCallback(16);
    }

    expect(fixture.device.queue.submit).toHaveBeenCalled();
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
  });

  it('animation loop stops when stop is called', () => {
    const fixture = createRendererFixture();
    vi.spyOn(buffersModule, 'updateUniformBuffer').mockImplementation(() => {});

    let frameCallback: FrameRequestCallback | undefined;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      frameCallback = cb;
      return 1;
    });

    fixture.renderer.start();
    fixture.renderer.stop();

    // Simulate frame callback after stop
    if (frameCallback) {
      frameCallback(16);
    }

    // Should not have scheduled another frame after stop
    expect(fixture.device.queue.submit).not.toHaveBeenCalled();
  });

  it('animation loop calculates deltaTime correctly', () => {
    const fixture = createRendererFixture();
    const updateUniformBufferSpy = vi
      .spyOn(buffersModule, 'updateUniformBuffer')
      .mockImplementation(() => {});

    let frameCallback: FrameRequestCallback | undefined;
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      frameCallback = cb;
      return 1;
    });

    fixture.renderer.start();

    // First frame (no previous time, uses DEFAULT_DELTA_TIME)
    if (frameCallback) {
      frameCallback(0);
    }

    // Second frame (16ms later)
    if (frameCallback) {
      frameCallback(16);
    }

    // Check that deltaTime was calculated for second frame
    const lastCall =
      updateUniformBufferSpy.mock.calls[updateUniformBufferSpy.mock.calls.length - 1];
    const deltaTime = lastCall[6]; // deltaTime is the 7th argument
    expect(deltaTime).toBeCloseTo(0.016, 2);
  });
});
