import {
  buildComputeShaderPreamble,
  buildRenderShaderPreamble,
  buildTrailShaderPreamble,
} from '../config/sim';

// Import shader sources as strings
import computeShaderSource from '../shaders/compute.wgsl?raw';
import renderShaderSource from '../shaders/render.wgsl?raw';
import trailShaderSource from '../shaders/trail.wgsl?raw';
import presentShaderSource from '../shaders/present.wgsl?raw';

/**
 * Create the compute pipeline for particle physics
 */
export function createComputePipeline(device: GPUDevice): {
  pipeline: GPUComputePipeline;
  bindGroupLayout: GPUBindGroupLayout;
} {
  const computeModule = device.createShaderModule({
    label: 'Compute Shader',
    code: `${buildComputeShaderPreamble()}\n${computeShaderSource}`,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    label: 'Compute Bind Group Layout',
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'uniform' },
      },
    ],
  });

  const pipelineLayout = device.createPipelineLayout({
    label: 'Compute Pipeline Layout',
    bindGroupLayouts: [bindGroupLayout],
  });

  const pipeline = device.createComputePipeline({
    label: 'Compute Pipeline',
    layout: pipelineLayout,
    compute: {
      module: computeModule,
      entryPoint: 'main',
    },
  });

  return { pipeline, bindGroupLayout };
}

/**
 * Create the render pipeline for particle rendering
 */
export function createRenderPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): { pipeline: GPURenderPipeline; bindGroupLayout: GPUBindGroupLayout } {
  const renderModule = device.createShaderModule({
    label: 'Render Shader',
    code: `${buildRenderShaderPreamble()}\n${renderShaderSource}`,
  });

  const bindGroupLayout = device.createBindGroupLayout({
    label: 'Render Bind Group Layout',
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'read-only-storage' },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: 'uniform' },
      },
    ],
  });

  const pipelineLayout = device.createPipelineLayout({
    label: 'Render Pipeline Layout',
    bindGroupLayouts: [bindGroupLayout],
  });

  const pipeline = device.createRenderPipeline({
    label: 'Render Pipeline',
    layout: pipelineLayout,
    vertex: {
      module: renderModule,
      entryPoint: 'vertexMain',
    },
    fragment: {
      module: renderModule,
      entryPoint: 'fragmentMain',
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one',
            },
          },
        },
      ],
    },
    primitive: {
      topology: 'point-list',
    },
  });

  return { pipeline, bindGroupLayout };
}

/**
 * Create the trail pipeline for fade effect
 */
export function createTrailPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline {
  const trailModule = device.createShaderModule({
    label: 'Trail Shader',
    code: `${buildTrailShaderPreamble()}\n${trailShaderSource}`,
  });

  const pipeline = device.createRenderPipeline({
    label: 'Trail Pipeline',
    layout: 'auto',
    vertex: {
      module: trailModule,
      entryPoint: 'vertexMain',
    },
    fragment: {
      module: trailModule,
      entryPoint: 'fragmentMain',
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one',
            },
          },
        },
      ],
    },
    primitive: {
      topology: 'triangle-strip',
    },
  });

  return pipeline;
}

/**
 * Create the present pipeline for compositing the persistent trail texture
 */
export function createPresentPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline {
  const presentModule = device.createShaderModule({
    label: 'Present Shader',
    code: presentShaderSource,
  });

  return device.createRenderPipeline({
    label: 'Present Pipeline',
    layout: 'auto',
    vertex: {
      module: presentModule,
      entryPoint: 'vertexMain',
    },
    fragment: {
      module: presentModule,
      entryPoint: 'fragmentMain',
      targets: [{ format }],
    },
    primitive: {
      topology: 'triangle-strip',
    },
  });
}


