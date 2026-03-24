# WebGPU Particle Fluid Simulation

English | [简体中文](README.zh-CN.md)

A high-performance particle fluid simulation built with WebGPU compute shaders. Physics, color mapping, trails, and presentation are coordinated by TypeScript and WGSL, with adaptive particle counts that scale from lower-end devices up to the default 10,000-particle experience.

[![CI](https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml)
[![Pages](https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml/badge.svg)](https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![WebGPU](https://img.shields.io/badge/WebGPU-Enabled-005A9C?logo=webgpu&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

## Features

- **GPU simulation** - gravity, repulsion, clamping, and bounce all run in a WebGPU compute shader
- **Adaptive quality** - particle count scales to device capability and viewport size at startup
- **Frame-rate independent physics** - simulation uses `deltaTime` consistently across CPU tests and GPU execution
- **Persistent trails** - motion trails render through an offscreen texture and a final present pass
- **HiDPI-aware canvas** - rendering and input both account for `devicePixelRatio`
- **Property-based tests** - Vitest + fast-check cover core simulation invariants

## Requirements

- Node.js 18+
- A browser with WebGPU support (Chrome 113+, Edge 113+, Safari 17+)

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173 in a WebGPU-enabled browser
```

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start development server            |
| `npm run build`         | TypeScript check + production build |
| `npm run preview`       | Preview production build            |
| `npm test`              | Run tests once                      |
| `npm run test:watch`    | Run tests in watch mode             |
| `npm run test:coverage` | Run tests with coverage report      |
| `npm run lint`          | Run ESLint                          |
| `npm run typecheck`     | Run TypeScript type checking        |

## Project Structure

```
src/
├── config/
│   └── sim.ts            # Shared simulation constants + WGSL preamble generation
├── core/
│   ├── buffers.ts        # GPU buffer creation and particle initialization
│   ├── color.ts          # CPU reference color mapping
│   ├── input.ts          # Mouse/touch input mapped to HiDPI canvas coordinates
│   ├── physics.ts        # CPU reference physics aligned with compute shader behavior
│   ├── pipelines.ts      # Compute/render/trail/present pipeline creation
│   ├── quality.ts        # Runtime particle-count heuristics
│   ├── renderer.ts       # Frame loop, offscreen trail buffer, final presentation
│   └── webgpu.ts         # WebGPU initialization and canvas setup
├── shaders/
│   ├── compute.wgsl      # Physics compute shader
│   ├── present.wgsl      # Final fullscreen composite pass
│   ├── render.wgsl       # Particle render shader
│   └── trail.wgsl        # Trail fade shader
├── main.ts               # Application entry point
├── style.css             # UI overlays + fullscreen canvas styles
└── types.ts              # Shared interfaces and re-exported constants
```

## Architecture

The app uses a heterogeneous pipeline:

- **CPU (TypeScript)**: initializes WebGPU, chooses runtime quality, updates uniforms, handles input, and drives the frame loop
- **GPU (WGSL)**: simulates particles, fades the trail target, renders points, and presents the accumulated frame to the canvas

### Render Flow

Each frame executes four GPU passes:

| Pass        | Shader                     | Purpose                                          |
| ----------- | -------------------------- | ------------------------------------------------ |
| **Compute** | `src/shaders/compute.wgsl` | Update particle positions and velocities         |
| **Trail**   | `src/shaders/trail.wgsl`   | Fade the persistent offscreen texture            |
| **Render**  | `src/shaders/render.wgsl`  | Draw particles into the offscreen texture        |
| **Present** | `src/shaders/present.wgsl` | Composite the offscreen texture to the swapchain |

The trail effect no longer depends on `loadOp: 'load'` against the swapchain texture. Instead, `src/core/renderer.ts` maintains a dedicated offscreen texture, which is more portable across browsers and GPUs.

## Configuration

Shared simulation constants live in `src/config/sim.ts`. That file is the single source of truth for:

- default particle count: `10,000`
- gravity: `600 px/s²`
- damping: `0.9`
- repulsion radius: `200 px`
- repulsion strength: `3,000 px/s`
- max speed: `800 px/s`
- default delta time: `1 / 60 s`
- trail fade alpha: `0.05`

`src/core/pipelines.ts` injects these values into WGSL shader preambles, so TypeScript, tests, and shaders stay aligned.

### Adaptive Quality

At startup, `src/core/quality.ts` chooses a runtime particle count based on:

- fallback adapter detection
- `navigator.deviceMemory` when available
- `navigator.hardwareConcurrency`
- viewport pixel count
- WebGPU storage buffer limits

Typical runtime range is **2,500 to 10,000 particles**. The active count and quality tier are shown in the on-screen overlay.

## Testing

The project uses Vitest and fast-check to verify:

- particle initialization bounds
- delta-time-aware physics integration
- boundary bounce behavior
- repulsion direction and falloff
- color interpolation behavior
- runtime quality heuristics

Run the full validation set with:

```bash
npm run lint
npm test
npm run build
```

## Browser Support

WebGPU is required. Check [caniuse.com/webgpu](https://caniuse.com/webgpu) for current browser support.

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 113+            |
| Edge    | 113+            |
| Firefox | Behind flag     |
| Safari  | 17+ (macOS 14+) |

## License

MIT - [Project Page](https://lessup.github.io/particle-fluid-sim/)
