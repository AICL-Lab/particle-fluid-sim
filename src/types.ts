// Particle data structure (matches WGSL struct)
export interface Particle {
  x: number; // position x
  y: number; // position y
  vx: number; // velocity x
  vy: number; // velocity y
}

// 2D Vector type
export interface Vec2 {
  x: number;
  y: number;
}

// Uniform data structure (must match WGSL Uniforms struct layout)
export interface Uniforms {
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  deltaTime: number;
  _pad1: number; // padding to 16-byte alignment
  _pad2: number;
  _pad3: number;
}

// WebGPU context after initialization
export interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
  canvas: HTMLCanvasElement;
}

// Buffer collection
export interface ParticleBuffers {
  particleBuffer: GPUBuffer;
  uniformBuffer: GPUBuffer;
  particleCount: number;
}

// Pipeline collection
export interface Pipelines {
  computePipeline: GPUComputePipeline;
  renderPipeline: GPURenderPipeline;
  trailPipeline: GPURenderPipeline;
  presentPipeline: GPURenderPipeline;
  computeBindGroup: GPUBindGroup;
  renderBindGroup: GPUBindGroup;
}

// Color type (RGB, 0-1 range)
export interface Color {
  r: number;
  g: number;
  b: number;
}

export {
  COLOR_MAX_SPEED,
  CYAN,
  DAMPING,
  DEFAULT_DELTA_TIME,
  GRAVITY,
  INITIAL_VELOCITY_RANGE,
  MAX_DELTA_TIME,
  MAX_SPEED,
  OFFSCREEN_COORDINATE,
  PARTICLE_COUNT,
  PARTICLE_SIZE,
  PURPLE,
  REPULSION_RADIUS,
  REPULSION_STRENGTH,
  TRAIL_FADE_ALPHA,
  UNIFORM_BUFFER_SIZE,
  UNIFORM_FLOAT_COUNT,
  WORKGROUP_SIZE,
} from './config/sim';
