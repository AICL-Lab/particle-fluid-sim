# Troubleshooting Guide

Common issues and solutions for the WebGPU Particle Fluid Simulation.

---

## Table of Contents

- [Browser Compatibility Issues](#browser-compatibility-issues)
- [Initialization Errors](#initialization-errors)
- [Performance Problems](#performance-problems)
- [Visual Issues](#visual-issues)
- [Mobile-Specific Issues](#mobile-specific-issues)
- [Getting Help](#getting-help)

---

## Browser Compatibility Issues

### WebGPU Not Supported

**Error Message:** `WebGPU is not supported in this browser`

**Cause:** Browser doesn't support WebGPU API

**Solution:**
- Use Chrome 113+, Edge 113+, or Safari 17+
- Enable WebGPU in Firefox: Set `dom.webgpu.enabled` to `true` in `about:config`
- Check [caniuse.com/webgpu](https://caniuse.com/webgpu) for current support

**Check WebGPU Support:**
```javascript
// In browser console
if (!navigator.gpu) {
  console.log('WebGPU is not supported');
}
```

### Browser Version Too Old

**Symptoms:** Simulation won't start, console shows errors

**Solution:**
- Update Chrome/Edge to latest version
- Update Safari to macOS 14+
- Use Chrome on Windows/Linux for best support

---

## Initialization Errors

### "GPU adapter not found"

**Cause:** No compatible GPU or hardware acceleration disabled

**Solutions:**

1. **Check GPU Acceleration:**
   - Chrome: Visit `chrome://gpu`
   - Ensure "Hardware Acceleration" is enabled

2. **Update GPU Drivers:**
   - NVIDIA: Download latest from [nvidia.com](https://www.nvidia.com/Download/index.aspx)
   - AMD: Download from [amd.com](https://www.amd.com/en/support)
   - Intel: Use Windows Update or Intel Driver Assistant

3. **Disable Software Rendering:**
   - Chrome Settings → System → Disable "Use graphics acceleration when available"
   - Restart browser
   - Re-enable and restart

### "Device unavailable"

**Cause:** GPU in use by another application

**Solutions:**
- Close other GPU-intensive applications
- Restart browser
- Check if other browser tabs are using WebGPU

### Canvas element not found

**Error Message:** `Canvas element not found`

**Cause:** HTML structure changed or canvas element missing

**Solutions:**
1. Ensure `index.html` contains:
   ```html
   <canvas id="canvas"></canvas>
   ```

2. Check for JavaScript errors before initialization

---

## Performance Problems

### Low FPS (<30)

**Possible Causes:**

1. **Too many particles for device**
   - Solution: Adaptive quality should have auto-adjusted
   - Check HUD for "particles" count

2. **Other tabs using GPU**
   - Close other browser tabs
   - Close GPU-heavy applications

3. **Energy saver mode (macOS/iOS)**
   - Disable energy saver
   - Connect to power

4. **Browser extensions blocking GPU**
   - Disable GPU-accelerated extensions
   - Try incognito/private mode

### Laggy Mouse Interaction

**Cause:** High frame time or input handling issues

**Solutions:**
- Reduce particle count (edit `src/config/sim.ts`)
- Check if browser is hardware accelerated
- Try different browser (Chrome > Safari for WebGPU)

---

## Visual Issues

### Black Screen

**Possible Causes:**

1. **WebGPU not initialized properly**
   - Check console for errors
   - Ensure browser supports WebGPU

2. **Particles off-screen**
   - Resize browser window
   - Refresh page

3. **Shaders failed to compile**
   - Check console for shader errors
   - Clear browser cache and refresh

### Particles Not Appearing

**Solutions:**

1. **Check particle initialization:**
   ```javascript
   // In DevTools console, check if initialized
   const particleCount = simulationSettings.particleCount;
   console.log(`Particles: ${particleCount}`);
   ```

2. **Verify canvas size:**
   ```javascript
   // Check if canvas has size
   const canvas = document.getElementById('canvas');
   console.log(`Canvas: ${canvas.width}x${canvas.height}`);
   ```

3. **Clear browser cache:**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (macOS)

### Colors Look Wrong

**Cause:** Color mapping or shader issues

**Solutions:**
1. Check console for shader compilation errors
2. Verify `COLOR_MAX_SPEED` in config
3. Try refreshing the page

### Trails Not Showing

**Cause:** Trail texture or shader issues

**Solutions:**
1. Check `TRAIL_FADE_ALPHA` value (should be ~0.05)
2. Verify trail pass is executing
3. Check browser console for errors

---

## Mobile-Specific Issues

### Touch Not Working

**Symptoms:** No interaction when touching screen

**Solutions:**

1. **Ensure touch events are enabled:**
   - Implementation already includes touch support
   - Check if JavaScript is enabled

2. **Browser zoom interfering:**
   - Reset zoom to 100%
   - Disable zoom in browser settings

3. **Check accessibility settings:**
   - Ensure touch isn't being redirected

### Mobile Performance Issues

**Solutions:**

1. **Reduce particle count manually:**
   ```typescript
   // Edit src/config/sim.ts
   export const PARTICLE_COUNT = 2500; // Lower for mobile
   ```

2. **Use mobile browser:**
   - Safari on iOS (better WebGPU support)
   - Chrome on Android

3. **Close background apps:**
   - Free up device resources

### Orientation Change Issues

**Symptoms:** Simulation breaks on rotation

**Cause:** Resize handler not updating properly

**Solutions:**
1. Refresh page after rotation
2. Implementation should auto-handle (check `reconfigureContext` in main.ts)

---

## Debug Steps

When experiencing issues, follow these steps:

### Step 1: Check Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy error message for reporting

### Step 2: Verify WebGPU Support

```javascript
// Run in console
console.log('WebGPU supported:', !!navigator.gpu);

if (navigator.gpu) {
  const adapter = await navigator.gpu.requestAdapter();
  console.log('Adapter:', adapter);
}
```

### Step 3: Check Canvas

```javascript
// Run in console
const canvas = document.getElementById('canvas');
console.log('Canvas:', canvas);
console.log('Context:', canvas?.getContext('webgpu'));
```

### Step 4: Monitor Performance

```javascript
// Check FPS in HUD or console
// FPS is displayed in top-left corner
```

---

## Getting Help

### Before Reporting Issues

- Check this guide thoroughly
- Try in a different browser
- Check if issue is browser-specific

### When Reporting

Provide the following information:

1. **Browser and Version**
   ```
   Chrome 122.0.6261.57 (Official Build)
   ```

2. **Operating System**
   ```
   macOS 14.3 (Darwin 23.2.0)
   ```

3. **Device Information**
   ```
   MacBook Pro 14", Apple M1 Pro, 16GB RAM
   ```

4. **Issue Description**
   - What you expected to happen
   - What actually happened
   - Steps to reproduce

5. **Console Errors**
   - Copy and paste error messages

6. **Performance Info** (if applicable)
   - Particle count shown in HUD
   - FPS reading

### Where to Report

- **Bug Reports:** [Open an issue on GitHub](https://github.com/LessUp/particle-fluid-sim/issues/new/choose)
- **Feature Requests:** [Use Feature Request template](https://github.com/LessUp/particle-fluid-sim/issues/new/choose)
- **Questions:** [Start a discussion](https://github.com/LessUp/particle-fluid-sim/discussions)

### Additional Resources

- [API Documentation](API.md) - For development questions
- [Performance Benchmarks](PERFORMANCE.md) - Optimization tips
- [Contributing Guide](../CONTRIBUTING.md) - For code contributions

---

## Quick Reference

| Issue | First Try | Then Try |
|-------|-----------|----------|
| Won't start | Update browser | Check WebGPU support |
| Black screen | Refresh | Clear cache |
| Low FPS | Close other tabs | Reduce particles |
| No mouse | Check canvas | Try different browser |
| Touch issues | Refresh | Reduce particles |
| Console errors | Copy message | Report issue |

---

*Last updated: 2026-04-16*
