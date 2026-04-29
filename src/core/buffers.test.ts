import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import {
  initializeParticles,
  validateParticleData,
  createParticleBuffer,
  createUniformBuffer,
  updateUniformBuffer,
  createBuffers,
} from './buffers';
import {
  createMockDevice,
  createMockBuffer,
  installMockWebGPUConstants,
} from '../test/webgpu-mock';
import {
  Vec2,
  PARTICLE_COUNT,
  UNIFORM_BUFFER_SIZE,
  DEFAULT_DELTA_TIME,
  OFFSCREEN_COORDINATE,
} from '../types';

// Arbitrary for canvas size
const canvasSizeArb = fc.record({
  x: fc.float({ min: 100, max: 2000, noNaN: true }),
  y: fc.float({ min: 100, max: 2000, noNaN: true }),
});

describe('Buffers Module', () => {
  /**
   * Feature: webgpu-particle-fluid-sim, Property 2: Particle Initialization Bounds
   * For any particle after initialization, its position (x, y) should satisfy:
   * 0 <= x <= canvasWidth and 0 <= y <= canvasHeight
   * Validates: Requirements 2.3
   */
  describe('Property 2: Particle Initialization Bounds', () => {
    it('should initialize all particles within canvas bounds', () => {
      fc.assert(
        fc.property(canvasSizeArb, (canvasSize) => {
          const data = initializeParticles(canvasSize);

          // Check every particle
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const offset = i * 4;
            const x = data[offset + 0];
            const y = data[offset + 1];

            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(canvasSize.x);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThanOrEqual(canvasSize.y);
          }
        }),
        { numRuns: 10 }
      );
    });

    it('should create correct number of particles', () => {
      fc.assert(
        fc.property(canvasSizeArb, (canvasSize) => {
          const data = initializeParticles(canvasSize);
          expect(data.length).toBe(PARTICLE_COUNT * 4);
        }),
        { numRuns: 100 }
      );
    });

    it('should support custom particle counts', () => {
      fc.assert(
        fc.property(
          canvasSizeArb,
          fc.integer({ min: 1, max: 2048 }),
          (canvasSize, particleCount) => {
            const data = initializeParticles(canvasSize, particleCount);
            expect(data.length).toBe(particleCount * 4);
            expect(validateParticleData(data, canvasSize, particleCount)).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should validate particle data correctly', () => {
      fc.assert(
        fc.property(canvasSizeArb, (canvasSize) => {
          const data = initializeParticles(canvasSize);
          expect(validateParticleData(data, canvasSize)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should detect out-of-bounds particles', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      // Manually set one particle out of bounds
      data[0] = canvasSize.x + 100;

      expect(validateParticleData(data, canvasSize)).toBe(false);
    });

    it('should initialize particles with reasonable velocities', () => {
      fc.assert(
        fc.property(canvasSizeArb, (canvasSize) => {
          const data = initializeParticles(canvasSize);

          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const offset = i * 4;
            const vx = data[offset + 2];
            const vy = data[offset + 3];

            // Velocities should be within expected range (-2 to 2)
            expect(vx).toBeGreaterThanOrEqual(-2);
            expect(vx).toBeLessThanOrEqual(2);
            expect(vy).toBeGreaterThanOrEqual(-2);
            expect(vy).toBeLessThanOrEqual(2);
          }
        }),
        { numRuns: 10 }
      );
    });
  });
});

describe('Buffers Edge Cases', () => {
  describe('initializeParticles edge cases', () => {
    it('should handle very small canvas', () => {
      const canvasSize: Vec2 = { x: 1, y: 1 };
      const data = initializeParticles(canvasSize);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const offset = i * 4;
        expect(data[offset + 0]).toBeGreaterThanOrEqual(0);
        expect(data[offset + 0]).toBeLessThanOrEqual(1);
        expect(data[offset + 1]).toBeGreaterThanOrEqual(0);
        expect(data[offset + 1]).toBeLessThanOrEqual(1);
      }
    });

    it('should handle very large canvas', () => {
      const canvasSize: Vec2 = { x: 10000, y: 10000 };
      const data = initializeParticles(canvasSize);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const offset = i * 4;
        expect(data[offset + 0]).toBeGreaterThanOrEqual(0);
        expect(data[offset + 0]).toBeLessThanOrEqual(10000);
        expect(data[offset + 1]).toBeGreaterThanOrEqual(0);
        expect(data[offset + 1]).toBeLessThanOrEqual(10000);
      }
    });

    it('should produce different positions for different particles', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      // Check that not all particles have the same position
      const positions = new Set<string>();
      for (let i = 0; i < Math.min(100, PARTICLE_COUNT); i++) {
        const offset = i * 4;
        const key = `${data[offset]},${data[offset + 1]}`;
        positions.add(key);
      }

      // Should have many unique positions
      expect(positions.size).toBeGreaterThan(90);
    });

    it('should produce different velocities for different particles', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      // Check that not all particles have the same velocity
      const velocities = new Set<string>();
      for (let i = 0; i < Math.min(100, PARTICLE_COUNT); i++) {
        const offset = i * 4;
        const key = `${data[offset + 2]},${data[offset + 3]}`;
        velocities.add(key);
      }

      // Should have many unique velocities
      expect(velocities.size).toBeGreaterThan(90);
    });
  });

  describe('validateParticleData edge cases', () => {
    it('should return true for empty-ish valid data', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = new Float32Array(PARTICLE_COUNT * 4);

      // All zeros are valid (within bounds)
      expect(validateParticleData(data, canvasSize)).toBe(true);
    });

    it('should detect particle at negative x', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      data[0] = -1; // First particle x is negative

      expect(validateParticleData(data, canvasSize)).toBe(false);
    });

    it('should detect particle at negative y', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      data[1] = -1; // First particle y is negative

      expect(validateParticleData(data, canvasSize)).toBe(false);
    });

    it('should detect particle beyond canvas width', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      data[0] = 801; // First particle x is beyond width

      expect(validateParticleData(data, canvasSize)).toBe(false);
    });

    it('should detect particle beyond canvas height', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      data[1] = 601; // First particle y is beyond height

      expect(validateParticleData(data, canvasSize)).toBe(false);
    });

    it('should detect out-of-bounds particle in middle of array', () => {
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const data = initializeParticles(canvasSize);

      // Set particle 500 out of bounds
      const offset = 500 * 4;
      data[offset] = 1000;

      expect(validateParticleData(data, canvasSize)).toBe(false);
    });
  });
});

describe('GPU Buffer Operations', () => {
  beforeEach(() => {
    installMockWebGPUConstants();
  });

  describe('createParticleBuffer', () => {
    it('should create a buffer with correct size', () => {
      const device = createMockDevice();
      const particleCount = 100;
      const particleData = initializeParticles({ x: 800, y: 600 }, particleCount);
      const expectedSize = particleCount * 16; // 4 floats * 4 bytes each

      // Override createBuffer to provide sufficiently large mapped range
      device.createBuffer = vi.fn((descriptor) => {
        const buffer = createMockBuffer();
        if (descriptor.mappedAtCreation && descriptor.size) {
          buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
        }
        return buffer;
      });

      const buffer = createParticleBuffer(device, particleData);

      expect(device.createBuffer).toHaveBeenCalledWith(
        expect.objectContaining({
          size: expectedSize,
          usage: expect.any(Number),
          mappedAtCreation: true,
        })
      );
      expect(buffer).toBeDefined();
    });

    it('should create a buffer with mappedAtCreation true', () => {
      const device = createMockDevice();
      const particleCount = 50;
      const particleData = initializeParticles({ x: 800, y: 600 }, particleCount);

      // Override createBuffer to provide sufficiently large mapped range
      device.createBuffer = vi.fn((descriptor) => {
        const buffer = createMockBuffer();
        if (descriptor.mappedAtCreation && descriptor.size) {
          buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
        }
        return buffer;
      });

      createParticleBuffer(device, particleData);

      expect(device.createBuffer).toHaveBeenCalledWith(
        expect.objectContaining({
          mappedAtCreation: true,
        })
      );
    });

    it('should copy particle data into the buffer', () => {
      const device = createMockDevice();
      const particleCount = 25;
      const particleData = initializeParticles({ x: 800, y: 600 }, particleCount);
      const expectedSize = particleCount * 16;

      // Create a mock buffer with appropriately sized mapped range
      const mockBuffer = createMockBuffer();
      const mappedRange = new ArrayBuffer(expectedSize);
      mockBuffer.getMappedRange = vi.fn().mockReturnValue(mappedRange);
      device.createBuffer = vi.fn().mockReturnValue(mockBuffer);

      createParticleBuffer(device, particleData);

      expect(mockBuffer.getMappedRange).toHaveBeenCalled();
      expect(mockBuffer.unmap).toHaveBeenCalled();
    });
  });

  describe('createUniformBuffer', () => {
    it('should create a buffer with UNIFORM_BUFFER_SIZE', () => {
      const device = createMockDevice();

      createUniformBuffer(device);

      expect(device.createBuffer).toHaveBeenCalledWith({
        size: UNIFORM_BUFFER_SIZE,
        usage: expect.any(Number),
      });
    });

    it('should create a buffer with UNIFORM and COPY_DST usage', () => {
      const device = createMockDevice();

      createUniformBuffer(device);

      expect(device.createBuffer).toHaveBeenCalledWith({
        size: UNIFORM_BUFFER_SIZE,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
    });
  });

  describe('updateUniformBuffer', () => {
    it('should write correct data to the buffer', () => {
      const device = createMockDevice();
      const buffer = createMockBuffer();

      updateUniformBuffer(device, buffer, 800, 600, 100, 200, 0.016);

      expect(device.queue.writeBuffer).toHaveBeenCalledWith(buffer, 0, expect.any(Float32Array));
    });

    it('should use DEFAULT_DELTA_TIME when not specified', () => {
      const device = createMockDevice();
      const buffer = createMockBuffer();

      updateUniformBuffer(device, buffer, 800, 600, 100, 200);

      const callArgs = device.queue.writeBuffer as ReturnType<typeof vi.fn>;
      const writtenData = callArgs.mock.calls[0][2] as Float32Array;

      expect(writtenData[4]).toBeCloseTo(DEFAULT_DELTA_TIME, 6);
    });

    it('should write correct uniform values in order', () => {
      const device = createMockDevice();
      const buffer = createMockBuffer();

      updateUniformBuffer(device, buffer, 1024, 768, 50, 100, 0.033);

      const callArgs = device.queue.writeBuffer as ReturnType<typeof vi.fn>;
      const writtenData = callArgs.mock.calls[0][2] as Float32Array;

      expect(writtenData[0]).toBe(1024); // width
      expect(writtenData[1]).toBe(768); // height
      expect(writtenData[2]).toBe(50); // mouseX
      expect(writtenData[3]).toBe(100); // mouseY
      expect(writtenData[4]).toBeCloseTo(0.033, 5); // deltaTime (float precision)
    });

    it('should include padding values', () => {
      const device = createMockDevice();
      const buffer = createMockBuffer();

      updateUniformBuffer(device, buffer, 800, 600, 0, 0, 0.016);

      const callArgs = device.queue.writeBuffer as ReturnType<typeof vi.fn>;
      const writtenData = callArgs.mock.calls[0][2] as Float32Array;

      expect(writtenData.length).toBe(8); // 5 values + 3 padding
      expect(writtenData[5]).toBe(0); // padding
      expect(writtenData[6]).toBe(0); // padding
      expect(writtenData[7]).toBe(0); // padding
    });
  });

  describe('createBuffers', () => {
    it('should create both particle and uniform buffers', () => {
      const device = createMockDevice();
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const particleCount = 10;

      // Override createBuffer to provide sufficiently large mapped range
      device.createBuffer = vi.fn((descriptor) => {
        const buffer = createMockBuffer();
        if (descriptor.mappedAtCreation && descriptor.size) {
          buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
        }
        return buffer;
      });

      const buffers = createBuffers(device, canvasSize, particleCount);

      expect(buffers.particleBuffer).toBeDefined();
      expect(buffers.uniformBuffer).toBeDefined();
    });

    it('should return correct particle count', () => {
      const device = createMockDevice();
      const canvasSize: Vec2 = { x: 800, y: 600 };
      const particleCount = 50;

      // Override createBuffer to provide sufficiently large mapped range
      device.createBuffer = vi.fn((descriptor) => {
        const buffer = createMockBuffer();
        if (descriptor.mappedAtCreation && descriptor.size) {
          buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
        }
        return buffer;
      });

      const buffers = createBuffers(device, canvasSize, particleCount);

      expect(buffers.particleCount).toBe(particleCount);
    });

    it('should use default PARTICLE_COUNT when not specified', () => {
      const device = createMockDevice();
      const canvasSize: Vec2 = { x: 800, y: 600 };

      // Override createBuffer to provide sufficiently large mapped range
      device.createBuffer = vi.fn((descriptor) => {
        const buffer = createMockBuffer();
        if (descriptor.mappedAtCreation && descriptor.size) {
          buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
        }
        return buffer;
      });

      const buffers = createBuffers(device, canvasSize);

      expect(buffers.particleCount).toBe(PARTICLE_COUNT);
    });

    it('should initialize uniform buffer with offscreen coordinates', () => {
      const device = createMockDevice();
      const canvasSize: Vec2 = { x: 1024, y: 768 };
      const particleCount = 10;

      // Override createBuffer to provide sufficiently large mapped range
      device.createBuffer = vi.fn((descriptor) => {
        const buffer = createMockBuffer();
        if (descriptor.mappedAtCreation && descriptor.size) {
          buffer.getMappedRange = vi.fn().mockReturnValue(new ArrayBuffer(descriptor.size));
        }
        return buffer;
      });

      createBuffers(device, canvasSize, particleCount);

      const callArgs = device.queue.writeBuffer as ReturnType<typeof vi.fn>;
      const writtenData = callArgs.mock.calls[0][2] as Float32Array;

      expect(writtenData[0]).toBe(1024);
      expect(writtenData[1]).toBe(768);
      expect(writtenData[2]).toBe(OFFSCREEN_COORDINATE);
      expect(writtenData[3]).toBe(OFFSCREEN_COORDINATE);
    });
  });
});
