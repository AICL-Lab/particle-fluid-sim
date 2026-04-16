# Performance Optimization Guide

← [Back to Docs Home](README.md) | [简体中文](../zh-CN/PERFORMANCE.md)

> **Version**: 2.0.0  
> **Last Updated**: 2026-04-16

---

This guide provides comprehensive performance data, benchmarking methods, and optimization strategies for the WebGPU Particle Fluid Simulation.

## Table of Contents

- [Performance Overview](#performance-overview)
- [Reference Hardware](#reference-hardware)
- [Benchmark Results](#benchmark-results)
- [Optimization Guide](#optimization-guide)
- [Profiling Techniques](#profiling-techniques)
- [Troubleshooting Performance Issues](#troubleshooting-performance-issues)

---

## Performance Overview

The WebGPU Particle Fluid Simulation is designed for high-performance GPU-accelerated particle physics. Key performance characteristics:

| Metric | Typical Value | Notes |
|--------|---------------|-------|
| Target FPS | 60 | Matches display refresh rate |
| Frame Budget | ~16.67ms | With headroom for browser overhead |
| Workgroup Size | 64 | Optimal for most GPUs |
| Particle Updates | GPU compute shader | Parallel across thousands of particles |

---

## Reference Hardware

Benchmark hardware specifications for comparison:

| Tier | Device | CPU | GPU | RAM |
|------|--------|-----|-----|-----|
| **High-end** | Desktop Gaming | AMD Ryzen 9 5950X | NVIDIA RTX 3080 | 32 GB |
| **Mid-range** | MacBook Pro | Apple M1 Pro | Integrated | 16 GB |
| **Low-end** | Budget Laptop | Intel i5-1135G7 | Intel Iris Xe | 8 GB |
| **Mobile** | iPhone 15 Pro | Apple A17 Pro | Integrated | 8 GB |

---

## Benchmark Results

### Particle Count Scaling

Performance at different particle counts (FPS):

| Particles | High-end | Mid-range | Low-end | Mobile |
|-----------|----------|-----------|---------|--------|
| 2,500 | 60 | 60 | 60 | 60 |
| 5,000 | 60 | 60 | 60 | 58 |
| 7,500 | 60 | 60 | 55 | 45 |
| 10,000 | 60 | 60 | 48 | 35 |

### Frame Time Breakdown

Average time per pass (10,000 particles, 60 FPS target):

| Pass | Time (ms) | % of Budget | Description |
|------|-----------|-------------|-------------|
| Compute | 1.2 | 7% | Physics simulation |
| Trail | 0.3 | 2% | Fade texture |
| Render | 0.8 | 5% | Draw particles |
| Present | 0.2 | 1% | Composite to screen |
| **GPU Total** | **2.5** | **15%** | All GPU passes |
| **Overhead** | **~14** | **85%** | Browser, compositing |

### Adaptive Quality Results

Default particle counts by device type:

| Device Type | Particles | Quality Tier | Scaling Factor |
|-------------|-----------|--------------|----------------|
| High-end Desktop | 10,000 | High | 100% |
| Mid-range Desktop | 7,500 | High | 75% |
| High-end Laptop | 7,000 | Medium | 70% |
| Mid-range Laptop | 5,000 | Medium | 50% |
| Low-end Device | 2,500-3,500 | Low | 25-35% |
| Fallback Adapter | 2,500 | Low | 25% |

---

## Optimization Guide

### For Users

#### Browser Optimization

1. **Use Chrome or Edge**
   - Best WebGPU performance as of 2026
   - Most mature WebGPU implementation
   
2. **Keep Browser Updated**
   - WebGPU improvements in each release
   - Latest Chrome/Edge recommended

3. **Disable Extensions**
   - GPU-accelerated extensions can interfere
   - Try incognito mode if issues persist

4. **Check GPU Acceleration**
   - Chrome: Visit `chrome://gpu`
   - Verify "WebGPU" shows "Hardware accelerated"

#### System Optimization

1. **Update GPU Drivers**
   - NVIDIA: [Download from nvidia.com](https://www.nvidia.com/Download/)
   - AMD: [Download from amd.com](https://www.amd.com/support)
   - Intel: Use Windows Update or Intel Driver Assistant

2. **Close GPU-Heavy Applications**
   - Other WebGPU/WebGL tabs
   - Video encoding/decoding
   - 3D applications

3. **Power Settings (Laptops)**
   - Connect to power adapter
   - Disable battery saver / energy saver mode
   - Set to "High Performance" mode

### For Developers

#### GPU Performance

1. **Maintain Workgroup Size of 64**
   ```wgsl
   // Optimal for most GPUs
   @compute @workgroup_size(64)
   fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
     // Particle update logic
   }
   ```

2. **Reuse GPU Buffers**
   ```typescript
   // ✅ Good: Write to existing buffer
   device.queue.writeBuffer(uniformBuffer, 0, uniformData);
   
   // ❌ Bad: Creating buffers per frame
   const buffer = device.createBuffer({ size: 256, usage: ... });
   ```

3. **Minimize Buffer Updates**
   ```typescript
   // Update uniforms once per frame
   updateUniformBuffer(device, buffer, width, height, mouseX, mouseY, dt);
   ```

4. **Use Appropriate Buffer Usage Flags**
   ```typescript
   // Particle buffer: storage + vertex + copy destination
   usage: GPUBufferUsage.STORAGE | 
          GPUBufferUsage.VERTEX | 
          GPUBufferUsage.COPY_DST
   ```

#### Memory Management

1. **Destroy Unused Resources**
   ```typescript
   // When simulation stops
   renderer.destroy(); // Cleans up textures, buffers
   ```

2. **Remove Event Listeners**
   ```typescript
   // Use named functions for removal
   window.removeEventListener('resize', handleResize);
   ```

3. **Avoid Memory Leaks in Tests**
   ```typescript
   afterEach(() => {
     // Clean up any created resources
   });
   ```

#### Shader Optimization

1. **Minimize Divergence**
   ```wgsl
   // ✅ Better: Less branching
   let factor = select(0.0, 1.0 - dist / radius, dist < radius);
   
   // Acceptable for clarity
   if (dist < radius) {
     // Repulsion logic
   }
   ```

2. **Use Constants for Magic Numbers**
   ```wgsl
   // Constants injected at build time
   const MAX_SPEED: f32 = 800.0;
   const DAMPING: f32 = 0.9;
   ```

---

## Profiling Techniques

### Browser DevTools

#### Chrome Performance Tab

1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Run simulation for 5-10 seconds
5. Click Stop
6. Analyze:
   - Frame times (should be < 16.67ms)
   - GPU activity
   - JavaScript execution time

#### WebGPU Specific Tools

```javascript
// Check adapter info in console
const adapter = await navigator.gpu.requestAdapter();
const info = await adapter.requestAdapterInfo();
console.table(info);
// Shows: vendor, architecture, device, description
```

### FPS Counter

The simulation displays FPS in the top-left corner. Interpretation:

| FPS | Status | Action |
|-----|--------|--------|
| 60 | ✅ Optimal | None needed |
| 45-59 | ⚠️ Good | Minor optimization possible |
| 30-44 | ⚠️ Fair | Consider reducing particles |
| < 30 | ❌ Poor | Reduce quality or check system |

### Quality Tier Monitor

The HUD displays current quality tier:
- **High**: Full particle count (7,500-10,000)
- **Medium**: Reduced count (5,000-7,500)
- **Low**: Minimum count (2,500-5,000)

---

## Troubleshooting Performance Issues

### Low FPS (< 30)

#### Checklist

1. **Verify WebGPU Hardware Acceleration**
   ```javascript
   // In browser console
   const adapter = await navigator.gpu.requestAdapter();
   console.log('Fallback adapter:', adapter.isFallbackAdapter);
   // Should be false for good performance
   ```

2. **Check Particle Count**
   - Look at HUD in top-left
   - If > device capability, quality system should auto-adjust

3. **Browser-Specific Issues**

   | Browser | Common Issue | Solution |
   |---------|--------------|----------|
   | Chrome | GPU process crash | Restart browser |
   | Edge | Same as Chrome | Restart browser |
   | Safari | Energy saver mode | Disable in System Settings |

4. **System Issues**
   - Check available GPU memory
   - Close background applications
   - Update GPU drivers

### Stuttering

1. **Check for garbage collection pauses**
   - Use Chrome DevTools Memory tab
   - Look for sawtooth pattern

2. **Reduce allocations in loop**
   ```typescript
   // ✅ Reuse arrays
   const uniformData = new Float32Array(8);
   
   function frame() {
     uniformData[0] = width;
     // ... update values
     device.queue.writeBuffer(buffer, 0, uniformData);
   }
   ```

### High CPU Usage

Expected behavior:
- **JavaScript**: Minimal (< 5% single core)
- **GPU**: Variable based on particle count
- **Total**: Should not significantly impact system

If CPU usage is high:
- Check for infinite loops in custom code
- Verify requestAnimationFrame usage
- Check for excessive logging

---

## Performance Testing

### Automated Benchmark

```typescript
// Example benchmarking approach
async function benchmark(particleCount: number, duration: number) {
  const frames = [];
  let frameCount = 0;
  const startTime = performance.now();
  
  function measure() {
    const now = performance.now();
    const elapsed = now - startTime;
    
    if (elapsed < duration * 1000) {
      frames.push(1000 / (now - lastTime));
      frameCount++;
      lastTime = now;
      requestAnimationFrame(measure);
    } else {
      reportResults(frames, particleCount);
    }
  }
  
  measure();
}
```

### Reporting Issues

When reporting performance issues, include:

1. **System Info**
   ```
   Browser: Chrome 122.0.6261.57
   OS: macOS 14.3
   Device: MacBook Pro 14", M1 Pro, 16GB
   ```

2. **Simulation Info**
   ```
   Particle count: 10,000
   Quality tier: High
   FPS: 45
   ```

3. **Benchmark Data**
   - Chrome DevTools Performance export (if possible)
   - `chrome://gpu` output

---

## Related Resources

- [API Reference](API.md) - Technical documentation
- [Troubleshooting](TROUBLESHOOTING.md) - General issues
- [WebGPU Best Practices](https://developer.chrome.com/docs/webgpu/) - External resource

---

*Documentation Version: 2.0.0 | Last Updated: 2026-04-16*
