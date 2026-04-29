---
sidebar_position: 5
---

# Troubleshooting

Common issues and solutions for the WebGPU Particle Fluid Simulation.

## Browser Compatibility Issues

### WebGPU Not Supported

**Error:** `WebGPU is not supported in this browser`

**Solution:**

- Use Chrome 113+, Edge 113+, or Safari 17+
- Enable WebGPU in Firefox: Set `dom.webgpu.enabled` to `true` in `about:config`
- Check [caniuse.com/webgpu](https://caniuse.com/webgpu) for current support

**Quick check in browser console:**

```javascript
if (!navigator.gpu) {
  console.log('WebGPU is not supported');
}
```

### Browser Version Too Old

**Solution:**

- Update Chrome/Edge to latest version
- Update Safari to macOS 14+
- Use Chrome on Windows/Linux for best support

## Initialization Errors

### "GPU adapter not found"

**Cause:** No compatible GPU or hardware acceleration disabled

**Solutions:**

1. **Check GPU Acceleration:**
   - Chrome: Visit `chrome://gpu`
   - Ensure "Hardware Acceleration" is enabled

2. **Update GPU Drivers:**
   - NVIDIA: Download from [nvidia.com](https://www.nvidia.com/Download/index.aspx)
   - AMD: Download from [amd.com](https://www.amd.com/en/support)
   - Intel: Use Windows Update or Intel Driver Assistant

### "Device unavailable"

**Cause:** GPU in use by another application

**Solutions:**

- Close other GPU-intensive applications
- Restart browser
- Check if other browser tabs are using WebGPU

## Performance Problems

### Low FPS / Stuttering

**Solutions:**

1. **Check quality tier:** The app auto-scales particles (2,500 - 10,000)
2. **Reduce browser overhead:** Close other tabs and extensions
3. **Update GPU drivers** to latest version
4. **Check power settings:** Use "High Performance" mode on laptops

### Black Screen

**Solutions:**

1. Check browser console for WebGPU errors
2. Ensure hardware acceleration is enabled
3. Try a different WebGPU-compatible browser

## Mobile-Specific Issues

### Touch Not Working

**Solution:** Touch events should work automatically. If not, ensure:

- JavaScript is enabled
- No browser extensions blocking events
- Touch events are not being intercepted

### Performance on Mobile

**Solution:**

- Use Chrome or Edge on Android
- Safari 17+ on iOS
- The app automatically reduces particle count on mobile devices

## Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues)
2. Open a new issue with:
   - Browser and version
   - Operating system
   - Console error messages
   - Steps to reproduce
