import { WebGPUContext } from '../types';
import { showError } from './app-shell';

/**
 * Initialize WebGPU and return context
 */
export async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext> {
  // Check WebGPU support
  if (!navigator.gpu) {
    showError('WebGPU is not supported. Please use Chrome 113+ or Edge 113+.');
    throw new Error('WebGPU not supported');
  }

  // Request adapter
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    showError('Failed to get GPU adapter. Your GPU may not support WebGPU.');
    throw new Error('No GPU adapter found');
  }

  // Request device
  const device = await adapter.requestDevice();
  if (!device) {
    showError('Failed to get GPU device.');
    throw new Error('No GPU device found');
  }

  // Handle device lost
  device.lost.then((info) => {
    console.error('WebGPU device lost:', info.message);
    if (info.reason !== 'destroyed') {
      showError('GPU device lost. Please refresh the page.');
    }
  });

  // Get canvas context
  const context = canvas.getContext('webgpu');
  if (!context) {
    showError('Failed to get WebGPU canvas context.');
    throw new Error('No WebGPU context');
  }

  // Get preferred format
  const format = navigator.gpu.getPreferredCanvasFormat();

  // Configure context
  context.configure({
    device,
    format,
    alphaMode: 'premultiplied',
  });

  return { adapter, device, context, format, canvas };
}

/**
 * Reconfigure context after resize
 */
export function reconfigureContext(ctx: WebGPUContext): void {
  ctx.context.configure({
    device: ctx.device,
    format: ctx.format,
    alphaMode: 'premultiplied',
  });
}
