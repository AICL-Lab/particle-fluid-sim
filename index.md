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

A WebGPU particle fluid simulation with shared TypeScript/WGSL constants, adaptive runtime quality, persistent trail rendering, and property-based tests.

## Highlights

- GPU physics via WebGPU compute shaders
- Adaptive particle counts from 2,500 up to the default 10,000
- Delta-time-based simulation aligned across runtime code and tests
- Offscreen trail texture plus final present pass
- HiDPI-aware canvas sizing and pointer mapping

## Render Pipeline

| Pass    | Shader                     | Purpose                                       |
| ------- | -------------------------- | --------------------------------------------- |
| Compute | `src/shaders/compute.wgsl` | Update particle positions and velocities      |
| Trail   | `src/shaders/trail.wgsl`   | Fade the persistent offscreen texture         |
| Render  | `src/shaders/render.wgsl`  | Draw particles into the offscreen texture     |
| Present | `src/shaders/present.wgsl` | Composite the offscreen texture to the canvas |

## Shared Configuration

`src/config/sim.ts` is the single source of truth for simulation constants such as particle count, gravity, damping, repulsion, max speed, and trail fade alpha. `src/core/pipelines.ts` injects these values into WGSL shader preambles to keep tests, host code, and shaders aligned.

## Adaptive Quality

`src/core/quality.ts` selects a runtime particle count using:

- fallback adapter detection
- `navigator.deviceMemory` when available
- `navigator.hardwareConcurrency`
- viewport pixel count
- WebGPU storage buffer limits

The chosen particle count and quality tier are shown in the on-screen HUD.

## Validation

```bash
npm run lint
npm test
npm run build
```

[View on GitHub](https://github.com/LessUp/particle-fluid-sim) · [README](README.md) · [简体中文](README.zh-CN.md)
