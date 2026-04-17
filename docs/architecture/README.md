# Architecture Overview

> **Version**: 2.0.0 | **Last Updated**: 2026-04-17

This document provides a high-level overview of the WebGPU Particle Fluid Simulation architecture.

---

## System Architecture

### Heterogeneous Computing Model

The simulation uses a hybrid CPU-GPU architecture:

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

---

## Core Components

### Module Overview

| Module | File | Responsibility |
|--------|------|----------------|
| **Config** | `src/config/sim.ts` | Simulation constants |
| **WebGPU** | `src/core/webgpu.ts` | GPU initialization |
| **Buffers** | `src/core/buffers.ts` | GPU buffer management |
| **Physics** | `src/core/physics.ts` | CPU physics reference |
| **Color** | `src/core/color.ts` | Color mapping |
| **Input** | `src/core/input.ts` | Mouse/touch handling |
| **Pipelines** | `src/core/pipelines.ts` | WebGPU pipeline creation |
| **Quality** | `src/core/quality.ts` | Adaptive quality |
| **Renderer** | `src/core/renderer.ts` | Render loop |

---

## Data Flow

### Frame Pipeline

Each frame executes four GPU passes in sequence:

| Pass | Shader | Input | Output | Purpose |
|------|--------|-------|--------|---------|
| **1. Compute** | `compute.wgsl` | Particle buffer | Particle buffer | Update physics |
| **2. Trail** | `trail.wgsl` | Offscreen texture | Offscreen texture | Fade trails |
| **3. Render** | `render.wgsl` | Particle buffer | Offscreen texture | Draw particles |
| **4. Present** | `present.wgsl` | Offscreen texture | Swap chain | Composite to screen |

### Data Layout

#### Particle Buffer (Storage Buffer)

Each particle: **16 bytes** (4 × float32)

```
┌─────────┬─────────┬─────────┬─────────┐
│  x (f32)│  y (f32)│ vx (f32)│ vy (f32)│
├─────────┼─────────┼─────────┼─────────┤
│ Offset: │    +4   │    +8   │   +12   │
│    0    │         │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

#### Uniform Buffer

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

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Offscreen trail texture | More portable than relying on swapchain persistence |
| Shared constants via preamble | Single source of truth for TypeScript and WGSL |
| CPU reference implementations | Enables property testing of GPU-equivalent logic |
| Adaptive particle count | Graceful degradation on low-end devices |

---

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

---

## Related Documents

- [RFC 0001: Core Architecture](../../specs/rfc/0001-core-architecture.md) - Detailed technical design
- [API Reference](../API.md) - Complete API documentation
- [Performance Guide](../PERFORMANCE.md) - Optimization strategies
- [Testing Specification](../../specs/testing/bdd-specifications.md) - Test architecture

---

## Diagrams

### Initialization Sequence

```
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│ Start  │───▶│ Init   │───▶│ Create │───▶│ Start  │
│        │    │ WebGPU │    │Buffers │    │ Render │
└────────┘    └────────┘    └────────┘    └────────┘
                  │              │              │
                  ▼              ▼              ▼
             ┌────────┐    ┌────────┐    ┌────────┐
             │ Check  │    │ Detect │    │ RAF    │
             │Support │    │ Quality│    │ Loop   │
             └────────┘    └────────┘    └────────┘
```

### Physics Update Cycle

```
For each particle:
  ┌────────────────────────────────────────────┐
  │  1. Apply gravity: velocity += gravity * dt │
  │  2. Apply mouse repulsion (if within radius)│
  │  3. Clamp velocity to MAX_SPEED             │
  │  4. Update position: position += velocity*dt│
  │  5. Boundary bounce with damping            │
  └────────────────────────────────────────────┘
```
