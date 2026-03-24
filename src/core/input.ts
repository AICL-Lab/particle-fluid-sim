import { Vec2, OFFSCREEN_COORDINATE } from '../types';

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
    x: OFFSCREEN_COORDINATE,
    y: OFFSCREEN_COORDINATE,
    isOnCanvas: false,
  };

  const updatePointerPosition = (clientX: number, clientY: number): void => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width === 0 ? 1 : canvas.width / rect.width;
    const scaleY = rect.height === 0 ? 1 : canvas.height / rect.height;

    state.x = (clientX - rect.left) * scaleX;
    state.y = (clientY - rect.top) * scaleY;
    state.isOnCanvas = true;
  };

  const handleMouseMove = (event: MouseEvent): void => {
    updatePointerPosition(event.clientX, event.clientY);
  };

  const handleMouseLeave = (): void => {
    state.x = OFFSCREEN_COORDINATE;
    state.y = OFFSCREEN_COORDINATE;
    state.isOnCanvas = false;
  };

  const handleTouchMove = (event: TouchEvent): void => {
    event.preventDefault(); // Prevent page scrolling when interacting with canvas
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      updatePointerPosition(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (): void => {
    state.x = OFFSCREEN_COORDINATE;
    state.y = OFFSCREEN_COORDINATE;
    state.isOnCanvas = false;
  };

  // Add event listeners
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd);
  canvas.addEventListener('touchcancel', handleTouchEnd);

  return {
    getMousePosition: () => ({ x: state.x, y: state.y }),
    destroy: (): void => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
    },
  };
}
