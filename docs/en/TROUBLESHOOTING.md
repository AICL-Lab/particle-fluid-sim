# Troubleshooting Guide

← [Back to Docs Home](README.md) | [简体中文](../zh-CN/TROUBLESHOOTING.md)

> **Version**: 2.0.0  
> **Last Updated**: 2026-04-16

---

This guide helps you diagnose and resolve common issues with the WebGPU Particle Fluid Simulation.

## Table of Contents

- [Quick Diagnostic](#quick-diagnostic)
- [Browser Issues](#browser-issues)
- [Initialization Errors](#initialization-errors)
- [Performance Problems](#performance-problems)
- [Visual Issues](#visual-issues)
- [Mobile Issues](#mobile-issues)
- [Getting Help](#getting-help)

---

## Quick Diagnostic

Run these commands in your browser console (F12 → Console) to diagnose issues:

```javascript
// 1. Check WebGPU support
console.log('WebGPU supported:', !!navigator.gpu);

// 2. Check adapter availability
const adapter = await navigator.gpu?.requestAdapter();
console.log('Adapter available:', !!adapter);
console.log('Fallback adapter:', adapter?.isFallbackAdapter);

// 3. Check device
const device = await adapter?.requestDevice();
console.log('Device available:', !!device);

// 4. Check canvas
const canvas = document.getElementById('canvas');
console.log('Canvas found:', !!canvas);
console.log('Canvas size:', canvas?.width, 'x', canvas?.height);

// 5. Check WebGPU context
const ctx = canvas?.getContext('webgpu');
console.log('WebGPU context:', !!ctx);
```

**All checks should return `true` or valid values.** If any return `false` or `undefined`, see the relevant section below.

---

## Browser Issues

### WebGPU Not Supported

**Error:** `WebGPU is not supported in this browser`

**Cause:** Your browser doesn't have WebGPU enabled or doesn't support it.

**Solutions:**

| Browser | Minimum Version | Solution |
|---------|-----------------|----------|
| Chrome | 113+ | Update to latest version |
| Edge | 113+ | Update to latest version |
| Safari | 17+ | Update macOS to 14+ |
| Firefox | Nightly | Enable `dom.webgpu.enabled` in `about:config` |

**Check Support:**
```javascript
if (!navigator.gpu) {
  alert('Please use Chrome 113+, Edge 113+, or Safari 17+');
}
```

### Outdated Browser

**Symptoms:** Simulation won't start, console shows syntax errors

**Solution:**
1. Check your browser version
2. Update to the latest version:
   - Chrome: Menu → Help → About Google Chrome
   - Edge: Menu → Help and feedback → About Microsoft Edge
   - Safari: System Settings → General → Software Update

---

## Initialization Errors

### "GPU adapter not found"

**Error Message:** `Failed to get GPU adapter`

**Causes & Solutions:**

#### 1. Hardware Acceleration Disabled

**Chrome:**
1. Navigate to `chrome://settings/system`
2. Enable "Use graphics acceleration when available"
3. Restart browser

**Verify:**
- Visit `chrome://gpu`
- Look for "WebGPU: Hardware accelerated"

#### 2. Outdated GPU Drivers

Update your graphics drivers:

| Vendor | Update Method |
|--------|---------------|
| NVIDIA | [Official Download](https://www.nvidia.com/Download/) |
| AMD | [Official Download](https://www.amd.com/support) |
| Intel | Windows Update or [Intel Assistant](https://www.intel.com/content/www/us/en/support/detect.html) |

#### 3. GPU in Use

Close applications that may be using the GPU:
- Other browser tabs with WebGL/WebGPU
- Video editing software
- 3D games or applications

### "Canvas element not found"

**Error Message:** `Canvas element not found`

**Solutions:**

1. **Verify HTML structure:**
   ```html
   <canvas id="canvas"></canvas>
   ```

2. **Check script loading order:**
   ```html
   <!-- Load after canvas -->
   <canvas id="canvas"></canvas>
   <script type="module" src="main.js"></script>
   ```

3. **Verify JavaScript:**
   ```javascript
   const canvas = document.getElementById('canvas');
   if (!canvas) {
     console.error('Canvas not found!');
   }
   ```

### "Failed to create WebGPU context"

**Error:** Canvas context creation failed

**Solutions:**

1. **Check canvas is in DOM:**
   ```javascript
   console.log(document.contains(canvas)); // Should be true
   ```

2. **Verify canvas dimensions:**
   ```javascript
   if (canvas.width === 0 || canvas.height === 0) {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
   }
   ```

3. **Try recreating context:**
   ```javascript
   const ctx = canvas.getContext('webgpu');
   if (!ctx) {
     // Fall back or show error
     showError('WebGPU not available');
   }
   ```

---

## Performance Problems

### Low FPS (Less than 30)

**Symptoms:** Animation is choppy or stuttering

**Diagnostic:**
```javascript
// Check quality settings
console.log('Quality tier:', qualityTier);
console.log('Particle count:', particleCount);
```

**Solutions:**

1. **Check Quality Auto-Detection**
   - The simulation should auto-adjust based on your device
   - Check HUD in top-left for quality tier

2. **Close Other GPU-Intensive Apps**
   - Other browser tabs
   - Video streaming
   - 3D applications

3. **Power Mode (Laptops)**
   - Connect power adapter
   - Disable energy saver
   - Set performance mode to "High"

4. **Check for Fallback Adapter**
   ```javascript
   const adapter = await navigator.gpu.requestAdapter();
   if (adapter.isFallbackAdapter) {
     alert('Using software rendering. Update GPU drivers.');
   }
   ```

### High Frame Time

**Symptoms:** Consistent lag, not just occasional stutter

**Check in DevTools:**
1. Open Performance tab
2. Record for 5 seconds
3. Look for long frames (> 16.67ms)

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Too many particles | Quality system should auto-adjust |
| Browser extensions | Disable extensions, try incognito |
| Outdated browser | Update to latest version |
| Thermal throttling | Check device temperature |

---

## Visual Issues

### Black Screen

**Symptoms:** Canvas is completely black

**Diagnostic Steps:**

1. **Check console for errors**
   ```javascript
   // Should show no red errors
   ```

2. **Verify WebGPU initialization**
   ```javascript
   console.log('WebGPU:', !!navigator.gpu);
   ```

3. **Check if particles are initialized**
   ```javascript
   // In main.ts or console
   console.log('Buffers:', buffers);
   console.log('Particle count:', buffers?.particleCount);
   ```

4. **Try force redraw**
   ```javascript
   // Resize window or
   window.dispatchEvent(new Event('resize'));
   ```

**Solutions:**

| Problem | Solution |
|---------|----------|
| WebGPU failed | Update browser, check acceleration |
| Shader compile error | Clear cache (Ctrl+Shift+R) |
| Canvas not visible | Check CSS: `display: block` |
| Particles off-screen | Resize browser, refresh page |

### Particles Not Visible

**Symptoms:** Black screen or canvas shows but no particles

**Diagnostic:**
```javascript
// Check initialization
const canvas = document.getElementById('canvas');
console.log('Size:', canvas.width, canvas.height);

// Check WebGPU
const ctx = await initWebGPU(canvas);
console.log('Format:', ctx.format);
```

**Solutions:**

1. **Clear browser cache**
   - Windows/Linux: `Ctrl + Shift + R`
   - macOS: `Cmd + Shift + R`

2. **Check console for shader errors**
   - Look for WGSL compilation errors
   - Report shader errors to GitHub issues

3. **Verify color mapping**
   ```typescript
   // Check config
   import { COLOR_MAX_SPEED } from './config/sim';
   console.log('Max speed for color:', COLOR_MAX_SPEED);
   ```

### Wrong Colors

**Symptoms:** Particles show wrong colors or all same color

**Check:**
```javascript
// Verify color constants
console.log('CYAN:', CYAN);
console.log('PURPLE:', PURPLE);
console.log('COLOR_MAX_SPEED:', COLOR_MAX_SPEED);
```

**Solution:**
- Check for shader compilation errors
- Verify `COLOR_MAX_SPEED` is not zero
- Try refreshing the page

### Trails Not Showing

**Symptoms:** No motion trails behind particles

**Diagnostic:**
```javascript
// Check trail configuration
console.log('TRAIL_FADE_ALPHA:', TRAIL_FADE_ALPHA);
// Should be around 0.05
```

**Solutions:**

1. **Verify trail alpha value**
   - Should be `0.05` or similar (not 1.0)
   - Check `src/config/sim.ts`

2. **Check offscreen texture**
   - Verify trail pipeline is executing
   - Check console for texture creation errors

3. **Clear browser cache**
   - Force refresh with cache clear

---

## Mobile Issues

### Touch Not Working

**Symptoms:** No interaction when touching screen

**Solutions:**

1. **Verify touch events enabled**
   ```javascript
   // Check touch support
   console.log('Touch:', 'ontouchstart' in window);
   ```

2. **Check browser zoom**
   - Reset zoom to 100%
   - Pinch to zoom may interfere

3. **Try different browser**
   - iOS: Safari has best WebGPU support
   - Android: Chrome recommended

### Mobile Performance Issues

**Symptoms:** Very low FPS on mobile devices

**Expected Behavior:**

| Device | Expected FPS | Particle Count |
|--------|--------------|----------------|
| iPhone 15 Pro | 35-45 | 10,000 |
| iPhone 14 | 30-40 | 7,500 |
| Android Flagship | 30-45 | 7,500-10,000 |
| Mid-range | 25-35 | 5,000-7,500 |

**Optimization:**

1. **Close background apps**
2. **Enable performance mode**
3. **Reduce brightness** (prevents thermal throttling)
4. **Use Safari on iOS** (better WebGPU)

### Orientation Issues

**Symptoms:** Simulation breaks when rotating device

**Solution:**
1. Refresh page after rotation
2. Check if resize handler is working:
   ```javascript
   window.addEventListener('resize', () => {
     console.log('Resize:', window.innerWidth, window.innerHeight);
   });
   ```

---

## Debug Workflow

When encountering issues, follow this systematic approach:

### Step 1: Basic Checks

```javascript
// Run all diagnostics
const diagnostics = {
  webgpu: !!navigator.gpu,
  adapter: !!(await navigator.gpu?.requestAdapter()),
  canvas: !!document.getElementById('canvas'),
  context: !!document.getElementById('canvas')?.getContext('webgpu')
};
console.table(diagnostics);
// All should be true
```

### Step 2: Check Console

1. Open DevTools (F12)
2. Look for red error messages
3. Expand errors to see stack traces
4. Note any shader compilation errors

### Step 3: Isolate the Problem

| Test | How | Expected |
|------|-----|----------|
| Browser issue | Try different browser | Works in Chrome/Edge |
| Cache issue | Ctrl+Shift+R refresh | Fresh load |
| Extension issue | Incognito mode | No extensions |
| GPU issue | Check `chrome://gpu` | Hardware accelerated |

### Step 4: Gather Information

Before reporting issues, collect:

```javascript
// Run in console and copy output
(async () => {
  const browser = navigator.userAgent;
  const adapter = await navigator.gpu?.requestAdapter();
  const info = adapter ? await adapter.requestAdapterInfo() : null;
  
  console.log('=== System Info ===');
  console.log('Browser:', browser);
  console.log('Adapter:', info);
  console.log('Fallback:', adapter?.isFallbackAdapter);
})();
```

---

## Getting Help

### Before Reporting

1. **Try these first:**
   - [ ] Hard refresh (Ctrl+Shift+R)
   - [ ] Different browser
   - [ ] Disable extensions
   - [ ] Update browser
   - [ ] Update GPU drivers

2. **Check documentation:**
   - [API Reference](API.md)
   - [Performance Guide](PERFORMANCE.md)
   - [Main README](../../README.md)

### Reporting Issues

Include this information in your bug report:

**System Information:**
```
Browser: Chrome 122.0.6261.95 (Official Build) (arm64)
OS: macOS 14.3.1 (Darwin 23.3.0)
Device: MacBook Pro 14" 2021, Apple M1 Pro, 16GB RAM
```

**Simulation Info:**
```
Particle Count: 10,000
Quality Tier: High
FPS: ~45
```

**Console Output:**
- Copy any red error messages
- Include warnings if relevant

**Steps to Reproduce:**
1. Open simulation
2. Wait 5 seconds
3. Move mouse rapidly
4. Observe stuttering

### Where to Report

- 🐛 **Bugs:** [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues/new?template=bug_report.yml)
- 💡 **Feature Requests:** [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues/new?template=feature_request.yml)
- 💬 **Questions:** [GitHub Discussions](https://github.com/LessUp/particle-fluid-sim/discussions)

---

## Quick Reference

| Issue | First Try | Then Try |
|-------|-----------|----------|
| Won't start | Update browser | Check WebGPU at `chrome://gpu` |
| Black screen | Hard refresh (Ctrl+Shift+R) | Check console errors |
| Low FPS | Close other tabs | Check quality tier in HUD |
| No touch | Refresh page | Try Safari (iOS) |
| Stuttering | Check thermal throttling | Reduce particle count |

---

*Documentation Version: 2.0.0 | Last Updated: 2026-04-16*
