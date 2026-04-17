# RFC 0001: Core Architecture — WebGPU Particle Fluid Simulation

> **Status:** Stable — Maintenance Mode
> **Last Updated:** 2026-04-16
> **Version:** 2.0.0
> **Related Specs:** [Product Requirements](../product/webgpu-particle-fluid-sim.md)

## Overview

This document describes the architecture and design decisions for a high-performance particle fluid simulation using WebGPU. The system leverages GPU parallel computing via Compute Shaders to achieve real-time physics simulation for thousands of particles.

## Architecture

### Heterogeneous Computing Model

```
┌─────────────────────────────────────────────────────────────────┐
│                         CPU (TypeScript)                         │
├─────────────────────────────────────────────────────────────────┤
│  • WebGPU initialization and canvas configuration                │
│  • Runtime quality selection based on device capabilities        │
│  • Uniform buffer updates (canvas size, mouse position, dt)      │
│  • Input handling (mouse/touch events → HiDPI coordinates)       │
│  • Frame loop orchestration via requestAnimationFrame            │
└─────────────────────────────────────────────────────────────────┘
                              │
                    writeBuffer / commandEncoder
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          GPU (WGSL)                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Compute Pass                           │   │
│  │  • Parallel particle physics (workgroup_size: 64)         │   │
│  │  • Gravity, repulsion, velocity clamp, boundary bounce    │   │
│  │  • Reads/writes particle storage buffer                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Trail Pass                             │   │
│  │  • Fade persistent offscreen texture (alpha: 0.05)        │   │
│  │  • Fullscreen quad (triangle strip)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Render Pass                            │   │
│  │  • Draw particles as colored points                       │   │
│  │  • Velocity-to-color mapping (cyan → purple)              │   │
│  │  • Output to offscreen texture                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Present Pass                           │   │
│  │  • Composite offscreen texture to swapchain canvas        │   │
│  │  • Bilinear sampling for smooth appearance                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Offscreen trail texture | More portable than relying on swapchain persistence |
| Shared constants via preamble | Single source of truth for TypeScript and WGSL |
| CPU reference implementations | Enables property testing of GPU-equivalent logic |
| Adaptive particle count | Graceful degradation on low-end devices |

## Data Layout

### Particle Buffer (Storage Buffer)

Each particle: **16 bytes** (4 × float32)

```
┌─────────┬─────────┬─────────┬─────────┐
│  x (f32)│  y (f32)│ vx (f32)│ vy (f32)│
├─────────┼─────────┼─────────┼─────────┤
│ Offset: │    +4   │    +8   │   +12   │
│    0    │         │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

Total size: `particleCount × 16` bytes

### Uniform Buffer

Total: **32 bytes** (8 × float32, 16-byte aligned)

```
┌──────────┬───────────┬───────────┬───────────┐
│ width    │  height   │  mouseX   │  mouseY   │
│  (f32)   │   (f32)   │   (f32)   │   (f32)   │
├──────────┼───────────┼───────────┼───────────┤
│ deltaTime│  _pad1    │  _pad2    │  _pad3    │
│  (f32)   │   (f32)   │   (f32)   │   (f32)   │
└──────────┴───────────┴───────────┴───────────┘
```

## WGSL Shader Design

### Compute Shader (`compute.wgsl`)

```wgsl
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u) {
  // 1. Bounds check
  // 2. Apply gravity: velocity += GRAVITY * dt
  // 3. Apply mouse repulsion (inverse distance)
  // 4. Clamp velocity to MAX_SPEED
  // 5. Update position: position += velocity * dt
  // 6. Boundary bounce with damping
}
```

### Render Shader (`render.wgsl`)

```wgsl
@vertex fn vertexMain(vertexIndex: u32) -> VertexOutput {
  // Convert pixel position to NDC (-1 to 1)
  // Pass speed to fragment shader
}

@fragment fn fragmentMain(speed: f32) -> vec4f {
  // Color interpolation: mix(CYAN, PURPLE, speed/MAX_SPEED)
  // Brightness: 0.5 + t * 0.5
}
```

### Trail Shader (`trail.wgsl`)

```wgsl
@fragment fn fragmentMain() -> vec4f {
  return vec4f(0.0, 0.0, 0.0, TRAIL_FADE_ALPHA);
}
```

### Present Shader (`present.wgsl`)

```wgsl
@fragment fn fragmentMain(uv: vec2f) -> vec4f {
  return textureSample(sceneTexture, sceneSampler, uv);
}
```

## Adaptive Quality System

The quality system adjusts particle count at startup based on:

```typescript
interface SimulationHeuristicsInput {
  hardwareConcurrency?: number;      // CPU cores
  deviceMemory?: number;             // Device RAM (GB)
  isFallbackAdapter: boolean;        // Software rendering?
  maxStorageBufferBindingSize: number;
  viewportPixels: number;            // Width × Height × DPR²
}
```

### Scaling Rules

| Condition | Max Scale |
|-----------|-----------|
| Fallback adapter | 40% |
| RAM ≤ 2 GB | 45% |
| RAM ≤ 4 GB | 65% |
| Cores ≤ 2 | 45% |
| Cores ≤ 4 | 70% |
| 4K viewport | 65% |
| QHD viewport | 85% |

Typical output: **2,500 – 10,000 particles**

## Error Handling

### Initialization Errors

| Error | Handling |
|-------|----------|
| WebGPU not supported | Show message, suggest Chrome/Edge 113+ |
| Adapter unavailable | Show GPU compatibility message |
| Device unavailable | Show fallback message |
| Context creation failed | Log error, halt |

### Runtime Errors

| Error | Handling |
|-------|----------|
| Device lost | Log message, suggest page refresh |
| Out of memory | Not handled (quality system prevents) |

## Testing Strategy

### Property-Based Tests

Using fast-check with minimum 100 runs per property:

| Property | Module | Validates |
|----------|--------|-----------|
| Particle Bounds | `buffers.test.ts` | All particles initialized within canvas |
| Physics Integration | `physics.test.ts` | Position/velocity updates match formula |
| Boundary Bounce | `physics.test.ts` | Correct reflection with damping |
| Repulsion Falloff | `physics.test.ts` | Inverse distance relationship |
| Velocity Clamping | `physics.test.ts` | Speed ≤ MAX_SPEED |
| Color Mapping | `color.test.ts` | RGB in [0, 1] range |

### Test Coverage

```
src/core/
├── buffers.ts    → buffers.test.ts
├── color.ts      → color.test.ts
├── physics.ts    → physics.test.ts
├── quality.ts    → quality.test.ts
└── types.ts      → types.test.ts
```

## Performance Considerations

### GPU Optimization

- **Workgroup size 64**: Optimal for most GPUs
- **Single buffer for particles**: Minimizes memory bandwidth
- **Offscreen texture reuse**: Avoids reallocation per frame

### CPU Optimization

- **requestAnimationFrame timing**: Natural frame pacing
- **Minimal per-frame allocation**: Reuse Float32Array for uniforms
- **Event delegation**: Single resize handler

### Quality Scaling

The adaptive system prevents:
- Frame drops on low-end devices
- Memory allocation failures
- GPU timeout/crash on constrained hardware

## Future Considerations

Potential enhancements for future versions:

### High Effort / High Impact
| Enhancement | Description | Effort |
|-------------|-------------|--------|
| SPH (Smoothed Particle Hydrodynamics) | Realistic fluid dynamics simulation | High |
| WebXR Support | Immersive VR/AR viewing | High |
| Multi-threaded Initialization | Web Workers for particle setup | Medium |

### Medium Effort / Medium Impact
| Enhancement | Description | Effort |
|-------------|-------------|--------|
| Custom Particle Shaders | User-provided behavior shaders | Medium |
| State Persistence | Save/load simulation state | Medium |
| Interactive Controls | UI for adjusting parameters | Medium |

### Low Effort / Nice to Have
| Enhancement | Description | Effort |
|-------------|-------------|--------|
| Screenshot/Recording | Export canvas as image/video | Low |
| Color Themes | Alternative color schemes | Low |
| Particle Shapes | Non-point primitives | Low |

### Architecture Notes for Future Development

1. **Shader Modifications**: Any shader changes must be reflected in corresponding TypeScript CPU implementations for testing
2. **Buffer Layout Changes**: Require updates to both WGSL structs and TypeScript interfaces
3. **New Pipelines**: Follow the existing 4-pass pattern for consistency
4. **Performance Testing**: Benchmark on multiple devices before merging performance-sensitive changes
