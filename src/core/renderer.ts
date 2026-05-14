import {
  WebGPUContext,
  Pipelines,
  ParticleBuffers,
  Vec2,
  DEFAULT_DELTA_TIME,
  MAX_DELTA_TIME,
} from '../types';
import { encodeFrame } from './frame-encoder';

/**
 * Renderer class manages the render loop
 */
export class Renderer {
  private ctx: WebGPUContext;
  private pipelines: Pipelines;
  private buffers: ParticleBuffers;
  private getMousePosition: () => Vec2;
  private onFrame?: () => void;
  private animationId: number | null = null;
  private isRunning = false;
  private lastFrameTime = 0;
  private presentSampler: GPUSampler;
  private trailTexture: GPUTexture | null = null;
  private trailTextureView: GPUTextureView | null = null;
  private presentBindGroup: GPUBindGroup | null = null;
  private trailTextureWidth = 0;
  private trailTextureHeight = 0;
  private trailTextureInitialized = false;

  constructor(
    ctx: WebGPUContext,
    pipelines: Pipelines,
    buffers: ParticleBuffers,
    getMousePosition: () => Vec2,
    onFrame?: () => void
  ) {
    this.ctx = ctx;
    this.pipelines = pipelines;
    this.buffers = buffers;
    this.getMousePosition = getMousePosition;
    this.onFrame = onFrame;
    this.presentSampler = ctx.device.createSampler({
      label: 'Present Sampler',
      magFilter: 'linear',
      minFilter: 'linear',
    });
  }

  /**
   * Start the render loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrameTime = 0;
    this.animationId = requestAnimationFrame(this.loop);
  }

  /**
   * Stop the render loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Destroy renderer-owned GPU resources
   */
  destroy(): void {
    this.stop();
    this.destroyTrailResources();
  }

  /**
   * Main render loop
   */
  private loop = (timestamp: number): void => {
    if (!this.isRunning) return;

    // Calculate deltaTime in seconds, capped to prevent spiral of death
    const dt =
      this.lastFrameTime === 0
        ? DEFAULT_DELTA_TIME
        : Math.min((timestamp - this.lastFrameTime) / 1000.0, MAX_DELTA_TIME);
    this.lastFrameTime = timestamp;

    this.render(dt);
    this.onFrame?.();
    this.animationId = requestAnimationFrame(this.loop);
  };

  private destroyTrailResources(): void {
    this.trailTexture?.destroy();
    this.trailTexture = null;
    this.trailTextureView = null;
    this.presentBindGroup = null;
    this.trailTextureWidth = 0;
    this.trailTextureHeight = 0;
    this.trailTextureInitialized = false;
  }

  private ensureTrailResources(): void {
    const { device, canvas, format } = this.ctx;
    const width = canvas.width;
    const height = canvas.height;

    if (
      width === this.trailTextureWidth &&
      height === this.trailTextureHeight &&
      this.trailTextureView
    ) {
      return;
    }

    this.destroyTrailResources();

    this.trailTexture = device.createTexture({
      label: 'Trail Texture',
      size: { width, height, depthOrArrayLayers: 1 },
      format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.trailTextureView = this.trailTexture.createView();
    this.presentBindGroup = device.createBindGroup({
      label: 'Present Bind Group',
      layout: this.pipelines.presentPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.presentSampler },
        { binding: 1, resource: this.trailTextureView },
      ],
    });
    this.trailTextureWidth = width;
    this.trailTextureHeight = height;
  }

  /**
   * Render a single frame
   */
  private render(deltaTime: number): void {
    const { canvas } = this.ctx;

    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    this.ensureTrailResources();

    if (!this.trailTextureView || !this.presentBindGroup) {
      return;
    }

    const mousePos = this.getMousePosition();
    const commandBuffer = encodeFrame({
      device: this.ctx.device,
      context: this.ctx.context,
      canvas,
      pipelines: this.pipelines,
      buffers: this.buffers,
      mousePosition: mousePos,
      deltaTime,
      trailTextureView: this.trailTextureView,
      presentBindGroup: this.presentBindGroup,
      trailTextureInitialized: this.trailTextureInitialized,
    });

    if (commandBuffer) {
      this.ctx.device.queue.submit([commandBuffer]);
      this.trailTextureInitialized = true;
    }
  }
}

/**
 * Create and return a renderer instance
 */
export function createRenderer(
  ctx: WebGPUContext,
  pipelines: Pipelines,
  buffers: ParticleBuffers,
  getMousePosition: () => Vec2,
  onFrame?: () => void
): Renderer {
  return new Renderer(ctx, pipelines, buffers, getMousePosition, onFrame);
}
