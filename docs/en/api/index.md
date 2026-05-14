# API Reference

Complete API documentation for the WebGPU Particle Fluid Simulation.

## Configuration

All simulation constants are defined in `src/config/sim.ts`.

### Constants

| Constant             | Type     | Default          | Description                   |
| -------------------- | -------- | ---------------- | ----------------------------- |
| `PARTICLE_COUNT`     | `number` | `10000`          | Default number of particles   |
| `PARTICLE_SIZE`      | `number` | `16`             | Bytes per particle (4 floats) |
| `WORKGROUP_SIZE`     | `number` | `64`             | Compute shader workgroup size |
| `GRAVITY`            | `Vec2`   | `{x: 0, y: 600}` | Gravity acceleration (px/s²)  |
| `DAMPING`            | `number` | `0.9`            | Velocity damping on bounce    |
| `REPULSION_RADIUS`   | `number` | `200`            | Mouse influence radius (px)   |
| `REPULSION_STRENGTH` | `number` | `3000`           | Mouse repulsion force         |
| `MAX_SPEED`          | `number` | `800`            | Maximum velocity (px/s)       |
| `TRAIL_FADE_ALPHA`   | `number` | `0.05`           | Trail fade per frame          |

### Functions

```typescript
function buildComputeShaderPreamble(): string;
```

Builds WGSL constant declarations for the compute shader.

```typescript
function buildRenderShaderPreamble(): string;
```

Builds WGSL constant declarations for the render shader.

---

## Types

### Particle

```typescript
interface Particle {
  x: number; // Position X (pixels)
  y: number; // Position Y (pixels)
  vx: number; // Velocity X (px/s)
  vy: number; // Velocity Y (px/s)
}
```

### Vec2

```typescript
interface Vec2 {
  x: number;
  y: number;
}
```

### Color

```typescript
interface Color {
  r: number; // Red (0-1)
  g: number; // Green (0-1)
  b: number; // Blue (0-1)
}
```

### Uniforms

```typescript
interface Uniforms {
  width: number;
  height: number;
  mouseX: number;
  mouseY: number;
  deltaTime: number;
  _pad1: number;
  _pad2: number;
  _pad3: number;
}
```

### WebGPUContext

```typescript
interface WebGPUContext {
  adapter: GPUAdapter;
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
  canvas: HTMLCanvasElement;
}
```

---

## Core Modules

### WebGPU Initialization (`src/core/webgpu.ts`)

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext>;
```

Initializes WebGPU and returns the context. Throws on failure.

```typescript
function setupCanvas(canvas: HTMLCanvasElement): void;
```

Configures canvas for fullscreen display with HiDPI support.

---

### Buffer Management (`src/core/buffers.ts`)

```typescript
function initializeParticles(canvasSize: Vec2, particleCount?: number): Float32Array;
```

Creates initial particle data with random positions and velocities.

```typescript
function createParticleBuffer(device: GPUDevice, initialData: Float32Array): GPUBuffer;
```

Creates a GPU storage buffer for particle data.

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer;
```

Creates a GPU uniform buffer for global parameters.

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

---

### Physics (`src/core/physics.ts`)

CPU reference implementation of physics calculations.

```typescript
function applyGravity(velocity: Vec2, gravity?: Vec2, deltaTime?: number): Vec2;
```

Applies gravity acceleration to velocity.

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

```typescript
function clampVelocity(velocity: Vec2, maxSpeed?: number): Vec2;
```

Clamps velocity magnitude to maximum speed.

```typescript
function applyBoundaryBounce(
  position: Vec2,
  velocity: Vec2,
  canvasSize: Vec2,
  damping?: number
): { position: Vec2; velocity: Vec2 };
```

Applies boundary collision and bounce.

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

---

### Color Mapping (`src/core/color.ts`)

```typescript
function velocityToColor(velocity: Vec2): Color;
```

Converts velocity to color based on speed (cyan → purple).

```typescript
function getSpeedFactor(velocity: Vec2): number;
```

Gets normalized speed factor (0-1) from velocity.

---

### Quality Heuristics (`src/core/quality.ts`)

```typescript
type SimulationQualityTier = 'low' | 'medium' | 'high';

interface RuntimeSimulationSettings {
  particleCount: number;
  qualityTier: SimulationQualityTier;
  scale: number;
}

function resolveSimulationSettings(
  input: SimulationHeuristicsInput,
  preferredParticleCount?: number
): RuntimeSimulationSettings;
```

Determines runtime particle count based on device capabilities.

---

### Renderer (`src/core/renderer.ts`)

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

Manages the render loop and frame composition.

---

## Data Layouts

### Particle Buffer

| Offset | Size | Field | Type |
| ------ | ---- | ----- | ---- |
| 0      | 4    | x     | f32  |
| 4      | 4    | y     | f32  |
| 8      | 4    | vx    | f32  |
| 12     | 4    | vy    | f32  |

### Uniform Buffer

| Offset | Size | Field     | Type |
| ------ | ---- | --------- | ---- |
| 0      | 4    | width     | f32  |
| 4      | 4    | height    | f32  |
| 8      | 4    | mouseX    | f32  |
| 12     | 4    | mouseY    | f32  |
| 16     | 4    | deltaTime | f32  |
| 20-28  | 12   | \_pad     | f32  |
