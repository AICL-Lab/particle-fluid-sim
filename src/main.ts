import { initWebGPU, reconfigureContext } from './core/webgpu';
import { setupCanvas } from './core/canvas';
import { createSimulationResources, destroySimulationResources } from './core/simulation-resources';
import { createMouseHandler } from './core/input';
import { readRuntimeHeuristics, resolveSimulationSettings } from './core/quality';
import { createRenderer } from './core/renderer';
import { showError, createFPSCounter, createInfoOverlay, createLoadingIndicator } from './core/app-shell';
import './style.css';

function debugLog(message: string): void {
  if (import.meta.env.DEV) {
    console.warn(message);
  }
}

/**
 * Main application entry point
 */
async function main(): Promise<void> {
  // Get canvas element
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  if (!canvas) {
    showError('Canvas element not found');
    return;
  }

  // Setup canvas for fullscreen
  setupCanvas(canvas);

  // Show loading indicator
  const loadingDiv = createLoadingIndicator('Initializing WebGPU...');

  try {
    // Initialize WebGPU
    debugLog('Initializing WebGPU...');
    const ctx = await initWebGPU(canvas);
    debugLog('WebGPU initialized successfully');

    const simulationSettings = resolveSimulationSettings(
      readRuntimeHeuristics(ctx.adapter, ctx.device)
    );
    debugLog(
      `Using ${simulationSettings.particleCount.toLocaleString()} particles (${simulationSettings.qualityTier} quality)`
    );

    // Create GPU resources (buffers + pipelines + bind groups)
    debugLog('Creating simulation resources...');
    const resources = createSimulationResources(
      ctx.device,
      ctx.format,
      {
        x: canvas.width,
        y: canvas.height,
      },
      simulationSettings.particleCount
    );
    debugLog('Simulation resources created');

    // Remove loading indicator
    loadingDiv.remove();

    // Setup mouse input
    const mouseHandler = createMouseHandler(canvas);

    // Create FPS counter
    const fpsCounter = createFPSCounter(
      simulationSettings.particleCount,
      simulationSettings.qualityTier
    );

    // Create info overlay
    createInfoOverlay();

    // Create renderer with FPS callback
    const renderer = createRenderer(
      ctx,
      resources.pipelines,
      resources.buffers,
      mouseHandler.getMousePosition,
      fpsCounter.update
    );

    // Handle window resize (single handler, no duplicates)
    const handleResize = (): void => {
      setupCanvas(canvas);
      reconfigureContext(ctx);
    };
    window.addEventListener('resize', handleResize);

    // Start render loop
    debugLog('Starting render loop...');
    renderer.start();
    debugLog('Particle simulation running!');

    // Cleanup on page unload
    window.addEventListener('beforeunload', (): void => {
      renderer.destroy();
      mouseHandler.destroy();
      destroySimulationResources(resources);
    });
  } catch (error) {
    loadingDiv.remove();
    console.error('Failed to initialize:', error);
    if (error instanceof Error) {
      showError(`Initialization failed: ${error.message}`);
    }
  }
}

// Run main when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}
