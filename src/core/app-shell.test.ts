import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { showError, createFPSCounter, createInfoOverlay, createLoadingIndicator } from './app-shell';

describe('app-shell', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  describe('showError', () => {
    it('should create error div with message', () => {
      showError('Test error message');

      const errorDiv = document.body.querySelector('.error-message');
      expect(errorDiv).not.toBeNull();
      expect(errorDiv?.textContent).toBe('Test error message');
    });

    it('should append error to body', () => {
      showError('First error');
      showError('Second error');

      const errorDivs = document.body.querySelectorAll('.error-message');
      expect(errorDivs).toHaveLength(2);
    });
  });

  describe('createLoadingIndicator', () => {
    it('should create a loading element with the given message', () => {
      const el = createLoadingIndicator('Loading...');

      expect(el.className).toBe('loading');
      expect(el.textContent).toBe('Loading...');
      expect(document.body.contains(el)).toBe(true);
    });
  });

  describe('createFPSCounter', () => {
    it('should create an FPS counter element', () => {
      const counter = createFPSCounter(10000, 'high');

      expect(document.getElementById('fps-counter')).not.toBeNull();
      expect(counter.element.querySelector('.particle-count')?.textContent).toBe('10,000 particles');
      expect(counter.element.querySelector('.quality-tier')?.textContent).toBe('high quality');
    });

    it('should update fps value after one second', () => {
      vi.useFakeTimers();
      const counter = createFPSCounter(10000, 'high');

      // Simulate 60 frames in 1 second
      for (let i = 0; i < 60; i++) {
        counter.update();
      }
      vi.advanceTimersByTime(1000);
      counter.update();

      const fpsValue = counter.element.querySelector('.fps-value')?.textContent;
      expect(fpsValue).toMatch(/\d+ FPS/);

      vi.useRealTimers();
    });
  });

  describe('createInfoOverlay', () => {
    it('should create an info overlay element', () => {
      vi.useFakeTimers();
      const el = createInfoOverlay();

      expect(document.getElementById('info-overlay')).not.toBeNull();
      expect(el.querySelector('h1')?.textContent).toBe('WebGPU Particle Fluid Simulation');

      vi.advanceTimersByTime(3000);
      expect(el.classList.contains('fade-out')).toBe(true);

      vi.useRealTimers();
    });
  });
});
