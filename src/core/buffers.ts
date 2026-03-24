import {
  DEFAULT_DELTA_TIME,
  Vec2,
  ParticleBuffers,
  INITIAL_VELOCITY_RANGE,
  OFFSCREEN_COORDINATE,
  PARTICLE_COUNT,
  PARTICLE_SIZE,
  UNIFORM_BUFFER_SIZE,
} from '../types';

export function initializeParticles(
  canvasSize: Vec2,
  particleCount: number = PARTICLE_COUNT
): Float32Array {
  const data = new Float32Array(particleCount * 4); // 4 floats per particle

  for (let i = 0; i < particleCount; i++) {
    const offset = i * 4;
    // Random position within canvas bounds
    data[offset + 0] = Math.random() * canvasSize.x; // x
    data[offset + 1] = Math.random() * canvasSize.y; // y
    // Random velocity (small values)
    data[offset + 2] = (Math.random() - 0.5) * INITIAL_VELOCITY_RANGE; // vx
    data[offset + 3] = (Math.random() - 0.5) * INITIAL_VELOCITY_RANGE; // vy
  }

  return data;
}

/**
 * Create particle storage buffer
 */
export function createParticleBuffer(device: GPUDevice, initialData: Float32Array): GPUBuffer {
  const particleCount = initialData.length / 4;
  const buffer = device.createBuffer({
    size: particleCount * PARTICLE_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });

  new Float32Array(buffer.getMappedRange()).set(initialData);
  buffer.unmap();

  return buffer;
}

/**
 * Create uniform buffer for global parameters
 */
export function createUniformBuffer(device: GPUDevice): GPUBuffer {
  return device.createBuffer({
    size: UNIFORM_BUFFER_SIZE,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
}

/**
 * Update uniform buffer with new values
 */
export function updateUniformBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  deltaTime: number = DEFAULT_DELTA_TIME
): void {
  const data = new Float32Array([width, height, mouseX, mouseY, deltaTime, 0, 0, 0]);
  device.queue.writeBuffer(buffer, 0, data);
}

/**
 * Create all buffers needed for the particle system
 */
export function createBuffers(
  device: GPUDevice,
  canvasSize: Vec2,
  particleCount: number = PARTICLE_COUNT
): ParticleBuffers {
  const particleData = initializeParticles(canvasSize, particleCount);
  const particleBuffer = createParticleBuffer(device, particleData);
  const uniformBuffer = createUniformBuffer(device);

  // Initialize uniform buffer
  updateUniformBuffer(
    device,
    uniformBuffer,
    canvasSize.x,
    canvasSize.y,
    OFFSCREEN_COORDINATE,
    OFFSCREEN_COORDINATE
  );

  return { particleBuffer, uniformBuffer, particleCount };
}

/**
 * Validate that particle data is within bounds (for testing)
 */
export function validateParticleData(
  data: Float32Array,
  canvasSize: Vec2,
  particleCount: number = data.length / 4
): boolean {
  for (let i = 0; i < particleCount; i++) {
    const offset = i * 4;
    const x = data[offset + 0];
    const y = data[offset + 1];

    if (x < 0 || x > canvasSize.x || y < 0 || y > canvasSize.y) {
      return false;
    }
  }
  return true;
}
