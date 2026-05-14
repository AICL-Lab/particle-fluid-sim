import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupCanvas } from './canvas';
import { createMockCanvas } from '../test/webgpu-mock';

describe('canvas', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = createMockCanvas();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
