import { Vec2 } from '../types';

/**
 * Mouse state
 */
export interface MouseState {
  x: number;
  y: number;
  isOnCanvas: boolean;
}

/**
 * Create mouse input handler
 */
export function createMouseHandler(canvas: HTMLCanvasElement): {
  getMousePosition: () => Vec2;
  destroy: () => void;
} {
  const state: MouseState = {
    x: -1000, // Start off-screen
    y: -1000,
    isOnCanvas: false,
  };

  const handleMouseMove = (event: MouseEvent): void => {
    const rect = canvas.getBoundingClientRect();
    state.x = event.clientX - rect.left;
    state.y = event.clientY - rect.top;
    state.isOnCanvas = true;
  };

  const handleMouseLeave = (): void => {
    state.x = -1000;
    state.y = -1000;
    state.isOnCanvas = false;
  };

  const handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault(); // Prevent page scrolling when interacting with canvas
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = canvas.getBoundingClientRect();
      state.x = touch.clientX - rect.left;
      state.y = touch.clientY - rect.top;
      state.isOnCanvas = true;
    }
  };

  const handleTouchEnd = (): void => {
    state.x = -1000;
    state.y = -1000;
    state.isOnCanvas = false;
  };

  // Add event listeners
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);

  return {
    getMousePosition: () => ({ x: state.x, y: state.y }),
    destroy: (): void => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    },
  };
}
