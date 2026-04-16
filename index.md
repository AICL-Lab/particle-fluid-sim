---
layout: default
title: Particle Fluid Simulation
---

# WebGPU Particle Fluid Simulation

[![CI](https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml/badge.svg)](https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml)
[![Pages](https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml/badge.svg)](https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![WebGPU](https://img.shields.io/badge/WebGPU-Enabled-005A9C?logo=webgpu&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)

A high-performance GPU-accelerated particle simulation using WebGPU compute shaders. Features adaptive quality scaling, persistent motion trails, and property-based testing.

---

## Live Demo

**[Open Demo →](https://lessup.github.io/particle-fluid-sim/)**

Move your mouse to interact with particles. They are repelled by the cursor with an inverse-distance force.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **GPU Physics** | Gravity, repulsion, bounce computed in parallel via compute shaders |
| **Adaptive Quality** | 2,500–10,000 particles based on device capabilities |
| **Frame-Rate Independent** | Consistent simulation using deltaTime |
| **Motion Trails** | Persistent trails via offscreen texture |
| **HiDPI Support** | Proper handling of high-DPI displays |
| **Well Tested** | Property-based tests with fast-check |

---

## Quick Start

```bash
# Clone and run
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a WebGPU-enabled browser.

---

## Render Pipeline

Each frame executes four GPU passes:

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Compute   │ →  │    Trail    │ →  │   Render    │ →  │   Present   │
│    Pass     │    │    Pass     │    │    Pass     │    │    Pass     │
├─────────────┤    ├─────────────┤    ├─────────────┤    ├─────────────┤
│ • Gravity   │    │ • Fade      │    │ • Draw      │    │ • Composite │
│ • Repulsion │    │   offscreen │    │   particles │    │   to canvas │
│ • Bounce    │    │   texture   │    │   to texture│    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Configuration

All constants in `src/config/sim.ts`:

| Parameter | Value |
|-----------|-------|
| Particles | 10,000 |
| Gravity | 600 px/s² |
| Repulsion Radius | 200 px |
| Max Speed | 800 px/s |
| Trail Fade | 0.05 |

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 113+ |
| Edge | 113+ |
| Safari | 17+ |
| Firefox | Flag required |

WebGPU is required. Check [caniuse.com/webgpu](https://caniuse.com/webgpu) for details.

---

## Documentation

- [README.md](README.md) — Full documentation (English)
- [README.zh-CN.md](README.zh-CN.md) — 中文文档
- [API Reference](docs/API.md) — API documentation
- [Performance Benchmarks](docs/PERFORMANCE.md) — Performance data and optimization tips
- [Troubleshooting](docs/TROUBLESHOOTING.md) — Common issues and solutions
- [Contributing](CONTRIBUTING.md) — Contribution guidelines

---

## Links

[View on GitHub](https://github.com/LessUp/particle-fluid-sim) · [Report an Issue](https://github.com/LessUp/particle-fluid-sim/issues)
