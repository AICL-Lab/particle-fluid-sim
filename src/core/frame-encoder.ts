import {
  Pipelines,
  ParticleBuffers,
  Vec2,
  WORKGROUP_SIZE,
} from '../types';
import { updateUniformBuffer } from './buffers';

const CLEAR_COLOR: GPUColor = { r: 0, g: 0, b: 0, a: 1 };

export interface FrameEncodingParams {
  device: GPUDevice;
  context: GPUCanvasContext;
  canvas: HTMLCanvasElement;
  pipelines: Pipelines;
  buffers: ParticleBuffers;
  mousePosition: Vec2;
  deltaTime: number;
  trailTextureView: GPUTextureView;
  presentBindGroup: GPUBindGroup;
  trailTextureInitialized: boolean;
}

/**
 * Encode a single simulation frame into a GPUCommandBuffer.
 *
 * Returns null when the canvas has no drawable area.
 */
export function encodeFrame(params: FrameEncodingParams): GPUCommandBuffer | null {
  const {
    device,
    context,
    canvas,
    pipelines,
    buffers,
    mousePosition,
    deltaTime,
    trailTextureView,
    presentBindGroup,
    trailTextureInitialized,
  } = params;

  if (canvas.width === 0 || canvas.height === 0) {
    return null;
  }

  // Update uniforms with current canvas size, mouse position, and deltaTime
  updateUniformBuffer(
    device,
    buffers.uniformBuffer,
    canvas.width,
    canvas.height,
    mousePosition.x,
    mousePosition.y,
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
  computePass.setPipeline(pipelines.computePipeline);
  computePass.setBindGroup(0, pipelines.computeBindGroup);
  // Dispatch enough workgroups to cover all particles
  const workgroupCount = Math.ceil(buffers.particleCount / WORKGROUP_SIZE);
  computePass.dispatchWorkgroups(workgroupCount);
  computePass.end();

  // === Trail Pass (fade effect into persistent offscreen texture) ===
  const trailLoadOp: GPULoadOp = trailTextureInitialized ? 'load' : 'clear';
  const trailPass = commandEncoder.beginRenderPass({
    label: 'Trail Pass',
    colorAttachments: [
      {
        view: trailTextureView,
        loadOp: trailLoadOp,
        clearValue: CLEAR_COLOR,
        storeOp: 'store',
      },
    ],
  });
  trailPass.setPipeline(pipelines.trailPipeline);
  trailPass.draw(4); // Fullscreen quad (4 vertices)
  trailPass.end();

  // === Render Pass (particles) ===
  const renderPass = commandEncoder.beginRenderPass({
    label: 'Render Pass',
    colorAttachments: [
      {
        view: trailTextureView,
        loadOp: 'load',
        storeOp: 'store',
      },
    ],
  });
  renderPass.setPipeline(pipelines.renderPipeline);
  renderPass.setBindGroup(0, pipelines.renderBindGroup);
  renderPass.draw(buffers.particleCount); // One vertex per particle
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
  presentPass.setPipeline(pipelines.presentPipeline);
  presentPass.setBindGroup(0, presentBindGroup);
  presentPass.draw(4);
  presentPass.end();

  // Submit commands
  return commandEncoder.finish();
}
