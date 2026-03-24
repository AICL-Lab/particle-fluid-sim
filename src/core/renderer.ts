import {
  WebGPUContext,
  Pipelines,
  ParticleBuffers,
  Vec2,
  DEFAULT_DELTA_TIME,
  MAX_DELTA_TIME,
  WORKGROUP_SIZE,
} from '../types';
import { updateUniformBuffer } from './buffers';

const CLEAR_COLOR: GPUColor = { r: 0, g: 0, b: 0, a: 1 };

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
    const { device, context, canvas } = this.ctx;
    const {
      computePipeline,
      renderPipeline,
      trailPipeline,
      presentPipeline,
      computeBindGroup,
      renderBindGroup,
    } = this.pipelines;

    if (canvas.width === 0 || canvas.height === 0) {
      return;
    }

    this.ensureTrailResources();

    if (!this.trailTextureView || !this.presentBindGroup) {
      return;
    }

    // Update uniforms with current canvas size, mouse position, and deltaTime
    const mousePos = this.getMousePosition();
    updateUniformBuffer(
      device,
      this.buffers.uniformBuffer,
      canvas.width,
      canvas.height,
      mousePos.x,
      mousePos.y,
      deltaTime
    );

    // Get current texture to render to
    const textureView = context.getCurrentTexture().createView();

    // Create command encoder
    const commandEncoder = device.createCommandEncoder({
      label: 'Main Command Encoder',
    });

    // === Compute Pass ===
    const computePass = commandEncoder.beginComputePass({
      label: 'Compute Pass',
    });
    computePass.setPipeline(computePipeline);
    computePass.setBindGroup(0, computeBindGroup);
    // Dispatch enough workgroups to cover all particles
    const workgroupCount = Math.ceil(this.buffers.particleCount / WORKGROUP_SIZE);
    computePass.dispatchWorkgroups(workgroupCount);
    computePass.end();

    // === Trail Pass (fade effect into persistent offscreen texture) ===
    const trailLoadOp: GPULoadOp = this.trailTextureInitialized ? 'load' : 'clear';
    const trailPass = commandEncoder.beginRenderPass({
      label: 'Trail Pass',
      colorAttachments: [
        {
          view: this.trailTextureView,
          loadOp: trailLoadOp,
          clearValue: CLEAR_COLOR,
          storeOp: 'store',
        },
      ],
    });
    trailPass.setPipeline(trailPipeline);
    trailPass.draw(4); // Fullscreen quad (4 vertices)
    trailPass.end();

    // === Render Pass (particles) ===
    const renderPass = commandEncoder.beginRenderPass({
      label: 'Render Pass',
      colorAttachments: [
        {
          view: this.trailTextureView,
          loadOp: 'load',
          storeOp: 'store',
        },
      ],
    });
    renderPass.setPipeline(renderPipeline);
    renderPass.setBindGroup(0, renderBindGroup);
    renderPass.draw(this.buffers.particleCount); // One vertex per particle
    renderPass.end();

    // === Present Pass ===
    const presentPass = commandEncoder.beginRenderPass({
      label: 'Present Pass',
      colorAttachments: [
        {
          view: textureView,
          loadOp: 'clear',
          clearValue: CLEAR_COLOR,
          storeOp: 'store',
        },
      ],
    });
    presentPass.setPipeline(presentPipeline);
    presentPass.setBindGroup(0, this.presentBindGroup);
    presentPass.draw(4);
    presentPass.end();

    // Submit commands
    device.queue.submit([commandEncoder.finish()]);
    this.trailTextureInitialized = true;
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
