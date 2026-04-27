# API Reference

> **规范契约**: 接口定义的权威来源是 [`openspec/specs/api/typescript-interfaces.md`](../openspec/specs/api/typescript-interfaces.md)。本文档提供详细的函数说明和使用示例。

This document provides detailed documentation for all public modules, functions, types, and constants in the WebGPU Particle Fluid Simulation project.

## Table of Contents

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

---

## Configuration

### `src/config/sim.ts`

Central configuration file containing all simulation constants. This is the single source of truth for simulation parameters.

#### Constants

| Constant                 | Type     | Default                  | Description                                     |
| ------------------------ | -------- | ------------------------ | ----------------------------------------------- |
| `PARTICLE_COUNT`         | `number` | `10000`                  | Default number of particles                     |
| `PARTICLE_SIZE`          | `number` | `16`                     | Size in bytes per particle (4 floats × 4 bytes) |
| `WORKGROUP_SIZE`         | `number` | `64`                     | WebGPU compute shader workgroup size            |
| `GRAVITY`                | `Vec2`   | `{x: 0, y: 600}`         | Gravity acceleration in px/s²                   |
| `DAMPING`                | `number` | `0.9`                    | Velocity damping on boundary bounce             |
| `REPULSION_RADIUS`       | `number` | `200`                    | Mouse repulsion radius in pixels                |
| `REPULSION_STRENGTH`     | `number` | `3000`                   | Mouse repulsion force magnitude                 |
| `MAX_SPEED`              | `number` | `800`                    | Maximum particle velocity in px/s               |
| `COLOR_MAX_SPEED`        | `number` | `800`                    | Maximum speed for color mapping                 |
| `DEFAULT_DELTA_TIME`     | `number` | `1/60`                   | Default frame time in seconds                   |
| `MAX_DELTA_TIME`         | `number` | `0.05`                   | Maximum delta time to prevent spiral of death   |
| `INITIAL_VELOCITY_RANGE` | `number` | `4`                      | Range for random initial velocities             |
| `OFFSCREEN_COORDINATE`   | `number` | `-1000`                  | Coordinate value when mouse is off-canvas       |
| `TRAIL_FADE_ALPHA`       | `number` | `0.05`                   | Alpha value for trail fade effect               |
| `UNIFORM_BUFFER_SIZE`    | `number` | `32`                     | Size of uniform buffer in bytes                 |
| `CYAN`                   | `Color`  | `{r: 0, g: 1, b: 1}`     | Cyan color for slow particles                   |
| `PURPLE`                 | `Color`  | `{r: 0.9, g: 0.3, b: 1}` | Purple color for fast particles                 |

#### Functions

```typescript
function buildComputeShaderPreamble(): string;
```

Builds WGSL constant declarations for the compute shader.

**Returns:** WGSL code string with constants for GRAVITY, REPULSION_RADIUS, REPULSION_STRENGTH, DAMPING, and MAX_SPEED.

```typescript
function buildRenderShaderPreamble(): string;
```

Builds WGSL constant declarations for the render shader.

**Returns:** WGSL code string with constants for CYAN, PURPLE, and MAX_SPEED.

```typescript
function buildTrailShaderPreamble(): string;
```

Builds WGSL constant declarations for the trail shader.

**Returns:** WGSL code string with constant for TRAIL_FADE_ALPHA.

---

## Types

### `src/types.ts`

Type definitions and re-exports for the simulation.

#### Interfaces

```typescript
interface Particle {
  x: number; // Position X in pixels
  y: number; // Position Y in pixels
  vx: number; // Velocity X in px/s
  vy: number; // Velocity Y in px/s
}
```

Represents a single particle with position and velocity.

```typescript
interface Vec2 {
  x: number;
  y: number;
}
```

Generic 2D vector type.

```typescript
interface Color {
  r: number; // Red (0-1)
  g: number; // Green (0-1)
  b: number; // Blue (0-1)
}
```

RGB color type with components in 0-1 range.

```typescript
interface Uniforms {
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  deltaTime: number;
  _pad1: number; // Padding for 16-byte alignment
  _pad2: number;
  _pad3: number;
}
```

Uniform data structure matching WGSL Uniforms struct layout.

```typescript
interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
  canvas: HTMLCanvasElement;
}
```

WebGPU context after initialization.

```typescript
interface ParticleBuffers {
  particleBuffer: GPUBuffer;
  uniformBuffer: GPUBuffer;
  particleCount: number;
}
```

Collection of GPU buffers for particle simulation.

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

Collection of WebGPU pipelines and bind groups.

---

## Core Modules

### WebGPU Initialization

#### `src/core/webgpu.ts`

Handles WebGPU initialization and canvas configuration.

```typescript
function showError(message: string): void;
```

Displays an error message overlay to the user.

**Parameters:**

- `message` - Error message to display

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext>;
```

Initializes WebGPU and returns the context.

**Parameters:**

- `canvas` - HTML canvas element to use

**Returns:** Promise resolving to WebGPUContext

**Throws:**

- Error if WebGPU is not supported
- Error if GPU adapter cannot be obtained
- Error if GPU device cannot be obtained
- Error if WebGPU canvas context cannot be created

```typescript
function setupCanvas(canvas: HTMLCanvasElement): void;
```

Configures canvas for fullscreen display with HiDPI support.

**Parameters:**

- `canvas` - HTML canvas element to configure

```typescript
function reconfigureContext(ctx: WebGPUContext): void;
```

Reconfigures the WebGPU context after resize.

**Parameters:**

- `ctx` - WebGPU context to reconfigure

---

### Buffer Management

#### `src/core/buffers.ts`

Manages GPU buffer creation and particle initialization.

```typescript
function initializeParticles(canvasSize: Vec2, particleCount?: number): Float32Array;
```

Creates initial particle data with random positions and velocities.

**Parameters:**

- `canvasSize` - Canvas dimensions
- `particleCount` - Number of particles (default: `PARTICLE_COUNT`)

**Returns:** Float32Array with particle data (4 floats per particle)

```typescript
function createParticleBuffer(device: GPUDevice, initialData: Float32Array): GPUBuffer;
```

Creates a GPU storage buffer for particle data.

**Parameters:**

- `device` - GPU device
- `initialData` - Initial particle data

**Returns:** GPUBuffer configured for storage, vertex, and copy destination usage

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer;
```

Creates a GPU uniform buffer for global parameters.

**Parameters:**

- `device` - GPU device

**Returns:** GPUBuffer configured for uniform and copy destination usage

```typescript
function updateUniformBuffer(
  device: GPUDevice,
  buffer: GPUBuffer,
  width: number,
  height: number,
  mouseX: number,
  mouseY: number,
  deltaTime?: number
): void;
```

Updates the uniform buffer with current values.

**Parameters:**

- `device` - GPU device
- `buffer` - Uniform buffer to update
- `width` - Canvas width
- `height` - Canvas height
- `mouseX` - Mouse X position
- `mouseY` - Mouse Y position
- `deltaTime` - Frame delta time (default: `DEFAULT_DELTA_TIME`)

```typescript
function createBuffers(
  device: GPUDevice,
  canvasSize: Vec2,
  particleCount?: number
): ParticleBuffers;
```

Creates all buffers needed for the particle system.

**Parameters:**

- `device` - GPU device
- `canvasSize` - Canvas dimensions
- `particleCount` - Number of particles (default: `PARTICLE_COUNT`)

**Returns:** ParticleBuffers object with all buffers initialized

```typescript
function validateParticleData(
  data: Float32Array,
  canvasSize: Vec2,
  particleCount?: number
): boolean;
```

Validates that all particles are within canvas bounds.

**Parameters:**

- `data` - Particle data array
- `canvasSize` - Canvas dimensions
- `particleCount` - Number of particles (default: `data.length / 4`)

**Returns:** `true` if all particles are in bounds, `false` otherwise

---

### Physics

#### `src/core/physics.ts`

CPU reference implementation of physics calculations. Mirrors the WGSL compute shader logic exactly.

```typescript
function applyGravity(velocity: Vec2, gravity?: Vec2, deltaTime?: number): Vec2;
```

Applies gravity acceleration to velocity.

**Parameters:**

- `velocity` - Current velocity
- `gravity` - Gravity vector (default: `GRAVITY`)
- `deltaTime` - Frame time (default: `DEFAULT_DELTA_TIME`)

**Returns:** Updated velocity vector

```typescript
function calculateRepulsion(
  position: Vec2,
  mousePos: Vec2,
  radius?: number,
  repulsionStrength?: number,
  deltaTime?: number
): Vec2;
```

Calculates repulsion force from mouse position.

**Parameters:**

- `position` - Particle position
- `mousePos` - Mouse cursor position
- `radius` - Repulsion radius (default: `REPULSION_RADIUS`)
- `repulsionStrength` - Force magnitude (default: `REPULSION_STRENGTH`)
- `deltaTime` - Frame time (default: `DEFAULT_DELTA_TIME`)

**Returns:** Force vector to add to velocity

**Note:** Returns zero vector if distance >= radius or distance === 0.

```typescript
function clampVelocity(velocity: Vec2, maxSpeed?: number): Vec2;
```

Clamps velocity magnitude to maximum speed.

**Parameters:**

- `velocity` - Velocity vector to clamp
- `maxSpeed` - Maximum speed (default: `MAX_SPEED`)

**Returns:** Clamped velocity vector

```typescript
function applyBoundaryBounce(
  position: Vec2,
  velocity: Vec2,
  canvasSize: Vec2,
  damping?: number
): { position: Vec2; velocity: Vec2 };
```

Applies boundary collision and bounce.

**Parameters:**

- `position` - Current position
- `velocity` - Current velocity
- `canvasSize` - Canvas dimensions
- `damping` - Velocity damping on bounce (default: `DAMPING`)

**Returns:** Object with updated position and velocity

```typescript
function updateParticle(
  particle: Particle,
  canvasSize: Vec2,
  mousePos: Vec2,
  deltaTime?: number,
  gravity?: Vec2
): Particle;
```

Updates a single particle for one frame.

**Parameters:**

- `particle` - Particle to update
- `canvasSize` - Canvas dimensions
- `mousePos` - Mouse cursor position
- `deltaTime` - Frame time (default: `DEFAULT_DELTA_TIME`)
- `gravity` - Gravity vector (default: `GRAVITY`)

**Returns:** Updated particle

**Algorithm:**

1. Apply gravity to velocity
2. Calculate and apply mouse repulsion
3. Clamp velocity to max speed
4. Update position
5. Apply boundary bounce

---

### Color Mapping

#### `src/core/color.ts`

CPU reference implementation of color mapping. Mirrors the WGSL fragment shader logic.

```typescript
function clamp(value: number, min: number, max: number): number;
```

Clamps a value between min and max.

```typescript
function lerp(a: number, b: number, t: number): number;
```

Linear interpolation between two values.

```typescript
function mixColors(a: Color, b: Color, t: number): Color;
```

Linear interpolation between two colors.

```typescript
function velocityMagnitude(velocity: Vec2): number;
```

Calculates the magnitude of a velocity vector.

```typescript
function velocityToColor(velocity: Vec2): Color;
```

Converts velocity to color based on speed.

**Parameters:**

- `velocity` - Velocity vector

**Returns:** Color with brightness applied

**Algorithm:**

1. Calculate speed magnitude
2. Normalize to 0-1 range using `COLOR_MAX_SPEED`
3. Interpolate between CYAN (slow) and PURPLE (fast)
4. Apply brightness scaling (0.5 to 1.0 based on speed)

```typescript
function getSpeedFactor(velocity: Vec2): number;
```

Gets normalized speed factor (0-1) from velocity.

---

### Input Handling

#### `src/core/input.ts`

Handles mouse and touch input with HiDPI coordinate mapping.

```typescript
interface MouseState {
  x: number;
  y: number;
  isOnCanvas: boolean;
}
```

```typescript
function createMouseHandler(canvas: HTMLCanvasElement): {
  getMousePosition: () => Vec2;
  destroy: () => void;
};
```

Creates a mouse/touch input handler.

**Parameters:**

- `canvas` - HTML canvas element to monitor

**Returns:** Object with:

- `getMousePosition()` - Returns current mouse position in canvas coordinates
- `destroy()` - Removes all event listeners

**Features:**

- Handles both mouse and touch events
- Maps coordinates to canvas pixels accounting for HiDPI
- Returns `OFFSCREEN_COORDINATE` when cursor leaves canvas

---

### Pipeline Creation

#### `src/core/pipelines.ts`

Creates WebGPU pipelines for compute, render, trail, and present passes.

```typescript
function createComputePipeline(device: GPUDevice): {
  pipeline: GPUComputePipeline;
  bindGroupLayout: GPUBindGroupLayout;
};
```

Creates the compute pipeline for particle physics.

**Parameters:**

- `device` - GPU device

**Returns:** Object with pipeline and bind group layout

```typescript
function createRenderPipeline(
  device: GPUDevice,
  format: GPUTextureFormat
): { pipeline: GPURenderPipeline; bindGroupLayout: GPUBindGroupLayout };
```

Creates the render pipeline for particle drawing.

**Parameters:**

- `device` - GPU device
- `format` - Texture format

**Returns:** Object with pipeline and bind group layout

```typescript
function createTrailPipeline(device: GPUDevice, format: GPUTextureFormat): GPURenderPipeline;
```

Creates the trail pipeline for fade effect.

**Parameters:**

- `device` - GPU device
- `format` - Texture format

**Returns:** Render pipeline for trail effect

```typescript
function createPresentPipeline(device: GPUDevice, format: GPUTextureFormat): GPURenderPipeline;
```

Creates the present pipeline for compositing.

**Parameters:**

- `device` - GPU device
- `format` - Texture format

**Returns:** Render pipeline for presenting to canvas

```typescript
function createPipelines(
  device: GPUDevice,
  format: GPUTextureFormat,
  buffers: ParticleBuffers
): Pipelines;
```

Creates all pipelines and bind groups.

**Parameters:**

- `device` - GPU device
- `format` - Texture format
- `buffers` - Particle buffers for bind groups

**Returns:** Complete Pipelines object

---

### Renderer

#### `src/core/renderer.ts`

Manages the render loop and frame composition.

```typescript
class Renderer
```

**Constructor:**

```typescript
constructor(
  ctx: WebGPUContext,
  pipelines: Pipelines,
  buffers: ParticleBuffers,
  getMousePosition: () => Vec2,
  onFrame?: () => void
)
```

**Methods:**

```typescript
start(): void
```

Starts the render loop.

```typescript
stop(): void
```

Stops the render loop.

```typescript
destroy(): void
```

Destroys renderer and releases GPU resources.

**Render Pipeline (per frame):**

1. Update uniforms with current canvas size, mouse position, and delta time
2. Compute pass: Update particle physics
3. Trail pass: Fade the persistent offscreen texture
4. Render pass: Draw particles to offscreen texture
5. Present pass: Composite offscreen texture to canvas

```typescript
function createRenderer(
  ctx: WebGPUContext,
  pipelines: Pipelines,
  buffers: ParticleBuffers,
  getMousePosition: () => Vec2,
  onFrame?: () => void
): Renderer;
```

Factory function to create a Renderer instance.

---

### Quality Heuristics

#### `src/core/quality.ts`

Runtime particle count adjustment based on device capabilities.

```typescript
type SimulationQualityTier = 'low' | 'medium' | 'high';
```

```typescript
interface RuntimeSimulationSettings {
  particleCount: number;
  qualityTier: SimulationQualityTier;
  scale: number;
}
```

```typescript
interface SimulationHeuristicsInput {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  isFallbackAdapter: boolean;
  maxStorageBufferBindingSize: number;
  viewportPixels: number;
}
```

```typescript
function resolveSimulationSettings(
  input: SimulationHeuristicsInput,
  preferredParticleCount?: number
): RuntimeSimulationSettings;
```

Determines runtime particle count based on device capabilities.

**Parameters:**

- `input` - Device capability metrics
- `preferredParticleCount` - Target particle count (default: `PARTICLE_COUNT`)

**Returns:** Runtime settings with adjusted particle count

**Heuristics:**

- Fallback adapter: max 40% scale
- Device memory ≤ 2GB: max 45% scale
- Device memory ≤ 4GB: max 65% scale
- CPU cores ≤ 2: max 45% scale
- CPU cores ≤ 4: max 70% scale
- 4K viewport: max 65% scale
- QHD viewport: max 85% scale

```typescript
function readRuntimeHeuristics(adapter: GPUAdapter, device: GPUDevice): SimulationHeuristicsInput;
```

Reads runtime device capabilities.

**Parameters:**

- `adapter` - GPU adapter
- `device` - GPU device

**Returns:** Heuristics input for `resolveSimulationSettings`

---

## Shader Constants

The following constants are injected into WGSL shaders at build time via preamble functions:

### Compute Shader Constants

```wgsl
const GRAVITY: vec2f;
const REPULSION_RADIUS: f32;
const REPULSION_STRENGTH: f32;
const DAMPING: f32;
const MAX_SPEED: f32;
```

### Render Shader Constants

```wgsl
const CYAN: vec3f;
const PURPLE: vec3f;
const MAX_SPEED: f32;
```

### Trail Shader Constants

```wgsl
const TRAIL_FADE_ALPHA: f32;
```

---

## Data Layouts

### Particle Buffer

Each particle occupies 16 bytes (4 × float32):

| Offset | Size | Field | Type |
| ------ | ---- | ----- | ---- |
| 0      | 4    | x     | f32  |
| 4      | 4    | y     | f32  |
| 8      | 4    | vx    | f32  |
| 12     | 4    | vy    | f32  |

### Uniform Buffer

Total size: 32 bytes (8 × float32)

| Offset | Size | Field     | Type |
| ------ | ---- | --------- | ---- |
| 0      | 4    | width     | f32  |
| 4      | 4    | height    | f32  |
| 8      | 4    | mouseX    | f32  |
| 12     | 4    | mouseY    | f32  |
| 16     | 4    | deltaTime | f32  |
| 20     | 4    | \_pad1    | f32  |
| 24     | 4    | \_pad2    | f32  |
| 28     | 4    | \_pad3    | f32  |
