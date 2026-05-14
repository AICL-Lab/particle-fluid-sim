/**
 * Set canvas to current window size (call on init and on resize)
 */
export function setupCanvas(canvas: HTMLCanvasElement): void {
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  const width = Math.max(1, Math.floor(window.innerWidth * dpr));
  const height = Math.max(1, Math.floor(window.innerHeight * dpr));

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}
