import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createMockAdapter,
  createMockDevice,
  createMockCanvas,
  mockWebGPU,
  unmockWebGPU,
} from '../test/webgpu-mock';
import { initWebGPU, reconfigureContext } from './webgpu';

describe('webgpu', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = createMockCanvas();
    mockWebGPU();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    unmockWebGPU();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('initWebGPU', () => {
    it('should initialize WebGPU context successfully', async () => {
      const ctx = await initWebGPU(canvas);

      expect(ctx.adapter).toBeDefined();
      expect(ctx.device).toBeDefined();
      expect(ctx.context).toBeDefined();
      expect(ctx.format).toBe('bgra8unorm');
      expect(ctx.canvas).toBe(canvas);
    });

    it('should throw error when WebGPU is not supported', async () => {
      unmockWebGPU();

      await expect(initWebGPU(canvas)).rejects.toThrow('WebGPU not supported');
    });

    it('should throw error when adapter is not available', async () => {
      // Mock navigator.gpu without valid adapter
      Object.assign(globalThis.navigator, {
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(null),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
      });

      await expect(initWebGPU(canvas)).rejects.toThrow('No GPU adapter found');
    });

    it('should throw error when device is not available', async () => {
      const mockAdapter = createMockAdapter({
        requestDevice: vi.fn().mockResolvedValue(null),
      });

      Object.assign(globalThis.navigator, {
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
      });

      await expect(initWebGPU(canvas)).rejects.toThrow('No GPU device found');
    });

    it('should configure context with correct settings', async () => {
      const mockConfigure = vi.fn();
      const mockContext = {
        configure: mockConfigure,
        getCurrentTexture: vi.fn(),
      };

      canvas.getContext = vi.fn().mockReturnValue(mockContext);

      await initWebGPU(canvas);

      expect(mockConfigure).toHaveBeenCalledWith({
        device: expect.anything(),
        format: 'bgra8unorm',
        alphaMode: 'premultiplied',
      });
    });

    it('should throw error when canvas context is not available', async () => {
      canvas.getContext = vi.fn().mockReturnValue(null);

      await expect(initWebGPU(canvas)).rejects.toThrow('No WebGPU context');
    });

    it('should handle device lost event', async () => {
      const mockDevice = createMockDevice({
        lost: Promise.resolve({
          device: null as unknown as GPUDevice,
          reason: 'destroyed' as GPUDeviceLostReason,
          message: 'Device was destroyed',
        } as unknown as GPUDeviceLostInfo),
      });

      const mockAdapter = createMockAdapter({
        requestDevice: vi.fn().mockResolvedValue(mockDevice),
      });

      Object.assign(globalThis.navigator, {
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
      });

      // Should not throw during init
      const ctx = await initWebGPU(canvas);
      expect(ctx.device).toBeDefined();
    });
  });

  describe('reconfigureContext', () => {
    it('should call context.configure with correct parameters', () => {
      const mockConfigure = vi.fn();
      const ctx = {
        adapter: createMockAdapter(),
        device: createMockDevice(),
        context: {
          configure: mockConfigure,
          getCurrentTexture: vi.fn(),
        } as unknown as GPUCanvasContext,
        format: 'bgra8unorm' as GPUTextureFormat,
        canvas,
      };

      reconfigureContext(ctx);

      expect(mockConfigure).toHaveBeenCalledWith({
        device: ctx.device,
        format: 'bgra8unorm',
        alphaMode: 'premultiplied',
      });
    });
  });
});
