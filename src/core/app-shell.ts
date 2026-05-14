export interface FPSCounter {
  update: () => void;
  element: HTMLElement;
}

/**
 * Create FPS counter element
 */
export function createFPSCounter(particleCount: number, qualityTier: string): FPSCounter {
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
export function createInfoOverlay(): HTMLElement {
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
 * Create a loading indicator element
 */
export function createLoadingIndicator(message: string): HTMLElement {
  const element = document.createElement('div');
  element.className = 'loading';
  element.textContent = message;
  document.body.appendChild(element);
  return element;
}

/**
 * Display error message to user
 */
export function showError(message: string): void {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
}
