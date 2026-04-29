import { initWebGPU, reconfigureContext, setupCanvas, showError } from './core/webgpu';
import { createBuffers } from './core/buffers';
import { createPipelines } from './core/pipelines';
import { createMouseHandler } from './core/input';
import { readRuntimeHeuristics, resolveSimulationSettings } from './core/quality';
import { createRenderer } from './core/renderer';
import './style.css';

function debugLog(message: string): void {
  if (import.meta.env.DEV) {
    console.warn(message);
  }
}

/**
 * Create FPS counter element
 */
function createFPSCounter(
  particleCount: number,
  qualityTier: string
): { update: () => void; element: HTMLElement } {
  const element = document.createElement('div');
  element.id = 'fps-counter';
  element.innerHTML = `
    <div class="fps-value">-- FPS</div>
    <div class="particle-count">${particleCount.toLocaleString()} particles</div>
    <div class="quality-tier">${qualityTier} quality</div>
  `;
  document.body.appendChild(element);

  let frameCount = 0;
  let lastTime = performance.now();

  return {
    element,
    update: (): void => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        const fpsElement = element.querySelector('.fps-value');
        if (fpsElement) {
          fpsElement.textContent = `${fps} FPS`;
        }
        frameCount = 0;
        lastTime = now;
      }
    },
  };
}

/**
 * Create info overlay
 */
function createInfoOverlay(): HTMLElement {
  const element = document.createElement('div');
  element.id = 'info-overlay';
  element.innerHTML = `
    <h1>WebGPU Particle Fluid Simulation</h1>
    <p>Move your mouse to interact with particles</p>
    <p class="hint">Particles are repelled by the cursor</p>
  `;
  document.body.appendChild(element);

  // Fade out after 3 seconds
  setTimeout(() => {
    element.classList.add('fade-out');
  }, 3000);

  return element;
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
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.textContent = 'Initializing WebGPU...';
  document.body.appendChild(loadingDiv);

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

    // Create buffers
    debugLog('Creating buffers...');
    const buffers = createBuffers(
      ctx.device,
      {
        x: canvas.width,
        y: canvas.height,
      },
      simulationSettings.particleCount
    );
    debugLog('Buffers created');

    // Create pipelines
    debugLog('Creating pipelines...');
    const pipelines = createPipelines(ctx.device, ctx.format, buffers);
    debugLog('Pipelines created');

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
      pipelines,
      buffers,
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
