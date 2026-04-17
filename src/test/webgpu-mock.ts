/**
 * WebGPU Mock Utilities for Testing
 *
 * Provides mock implementations of WebGPU interfaces for unit testing
 * GPU-dependent code without requiring actual WebGPU hardware.
 */

import { vi } from 'vitest';

/**
 * Creates a mock GPUBuffer
 */
export function createMockBuffer(overrides: Partial<GPUBuffer> = {}): GPUBuffer {
  return {
    mapAsync: vi.fn().mockResolvedValue(undefined),
    getMappedRange: vi.fn().mockReturnValue(new ArrayBuffer(1024)),
    unmap: vi.fn(),
    destroy: vi.fn(),
    ...overrides,
  } as GPUBuffer;
}

/**
 * Creates a mock GPUDevice
 */
export function createMockDevice(overrides: Partial<GPUDevice> = {}): GPUDevice {
  const mockBuffer = createMockBuffer();

  return {
    createBuffer: vi.fn().mockReturnValue(mockBuffer),
    createBindGroupLayout: vi.fn().mockReturnValue({} as GPUBindGroupLayout),
    createPipelineLayout: vi.fn().mockReturnValue({} as GPUPipelineLayout),
    createBindGroup: vi.fn().mockReturnValue({} as GPUBindGroup),
    createShaderModule: vi.fn().mockReturnValue({} as GPUShaderModule),
    createComputePipeline: vi.fn().mockReturnValue({
      getBindGroupLayout: vi.fn().mockReturnValue({} as GPUBindGroupLayout),
    } as unknown as GPUComputePipeline),
    createRenderPipeline: vi.fn().mockReturnValue({
      getBindGroupLayout: vi.fn().mockReturnValue({} as GPUBindGroupLayout),
    } as unknown as GPURenderPipeline),
    createCommandEncoder: vi.fn().mockReturnValue(createMockCommandEncoder()),
    createTexture: vi.fn().mockReturnValue(createMockTexture()),
    createSampler: vi.fn().mockReturnValue({} as GPUSampler),
    createView: vi.fn().mockReturnValue({} as GPUTextureView),
    queue: {
      submit: vi.fn(),
      writeBuffer: vi.fn(),
      writeTexture: vi.fn(),
      onSubmittedWorkDone: vi.fn().mockResolvedValue(undefined),
    } as unknown as GPUQueue,
    pushErrorScope: vi.fn(),
    popErrorScope: vi.fn().mockResolvedValue(null),
    destroy: vi.fn(),
    features: new Set<string>(),
    limits: {
      maxStorageBufferBindingSize: 65536,
      maxBufferSize: 268435456,
      maxBindGroups: 4,
      maxComputeWorkgroupSizeX: 256,
      maxComputeWorkgroupSizeY: 256,
      maxComputeWorkgroupSizeZ: 64,
    } as unknown as GPUSupportedLimits,
    lost: Promise.resolve({ device: null as unknown as GPUDevice, reason: undefined, message: '' }),
    ...overrides,
  } as GPUDevice;
}

/**
 * Creates a mock GPUAdapter
 */
export function createMockAdapter(overrides: Partial<GPUAdapter> = {}): GPUAdapter {
  return {
    requestDevice: vi.fn().mockResolvedValue(createMockDevice()),
    features: new Set<string>(),
    limits: {
      maxStorageBufferBindingSize: 65536,
      maxBufferSize: 268435456,
    } as unknown as GPUSupportedLimits,
    isFallbackAdapter: false,
    ...overrides,
  } as unknown as GPUAdapter;
}

/**
 * Creates a mock GPUCommandEncoder
 */
export function createMockCommandEncoder(): GPUCommandEncoder {
  const mockComputePass = createMockComputePassEncoder();
  const mockRenderPass = createMockRenderPassEncoder();

  return {
    beginComputePass: vi.fn().mockReturnValue(mockComputePass),
    beginRenderPass: vi.fn().mockReturnValue(mockRenderPass),
    copyBufferToBuffer: vi.fn(),
    copyBufferToTexture: vi.fn(),
    copyTextureToBuffer: vi.fn(),
    copyTextureToTexture: vi.fn(),
    clearBuffer: vi.fn(),
    finish: vi.fn().mockReturnValue({} as GPUCommandBuffer),
    pushDebugGroup: vi.fn(),
    popDebugGroup: vi.fn(),
    insertDebugMarker: vi.fn(),
  } as unknown as GPUCommandEncoder;
}

/**
 * Creates a mock GPUComputePassEncoder
 */
export function createMockComputePassEncoder(): GPUComputePassEncoder {
  return {
    setPipeline: vi.fn(),
    setBindGroup: vi.fn(),
    dispatchWorkgroups: vi.fn(),
    end: vi.fn(),
    pushDebugGroup: vi.fn(),
    popDebugGroup: vi.fn(),
    insertDebugMarker: vi.fn(),
  } as unknown as GPUComputePassEncoder;
}

/**
 * Creates a mock GPURenderPassEncoder
 */
export function createMockRenderPassEncoder(): GPURenderPassEncoder {
  return {
    setPipeline: vi.fn(),
    setBindGroup: vi.fn(),
    setVertexBuffer: vi.fn(),
    draw: vi.fn(),
    drawIndexed: vi.fn(),
    setIndexBuffer: vi.fn(),
    end: vi.fn(),
    setViewport: vi.fn(),
    setScissorRect: vi.fn(),
    setBlendConstant: vi.fn(),
    setStencilReference: vi.fn(),
    pushDebugGroup: vi.fn(),
    popDebugGroup: vi.fn(),
    insertDebugMarker: vi.fn(),
    executeBundles: vi.fn(),
  } as unknown as GPURenderPassEncoder;
}

/**
 * Creates a mock GPUTexture
 */
export function createMockTexture(): GPUTexture {
  return {
    createView: vi.fn().mockReturnValue({} as GPUTextureView),
    destroy: vi.fn(),
    width: 800,
    height: 600,
    depthOrArrayLayers: 1,
    mipLevelCount: 1,
    sampleCount: 1,
    dimension: '2d' as GPUTextureDimension,
    format: 'bgra8unorm' as GPUTextureFormat,
    usage: 0,
  } as unknown as GPUTexture;
}

/**
 * Creates a mock GPUContext
 */
export function createMockContext(): GPUCanvasContext {
  return {
    configure: vi.fn(),
    unconfigure: vi.fn(),
    getCurrentTexture: vi.fn().mockReturnValue(createMockTexture()),
  } as unknown as GPUCanvasContext;
}

/**
 * Creates a mock HTMLCanvasElement with WebGPU context
 */
export function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;

  // Mock getContext to return our mock context
  canvas.getContext = vi.fn((contextId: string): GPUCanvasContext | null => {
    if (contextId === 'webgpu') {
      return createMockContext();
    }
    return null;
  }) as typeof canvas.getContext;

  canvas.getBoundingClientRect = vi.fn((): DOMRect => ({
    left: 0,
    top: 0,
    width: 800,
    height: 600,
    right: 800,
    bottom: 600,
    x: 0,
    y: 0,
    toJSON: (): string => '{}',
  }));

  return canvas;
}

/**
 * Sets up global navigator.gpu mock
 */
export function mockWebGPU(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).navigator = {
    ...globalThis.navigator,
    gpu: {
      requestAdapter: vi.fn().mockResolvedValue(createMockAdapter()),
      getPreferredCanvasFormat: vi.fn().mockReturnValue('bgra8unorm'),
    },
  };
}

/**
 * Restores global navigator.gpu
 */
export function unmockWebGPU(): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (globalThis as any).navigator?.gpu;
}
