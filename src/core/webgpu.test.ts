import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createMockAdapter,
  createMockDevice,
  createMockCanvas,
  mockWebGPU,
  unmockWebGPU,
} from '../test/webgpu-mock';
import { initWebGPU, setupCanvas, reconfigureContext, showError } from './webgpu';

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

  describe('showError', () => {
    it('should create error div with message', () => {
      showError('Test error message');

      const errorDiv = document.body.querySelector('.error-message');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv?.textContent).toBe('Test error message');
    });

    it('should append error to body', () => {
      showError('First error');
      showError('Second error');

      const errorDivs = document.body.querySelectorAll('.error-message');
      expect(errorDivs).toHaveLength(2);
    });
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).navigator = {
        ...globalThis.navigator,
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(null),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
      };

      await expect(initWebGPU(canvas)).rejects.toThrow('No GPU adapter found');
    });

    it('should throw error when device is not available', async () => {
      const mockAdapter = createMockAdapter({
        requestDevice: vi.fn().mockResolvedValue(null),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).navigator = {
        ...globalThis.navigator,
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
      };

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).navigator = {
        ...globalThis.navigator,
        gpu: {
          requestAdapter: vi.fn().mockResolvedValue(mockAdapter),
          getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
        },
      };

      // Should not throw during init
      const ctx = await initWebGPU(canvas);
      expect(ctx.device).toBeDefined();
    });
  });

  describe('setupCanvas', () => {
    it('should set canvas dimensions based on window size', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1024);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(768);
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(1);

      setupCanvas(canvas);

      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
      expect(canvas.style.width).toBe('1024px');
      expect(canvas.style.height).toBe('768px');
    });

    it('should scale canvas by devicePixelRatio', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2);

      setupCanvas(canvas);

      expect(canvas.width).toBe(1600);
      expect(canvas.height).toBe(1200);
      expect(canvas.style.width).toBe('800px');
      expect(canvas.style.height).toBe('600px');
    });

    it('should handle zero devicePixelRatio', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(0);

      setupCanvas(canvas);

      // Should use minimum of 1
      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
    });

    it('should ensure minimum size of 1x1', () => {
      vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(0);
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(0);
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(1);

      setupCanvas(canvas);

      expect(canvas.width).toBe(1);
      expect(canvas.height).toBe(1);
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
