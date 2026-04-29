---
sidebar_position: 3
---

# Architecture

System architecture overview for the WebGPU Particle Fluid Simulation.

## CPU-GPU Heterogeneous Computing

```
┌─────────────────────────────────────────────────────┐
│  CPU (TypeScript)                                    │
│  • WebGPU initialization                            │
│  • Quality detection & scaling                      │
│  • Input handling (mouse/touch)                     │
│  • Frame loop orchestration                         │
└───────────────────┬─────────────────────────────────┘
                    │ writeBuffer / commandEncoder
                    ▼
┌─────────────────────────────────────────────────────┐
│  GPU (WGSL Shaders)                                  │
│                                                       │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  1.Compute  │─▶│ 2.Trail  │─▶│ 3. Render    │    │
│  │  Physics    │  │ Effects  │  │  Particles   │    │
│  └─────────────┘  └──────────┘  └──────┬───────┘    │
│                                         │            │
│                                         ▼            │
│                                ┌──────────────┐     │
│                                │ 4. Present   │     │
│                                │ To Screen    │     │
│                                └──────────────┘     │
└─────────────────────────────────────────────────────┘
```

## Physics Pipeline

Each particle updates every frame with these steps:

1. **Apply Gravity** → `velocity += gravity * deltaTime`
2. **Mouse Repulsion** → Push away if within radius
3. **Clamp Velocity** → Limit to `MAX_SPEED`
4. **Update Position** → `position += velocity * deltaTime`
5. **Boundary Bounce** → Elastic collision with damping

## Key Modules

| Module                  | Purpose                                     |
| ----------------------- | ------------------------------------------- |
| `src/core/webgpu.ts`    | WebGPU device and context initialization    |
| `src/core/buffers.ts`   | GPU buffer creation and management          |
| `src/core/pipelines.ts` | Compute and render pipeline setup           |
| `src/core/renderer.ts`  | Frame orchestration and render loop         |
| `src/core/physics.ts`   | CPU-side physics calculations (for testing) |
| `src/core/color.ts`     | Velocity-to-color mapping                   |
| `src/core/input.ts`     | Mouse and touch event handling              |
| `src/core/quality.ts`   | Adaptive quality detection                  |
| `src/config/sim.ts`     | Simulation constants                        |
| `src/shaders/*.wgsl`    | GPU shader programs                         |

## Data Flow

```
Particle Buffer (GPU)
       │
       ▼
┌─────────────────┐
│ Compute Shader  │ ← Uniform Buffer (canvas size, mouse, delta time)
│ (physics.wgsl)  │
└────────┬────────┘
         │ Updated particles
         ▼
┌─────────────────┐
│ Render Shader   │ → Trail Texture
│ (render.wgsl)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Present Shader  │ → Screen
│ (present.wgsl)  │
└─────────────────┘
```

## Performance Characteristics

| Metric            | Value          | Notes                          |
| ----------------- | -------------- | ------------------------------ |
| Particles         | 2,500 - 10,000 | Adaptive based on device       |
| Particle Size     | 16 bytes       | 4 × float32 (x, y, vx, vy)     |
| Compute Workgroup | 64 threads     | Optimized for GPU architecture |
| Frame Budget      | < 16ms         | Targets 60 FPS                 |

## See Also

- [Core Architecture RFC](https://github.com/LessUp/particle-fluid-sim/blob/master/openspec/specs/rfc/0001-core-architecture.md) - Detailed design decisions
- [API Reference](/docs/api) - TypeScript API documentation
- [Performance Guide](/docs/performance) - Optimization strategies
