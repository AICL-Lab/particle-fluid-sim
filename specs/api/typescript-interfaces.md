# API Specification: WebGPU Particle Fluid Simulation

> **Status:** Stable
> **Version:** 2.0.0
> **Last Updated:** 2026-04-17

## Overview

This document defines the public API interfaces for the WebGPU Particle Fluid Simulation project. Since this is a client-side WebGPU application, the "API" refers to the TypeScript interfaces and configuration constants exposed to consumers.

---

## Configuration API

### Simulation Constants

Located in `src/config/sim.ts`:

```typescript
interface SimulationConfig {
  // Particle settings
  PARTICLE_COUNT: number;        // Default: 10,000
  MIN_PARTICLE_COUNT: number;    // Default: 2,500
  MAX_PARTICLE_COUNT: number;    // Default: 10,000

  // Physics constants
  GRAVITY: { x: number; y: number };  // Default: { x: 0, y: 600 } px/s²
  MAX_SPEED: number;                  // Default: 800 px/s
  DAMPING: number;                    // Default: 0.9

  // Interaction
  REPULSION_RADIUS: number;      // Default: 200 px
  REPULSION_STRENGTH: number;    // Default: 3000

  // Rendering
  TRAIL_FADE_ALPHA: number;      // Default: 0.05
  POINT_SIZE: number;            // Default: 2.0
}
```

### Quality Heuristics Input

```typescript
interface QualityHeuristicsInput {
  hardwareConcurrency?: number;      // CPU cores
  deviceMemory?: number;             // Device RAM in GB
  isFallbackAdapter: boolean;        // Software rendering?
  maxStorageBufferBindingSize: number;
  viewportPixels: number;            // Width × Height × DPR²
}

interface QualityHeuristicsOutput {
  particleCount: number;             // Computed particle count
  qualityTier: 'low' | 'medium' | 'high';
}
```

---

## Core Module Interfaces

### WebGPU Initialization

```typescript
interface WebGPUContext {
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext>;
```

### Particle Data

```typescript
interface Particle {
  x: number;    // Position X (pixels)
  y: number;    // Position Y (pixels)
  vx: number;   // Velocity X (pixels/second)
  vy: number;   // Velocity Y (pixels/second)
}

interface UniformData {
  width: number;     // Canvas width (pixels)
  height: number;    // Canvas height (pixels)
  mouseX: number;    // Mouse X (pixels)
  mouseY: number;    // Mouse Y (pixels)
  deltaTime: number; // Frame delta (seconds)
}
```

### Buffer Management

```typescript
interface BufferManager {
  particleBuffer: GPUBuffer;
  uniformBuffer: GPUBuffer;
  trailTexture: GPUTexture;
  trailTextureView: GPUTextureView;
}

function createBuffers(
  device: GPUDevice,
  particleCount: number,
  width: number,
  height: number
): BufferManager;

function initializeParticles(
  buffer: GPUBuffer,
  device: GPUDevice,
  particleCount: number,
  width: number,
  height: number
): void;

function updateUniformBuffer(
  buffer: GPUBuffer,
  device: GPUDevice,
  data: UniformData
): void;
```

### Physics Functions

```typescript
interface PhysicsState {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface PhysicsInput extends PhysicsState {
  canvasSize: { width: number; height: number };
  mousePosition: { x: number; y: number };
  deltaTime: number;
}

function updateParticle(input: PhysicsInput): PhysicsState;
function applyGravity(velocity: { x: number; y: number }, dt: number): { x: number; y: number };
function applyRepulsion(
  position: { x: number; y: number },
  velocity: { x: number; y: number },
  mouse: { x: number; y: number },
  dt: number
): { x: number; y: number };
function clampVelocity(velocity: { x: number; y: number }): { x: number; y: number };
function bounce(position: number, velocity: number, min: number, max: number): { position: number; velocity: number };
```

### Color Mapping

```typescript
type RGB = { r: number; g: number; b: number };

function velocityToColor(velocity: { x: number; y: number }): RGB;
function lerpColor(a: RGB, b: RGB, t: number): RGB;
```

### Input Handling

```typescript
interface InputState {
  x: number;  // Mouse X in canvas coordinates
  y: number;  // Mouse Y in canvas coordinates
  active: boolean;  // Mouse/touch down?
}

function setupInput(canvas: HTMLCanvasElement): InputState;
```

### Renderer

```typescript
interface RendererOptions {
  canvas: HTMLCanvasElement;
  particleCount: number;
}

interface Renderer {
  start(): void;
  stop(): void;
  setParticleCount(count: number): void;
}

function createRenderer(options: RendererOptions): Promise<Renderer>;
```

---

## Shader Interface

All shaders are defined in `src/shaders/` as WGSL files.

### Compute Shader (`compute.wgsl`)

```wgsl
// Input: particle buffer, uniform buffer
// Output: updated particle buffer

struct Particle {
  x: f32;
  y: f32;
  vx: f32;
  vy: f32;
}

struct Uniforms {
  width: f32;
  height: f32;
  mouseX: f32;
  mouseY: f32;
  deltaTime: f32;
  _pad1: f32;
  _pad2: f32;
  _pad3: f32;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3u);
```

### Render Shader (`render.wgsl`)

```wgsl
// Input: particle buffer, uniform buffer
// Output: colored point primitives to offscreen texture

@vertex fn vertexMain(vertexIndex: u32) -> VertexOutput;
@fragment fn fragmentMain(speed: f32) -> vec4f;
```

### Trail Shader (`trail.wgsl`)

```wgsl
// Input: current trail texture
// Output: faded trail texture

@fragment fn fragmentMain() -> vec4f;
```

### Present Shader (`present.wgsl`)

```wgsl
// Input: offscreen texture
// Output: swap chain canvas

@fragment fn fragmentMain(uv: vec2f) -> vec4f;
```

---

## Error Handling

### Error Types

```typescript
type WebGPUError =
  | { type: 'NOT_SUPPORTED'; message: string }
  | { type: 'ADAPTER_UNAVAILABLE'; message: string }
  | { type: 'DEVICE_UNAVAILABLE'; message: string }
  | { type: 'CONTEXT_FAILED'; message: string };
```

### Error Display

```typescript
function displayError(error: WebGPUError): void;
```

---

## Events

The renderer emits the following events:

| Event | Data | Description |
|-------|------|-------------|
| `fps` | `number` | Current FPS |
| `quality` | `QualityTier` | Quality tier change |
| `error` | `WebGPUError` | Initialization or runtime error |

---

## Versioning

This API follows [Semantic Versioning](https://semver.org/):

- **Major**: Breaking changes to interfaces
- **Minor**: New features, backward compatible
- **Patch**: Bug fixes, backward compatible

Current version: **2.0.0**
