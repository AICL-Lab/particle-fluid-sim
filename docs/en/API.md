# API Reference

← [Back to Docs Home](README.md) | [简体中文](../zh-CN/API.md)

> **Version**: 2.0.0  
> **Last Updated**: 2026-04-16

---

This document provides comprehensive API documentation for the WebGPU Particle Fluid Simulation project, covering all public modules, functions, types, and constants.

## Table of Contents

- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Types](#types)
- [Core Modules](#core-modules)
  - [WebGPU Initialization](#webgpu-initialization)
  - [Buffer Management](#buffer-management)
  - [Physics](#physics)
  - [Color Mapping](#color-mapping)
  - [Input Handling](#input-handling)
  - [Pipeline Creation](#pipeline-creation)
  - [Renderer](#renderer)
  - [Quality Heuristics](#quality-heuristics)
- [Shader Constants](#shader-constants)
- [Data Layouts](#data-layouts)
- [Glossary](#glossary)

---

## Quick Start

```typescript
import { initWebGPU } from './core/webgpu';
import { createBuffers } from './core/buffers';
import { createPipelines } from './core/pipelines';
import { createRenderer } from './core/renderer';
import { createMouseHandler } from './core/input';

async function main() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = await initWebGPU(canvas);
  const buffers = createBuffers(ctx.device, { x: canvas.width, y: canvas.height });
  const pipelines = createPipelines(ctx.device, ctx.format, buffers);
  const mouse = createMouseHandler(canvas);
  
  const renderer = createRenderer(ctx, pipelines, buffers, mouse.getMousePosition);
  renderer.start();
}
```

---

## Configuration

### `src/config/sim.ts`

Central configuration file containing all simulation constants. Modifying these values affects both CPU and GPU behavior.

#### Simulation Constants

| Constant | Type | Default | Unit | Description |
|----------|------|---------|------|-------------|
| `PARTICLE_COUNT` | `number` | `10000` | count | Default number of particles |
| `PARTICLE_SIZE` | `number` | `16` | bytes | Bytes per particle (4 floats × 4 bytes) |
| `WORKGROUP_SIZE` | `number` | `64` | threads | WebGPU compute workgroup size |
| `GRAVITY` | `Vec2` | `{x: 0, y: 600}` | px/s² | Gravity acceleration |
| `DAMPING` | `number` | `0.9` | ratio | Velocity damping on bounce |
| `REPULSION_RADIUS` | `number` | `200` | px | Mouse repulsion radius |
| `REPULSION_STRENGTH` | `number` | `3000` | px/s | Mouse repulsion force |
| `MAX_SPEED` | `number` | `800` | px/s | Maximum particle velocity |
| `COLOR_MAX_SPEED` | `number` | `800` | px/s | Speed for full color intensity |
| `DEFAULT_DELTA_TIME` | `number` | `1/60` | s | Default timestep |
| `MAX_DELTA_TIME` | `number` | `0.05` | s | Max dt to prevent instability |
| `TRAIL_FADE_ALPHA` | `number` | `0.05` | alpha | Trail fade rate |

#### Color Constants

| Constant | Type | RGB Value | Description |
|----------|------|-----------|-------------|
| `CYAN` | `Color` | `{r: 0, g: 1, b: 1}` | Slow particle color |
| `PURPLE` | `Color` | `{r: 0.9, g: 0.3, b: 1}` | Fast particle color |

#### Shader Preamble Functions

These functions generate WGSL code with constants injected:

```typescript
function buildComputeShaderPreamble(): string
```
Returns WGSL code with: `GRAVITY`, `REPULSION_RADIUS`, `REPULSION_STRENGTH`, `DAMPING`, `MAX_SPEED`

```typescript
function buildRenderShaderPreamble(): string
```
Returns WGSL code with: `CYAN`, `PURPLE`, `MAX_SPEED`

```typescript
function buildTrailShaderPreamble(): string
```
Returns WGSL code with: `TRAIL_FADE_ALPHA`

---

## Types

### `src/types.ts`

#### Core Interfaces

```typescript
interface Particle {
  x: number;   // Position X (pixels)
  y: number;   // Position Y (pixels)
  vx: number;  // Velocity X (px/s)
  vy: number;  // Velocity Y (px/s)
}
```

```typescript
interface Vec2 {
  x: number;
  y: number;
}
```

```typescript
interface Color {
  r: number;  // Red (0-1)
  g: number;  // Green (0-1)
  b: number;  // Blue (0-1)
}
```

#### GPU Types

```typescript
interface Uniforms {
  width: number;      // Canvas width
  height: number;     // Canvas height
  mouseX: number;     // Mouse X position
  mouseY: number;     // Mouse Y position
  deltaTime: number;  // Frame delta time
  _pad1: number;      // Padding for 16-byte alignment
  _pad2: number;
  _pad3: number;
}
```

```typescript
interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
  canvas: HTMLCanvasElement;
}
```

```typescript
interface ParticleBuffers {
  particleBuffer: GPUBuffer;
  uniformBuffer: GPUBuffer;
  particleCount: number;
}
```

```typescript
interface Pipelines {
  computePipeline: GPUComputePipeline;
  renderPipeline: GPURenderPipeline;
  trailPipeline: GPURenderPipeline;
  presentPipeline: GPURenderPipeline;
  computeBindGroup: GPUBindGroup;
  renderBindGroup: GPUBindGroup;
}
```

#### Quality Types

```typescript
type SimulationQualityTier = 'low' | 'medium' | 'high';

interface RuntimeSimulationSettings {
  particleCount: number;
  qualityTier: SimulationQualityTier;
  scale: number;
}

interface SimulationHeuristicsInput {
  hardwareConcurrency?: number;        // CPU cores
  deviceMemory?: number;               // Device RAM (GB)
  isFallbackAdapter: boolean;          // Fallback GPU?
  maxStorageBufferBindingSize: number; // GPU buffer limit
  viewportPixels: number;              // Canvas pixel count
}
```

---

## Core Modules

### WebGPU Initialization

#### `src/core/webgpu.ts`

Handles WebGPU initialization and canvas configuration.

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext>
```
Initializes WebGPU and returns the complete context.

**Parameters:**
- `canvas` - HTML canvas element for rendering

**Returns:** `Promise<WebGPUContext>`

**Throws:**
- `Error` - WebGPU not supported
- `Error` - Failed to get GPU adapter
- `Error` - Failed to get GPU device
- `Error` - Failed to create canvas context

**Example:**
```typescript
try {
  const ctx = await initWebGPU(canvas);
  console.log('WebGPU initialized:', ctx.adapter.info);
} catch (err) {
  console.error('WebGPU initialization failed:', err.message);
}
```

```typescript
function setupCanvas(canvas: HTMLCanvasElement): void
```
Configures canvas for fullscreen HiDPI rendering.

```typescript
function reconfigureContext(ctx: WebGPUContext): void
```
Reconfigures context after canvas resize.

---

### Buffer Management

#### `src/core/buffers.ts`

Manages GPU buffer creation and particle data initialization.

```typescript
function initializeParticles(
  canvasSize: Vec2,
  particleCount?: number
): Float32Array
```
Creates initial particle data with random positions and velocities.

**Returns:** `Float32Array` with 4 floats per particle (x, y, vx, vy)

```typescript
function createParticleBuffer(
  device: GPUDevice,
  initialData: Float32Array
): GPUBuffer
```
Creates GPU storage buffer for particle data.

**Usage flags:** `STORAGE | VERTEX | COPY_DST`

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer
```
Creates uniform buffer for global parameters.

**Usage flags:** `UNIFORM | COPY_DST`

```typescript
function updateUniformBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  deltaTime?: number
): void
```
Updates uniform buffer with current frame data.

```typescript
function createBuffers(
  device: GPUDevice,
  canvasSize: Vec2,
  particleCount?: number
): ParticleBuffers
```
Convenience function to create all buffers at once.

**Example:**
```typescript
const buffers = createBuffers(device, { x: 1920, y: 1080 }, 10000);
console.log(`Created ${buffers.particleCount} particles`);
```

---

### Physics

#### `src/core/physics.ts`

CPU reference implementation matching WGSL compute shader logic.

```typescript
function applyGravity(
  velocity: Vec2,
  gravity?: Vec2,
  deltaTime?: number
): Vec2
```
Applies gravity to velocity vector.

**Formula:** `velocity + gravity * deltaTime`

```typescript
function calculateRepulsion(
  position: Vec2,
  mousePos: Vec2,
  radius?: number,
  repulsionStrength?: number,
  deltaTime?: number
): Vec2
```
Calculates mouse repulsion force.

**Algorithm:**
1. Calculate distance to mouse
2. If distance < radius: apply inverse-distance force
3. Return force vector × deltaTime

```typescript
function clampVelocity(velocity: Vec2, maxSpeed?: number): Vec2
```
Clamps velocity magnitude to max speed.

```typescript
function applyBoundaryBounce(
  position: Vec2,
  velocity: Vec2,
  canvasSize: Vec2,
  damping?: number
): { position: Vec2; velocity: Vec2 }
```
Handles boundary collision with damping.

```typescript
function updateParticle(
  particle: Particle,
  canvasSize: Vec2,
  mousePos: Vec2,
  deltaTime?: number,
  gravity?: Vec2
): Particle
```
Full particle update (gravity → repulsion → clamp → move → bounce).

---

### Color Mapping

#### `src/core/color.ts`

CPU reference for velocity-based color mapping.

```typescript
function velocityToColor(velocity: Vec2): Color
```
Converts velocity to RGB color.

**Algorithm:**
1. Calculate speed magnitude
2. Normalize to [0, 1] using `COLOR_MAX_SPEED`
3. Lerp between CYAN (slow) and PURPLE (fast)
4. Apply brightness: `0.5 + 0.5 * factor`

```typescript
function getSpeedFactor(velocity: Vec2): number
```
Returns normalized speed [0, 1].

**Example:**
```typescript
const color = velocityToColor({ x: 400, y: 300 });
// Returns interpolated color based on speed ≈ 500 px/s
```

---

### Input Handling

#### `src/core/input.ts`

Mouse and touch input with HiDPI coordinate mapping.

```typescript
interface MouseState {
  x: number;
  y: number;
  isOnCanvas: boolean;
}

function createMouseHandler(canvas: HTMLCanvasElement): {
  getMousePosition: () => Vec2;
  destroy: () => void;
}
```
Creates input handler with automatic cleanup.

**Features:**
- Mouse and touch event support
- HiDPI coordinate mapping
- Returns `(-1000, -1000)` when off-canvas

**Example:**
```typescript
const mouse = createMouseHandler(canvas);

// In frame loop
const pos = mouse.getMousePosition();

// Cleanup
mouse.destroy();
```

---

### Pipeline Creation

#### `src/core/pipelines.ts`

Creates all WebGPU pipelines and bind groups.

```typescript
function createComputePipeline(device: GPUDevice): {
  pipeline: GPUComputePipeline;
  bindGroupLayout: GPUBindGroupLayout;
}
```
Creates particle physics compute pipeline.

```typescript
function createRenderPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): { pipeline: GPURenderPipeline; bindGroupLayout: GPUBindGroupLayout }
```
Creates particle rendering pipeline.

```typescript
function createTrailPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline
```
Creates trail fade pipeline.

```typescript
function createPresentPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): GPURenderPipeline
```
Creates final composite pipeline.

```typescript
function createPipelines(
  device: GPUDevice,
  format: GPUTextureFormat,
  buffers: ParticleBuffers
): Pipelines
```
Creates all pipelines with bind groups configured.

---

### Renderer

#### `src/core/renderer.ts`

Manages the main render loop and frame composition.

```typescript
class Renderer {
  constructor(
    ctx: WebGPUContext,
    pipelines: Pipelines,
    buffers: ParticleBuffers,
    getMousePosition: () => Vec2,
    onFrame?: () => void
  );
  
  start(): void;
  stop(): void;
  destroy(): void;
}
```

**Render Pipeline (per frame):**

| Order | Pass | Shader | Description |
|-------|------|--------|-------------|
| 1 | Compute | `compute.wgsl` | Update particle physics |
| 2 | Trail | `trail.wgsl` | Fade trail texture |
| 3 | Render | `render.wgsl` | Draw particles to texture |
| 4 | Present | `present.wgsl` | Composite to screen |

```typescript
function createRenderer(
  ctx: WebGPUContext,
  pipelines: Pipelines,
  buffers: ParticleBuffers,
  getMousePosition: () => Vec2,
  onFrame?: () => void
): Renderer
```
Factory function for creating Renderer instances.

**Example:**
```typescript
const renderer = createRenderer(
  ctx, 
  pipelines, 
  buffers, 
  mouse.getMousePosition,
  () => console.log('Frame rendered')
);
renderer.start();

// Later
renderer.stop();
renderer.destroy();
```

---

### Quality Heuristics

#### `src/core/quality.ts`

Runtime particle count adjustment based on device capabilities.

```typescript
function resolveSimulationSettings(
  input: SimulationHeuristicsInput,
  preferredParticleCount?: number
): RuntimeSimulationSettings
```
Determines optimal simulation settings for the device.

**Heuristics:**

| Factor | Threshold | Scale Limit |
|--------|-----------|-------------|
| Fallback adapter | Any | 40% |
| Device memory | ≤ 2 GB | 45% |
| Device memory | ≤ 4 GB | 65% |
| CPU cores | ≤ 2 | 45% |
| CPU cores | ≤ 4 | 70% |
| Viewport | 4K+ | 65% |
| Viewport | QHD | 85% |

```typescript
function readRuntimeHeuristics(
  adapter: GPUAdapter,
  device: GPUDevice
): SimulationHeuristicsInput
```
Reads device capabilities for quality determination.

**Example:**
```typescript
const heuristics = readRuntimeHeuristics(adapter, device);
const settings = resolveSimulationSettings(heuristics, 10000);
console.log(`Quality: ${settings.qualityTier}, Particles: ${settings.particleCount}`);
```

---

## Shader Constants

Constants injected into WGSL at runtime:

### Compute Shader
```wgsl
const GRAVITY: vec2f = vec2f(0.0, 600.0);
const REPULSION_RADIUS: f32 = 200.0;
const REPULSION_STRENGTH: f32 = 3000.0;
const DAMPING: f32 = 0.9;
const MAX_SPEED: f32 = 800.0;
```

### Render Shader
```wgsl
const CYAN: vec3f = vec3f(0.0, 1.0, 1.0);
const PURPLE: vec3f = vec3f(0.9, 0.3, 1.0);
const MAX_SPEED: f32 = 800.0;
```

### Trail Shader
```wgsl
const TRAIL_FADE_ALPHA: f32 = 0.05;
```

---

## Data Layouts

### Particle Buffer (Storage)

Each particle: **16 bytes**

| Offset | Size | Field | Type | Description |
|--------|------|-------|------|-------------|
| 0 | 4 bytes | x | f32 | X position |
| 4 | 4 bytes | y | f32 | Y position |
| 8 | 4 bytes | vx | f32 | X velocity |
| 12 | 4 bytes | vy | f32 | Y velocity |

### Uniform Buffer

Total size: **32 bytes**

| Offset | Size | Field | Type | Description |
|--------|------|-------|------|-------------|
| 0 | 4 | width | f32 | Canvas width |
| 4 | 4 | height | f32 | Canvas height |
| 8 | 4 | mouseX | f32 | Mouse X |
| 12 | 4 | mouseY | f32 | Mouse Y |
| 16 | 4 | deltaTime | f32 | Frame time |
| 20 | 4 | _pad1 | f32 | Padding |
| 24 | 4 | _pad2 | f32 | Padding |
| 28 | 4 | _pad3 | f32 | Padding |

---

## Glossary

| Term | Definition |
|------|------------|
| **WGSL** | WebGPU Shading Language |
| **Workgroup** | Group of GPU threads (64 in this project) |
| **Dispatch** | Launching compute shader workgroups |
| **Bind Group** | Resource binding for shaders |
| **Pipeline** | Pre-configured GPU execution state |
| **Framebuffer** | GPU memory for rendered pixels |
| **Offscreen Texture** | Non-displayed render target |
| **Compute Shader** | GPU program for general computation |
| **Fragment Shader** | GPU program for pixel coloring |

---

## See Also

- [Performance Guide](PERFORMANCE.md) - Optimization and benchmarking
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues
- [Main README](../../README.md) - Project overview

---

*Documentation Version: 2.0.0 | API Version: 2.0.0 | Last Updated: 2026-04-16*
