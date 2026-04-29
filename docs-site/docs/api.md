---
sidebar_position: 2
---

# API Reference

TypeScript API documentation for the WebGPU Particle Fluid Simulation.

> **Specification Contract**: The authoritative source for interface definitions is [`openspec/specs/api/typescript-interfaces.md`](https://github.com/LessUp/particle-fluid-sim/blob/master/openspec/specs/api/typescript-interfaces.md).

## Configuration

### `src/config/sim.ts`

Central configuration file containing all simulation constants.

| Constant             | Type     | Default          | Description                          |
| -------------------- | -------- | ---------------- | ------------------------------------ |
| `PARTICLE_COUNT`     | `number` | `10000`          | Default number of particles          |
| `PARTICLE_SIZE`      | `number` | `16`             | Size in bytes per particle           |
| `WORKGROUP_SIZE`     | `number` | `64`             | WebGPU compute shader workgroup size |
| `GRAVITY`            | `Vec2`   | `{x: 0, y: 600}` | Gravity acceleration in px/s²        |
| `DAMPING`            | `number` | `0.9`            | Velocity damping on boundary bounce  |
| `REPULSION_RADIUS`   | `number` | `200`            | Mouse repulsion radius in pixels     |
| `REPULSION_STRENGTH` | `number` | `3000`           | Mouse repulsion force magnitude      |
| `MAX_SPEED`          | `number` | `800`            | Maximum particle velocity in px/s    |

### Shader Preamble Functions

```typescript
function buildComputeShaderPreamble(): string;
```

Builds WGSL constant declarations for the compute shader.

```typescript
function buildRenderShaderPreamble(): string;
```

Builds WGSL constant declarations for the render shader.

```typescript
function buildTrailShaderPreamble(): string;
```

Builds WGSL constant declarations for the trail shader.

## Types

### `src/types.ts`

```typescript
interface Particle {
  x: number; // Position X in pixels
  y: number; // Position Y in pixels
  vx: number; // Velocity X in px/s
  vy: number; // Velocity Y in px/s
}

interface Vec2 {
  x: number;
  y: number;
}

interface Color {
  r: number;
  g: number;
  b: number;
}
```

## Core Modules

### WebGPU Initialization (`src/core/webgpu.ts`)

```typescript
async function initWebGPU(canvas: HTMLCanvasElement): Promise<WebGPUContext | null>;
```

Initializes WebGPU device, context, and canvas configuration. Returns `null` if WebGPU is not supported.

### Buffer Management (`src/core/buffers.ts`)

```typescript
function createParticleBuffer(device: GPUDevice, count: number): GPUBuffer;
```

Creates a GPU buffer for particle data with initial random positions.

```typescript
function createUniformBuffer(device: GPUDevice): GPUBuffer;
```

Creates a uniform buffer for simulation parameters.

### Physics (`src/core/physics.ts`)

```typescript
function generateInitialParticles(count: number): Particle[];
```

Generates particles with random positions and velocities.

```typescript
function applyGravity(velocity: Vec2, gravity: Vec2, dt: number): Vec2;
```

Applies gravitational acceleration to velocity.

### Color Mapping (`src/core/color.ts`)

```typescript
function lerpColor(a: Color, b: Color, t: number): Color;
```

Linear interpolation between two colors.

```typescript
function velocityToColor(vx: number, vy: number, maxSpeed: number): Color;
```

Maps particle velocity to a color gradient (cyan → purple).

### Quality Heuristics (`src/core/quality.ts`)

```typescript
function detectQualityTier(): QualityTier;
```

Detects device performance tier for adaptive quality scaling.

```typescript
function getParticleCountForTier(tier: QualityTier): number;
```

Returns recommended particle count for the given quality tier.

## See Also

- [Architecture Overview](/docs/architecture) - System design and data flow
- [Performance Guide](/docs/performance) - Optimization strategies
- [Troubleshooting](/docs/troubleshooting) - Common issues and solutions
