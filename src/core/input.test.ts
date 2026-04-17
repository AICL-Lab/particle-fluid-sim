import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMouseHandler } from './input';
import { OFFSCREEN_COORDINATE } from '../types';

describe('input', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    // Mock getBoundingClientRect
    canvas.getBoundingClientRect = vi.fn(() => ({
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createMouseHandler', () => {
    it('should return initial offscreen position', () => {
      const handler = createMouseHandler(canvas);
      const pos = handler.getMousePosition();

      expect(pos.x).toBe(OFFSCREEN_COORDINATE);
      expect(pos.y).toBe(OFFSCREEN_COORDINATE);

      handler.destroy();
    });

    it('should track mouse position on mousemove', () => {
      const handler = createMouseHandler(canvas);

      // Simulate mouse move
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 400,
        clientY: 300,
      });
      canvas.dispatchEvent(moveEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(400);
      expect(pos.y).toBe(300);

      handler.destroy();
    });

    it('should return offscreen position after mouseleave', () => {
      const handler = createMouseHandler(canvas);

      // First move mouse on canvas
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 400,
        clientY: 300,
      });
      canvas.dispatchEvent(moveEvent);

      // Then leave canvas
      const leaveEvent = new MouseEvent('mouseleave');
      canvas.dispatchEvent(leaveEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(OFFSCREEN_COORDINATE);
      expect(pos.y).toBe(OFFSCREEN_COORDINATE);

      handler.destroy();
    });

    it('should track touch position on touchmove', () => {
      const handler = createMouseHandler(canvas);

      // Simulate touch move
      const touchEvent = new TouchEvent('touchmove', {
        touches: [
          {
            clientX: 200,
            clientY: 150,
          } as Touch,
        ],
        cancelable: true,
      });

      // Prevent default should be called
      const preventDefaultSpy = vi.spyOn(touchEvent, 'preventDefault');
      canvas.dispatchEvent(touchEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(200);
      expect(pos.y).toBe(150);
      expect(preventDefaultSpy).toHaveBeenCalled();

      handler.destroy();
    });

    it('should return offscreen position after touchend', () => {
      const handler = createMouseHandler(canvas);

      // First touch canvas
      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [
          {
            clientX: 200,
            clientY: 150,
          } as Touch,
        ],
      });
      canvas.dispatchEvent(touchMoveEvent);

      // Then end touch
      const touchEndEvent = new TouchEvent('touchend');
      canvas.dispatchEvent(touchEndEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(OFFSCREEN_COORDINATE);
      expect(pos.y).toBe(OFFSCREEN_COORDINATE);

      handler.destroy();
    });

    it('should return offscreen position after touchcancel', () => {
      const handler = createMouseHandler(canvas);

      // First touch canvas
      const touchMoveEvent = new TouchEvent('touchmove', {
        touches: [
          {
            clientX: 200,
            clientY: 150,
          } as Touch,
        ],
      });
      canvas.dispatchEvent(touchMoveEvent);

      // Then cancel touch
      const touchCancelEvent = new TouchEvent('touchcancel');
      canvas.dispatchEvent(touchCancelEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(OFFSCREEN_COORDINATE);
      expect(pos.y).toBe(OFFSCREEN_COORDINATE);

      handler.destroy();
    });

    it('should scale coordinates when canvas is scaled via CSS', () => {
      // Canvas is 800x600 but displayed at 400x300 (2x scale)
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 400,
        height: 300,
        right: 400,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: (): string => '{}',
      }));

      const handler = createMouseHandler(canvas);

      // Click at center of displayed canvas (200, 150)
      // Should map to center of actual canvas (400, 300)
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 200,
        clientY: 150,
      });
      canvas.dispatchEvent(moveEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(400);
      expect(pos.y).toBe(300);

      handler.destroy();
    });

    it('should handle zero-dimension canvas gracefully', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: (): string => '{}',
      }));

      const handler = createMouseHandler(canvas);

      // Should not throw and should use scale of 1
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 50,
      });

      expect(() => canvas.dispatchEvent(moveEvent)).not.toThrow();

      handler.destroy();
    });

    it('should remove all event listeners on destroy', () => {
      const handler = createMouseHandler(canvas);
      handler.destroy();

      // After destroy, events should not update position
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 400,
        clientY: 300,
      });
      canvas.dispatchEvent(moveEvent);

      // Position should still be offscreen since listener was removed
      const pos = handler.getMousePosition();
      expect(pos.x).toBe(OFFSCREEN_COORDINATE);
      expect(pos.y).toBe(OFFSCREEN_COORDINATE);
    });

    it('should handle multiple touch points by using first touch', () => {
      const handler = createMouseHandler(canvas);

      const touchEvent = new TouchEvent('touchmove', {
        touches: [
          { clientX: 100, clientY: 50 } as Touch,
          { clientX: 200, clientY: 100 } as Touch,
          { clientX: 300, clientY: 150 } as Touch,
        ],
      });
      canvas.dispatchEvent(touchEvent);

      const pos = handler.getMousePosition();
      // Should use first touch point
      expect(pos.x).toBe(100);
      expect(pos.y).toBe(50);

      handler.destroy();
    });

    it('should handle canvas with offset position', () => {
      canvas.getBoundingClientRect = vi.fn(() => ({
        left: 100,
        top: 50,
        width: 800,
        height: 600,
        right: 900,
        bottom: 650,
        x: 100,
        y: 50,
        toJSON: (): string => '{}',
      }));

      const handler = createMouseHandler(canvas);

      // Click at client position (500, 350)
      // Canvas offset is (100, 50)
      // So canvas-relative position should be (400, 300)
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 500,
        clientY: 350,
      });
      canvas.dispatchEvent(moveEvent);

      const pos = handler.getMousePosition();
      expect(pos.x).toBe(400);
      expect(pos.y).toBe(300);

      handler.destroy();
    });
  });
});
