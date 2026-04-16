# Changelog

All notable changes to this project are documented in this file.

> **Languages**: [English](#changelog) | [中文摘要](#变更日志摘要)

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Comprehensive bilingual documentation system
  - Restructured docs/ with English and Chinese versions
  - Added professional API reference documentation
  - Added performance optimization guide
  - Added troubleshooting guide with diagnostic tools
  - All documentation available in both English and 简体中文

### Changed

- Professionalized documentation structure and formatting
- Standardized changelog archive organization

[Unreleased]: https://github.com/LessUp/particle-fluid-sim/compare/v2.0.0...HEAD

---

## [2.0.0] - 2026-03-09

### 🎯 Release Highlights

Major release introducing **frame-rate independent physics**, critical bug fixes, and comprehensive CI/CD infrastructure. This release ensures consistent simulation speed across all devices regardless of refresh rate.

[2.0.0]: https://github.com/LessUp/particle-fluid-sim/compare/v1.0.0...v2.0.0

### ✨ New Features

#### Physics Engine

- **Frame-rate Independent Simulation** (`deltaTime` support)
  - Uniform buffer expanded from 16 to 32 bytes
  - Physics calculations now scale by actual frame time
  - Maximum delta time clamped to 50ms to prevent instability
  - Gravity constant rescaled: `0.1` → `600 px/s²`
  - Repulsion strength rescaled: `50` → `3000 px/s`

- **Velocity Clamping**
  - Added `MAX_SPEED = 800 px/s` to prevent velocity explosion
  - Applied in both compute shader and CPU reference

#### Mobile Support

- **Touch Scroll Prevention**
  - Added `event.preventDefault()` for touch events
  - Uses `{ passive: false }` for proper Chrome support
  - smoother mobile interaction

#### Infrastructure

- **GitHub Actions CI/CD**
  - Automated lint, typecheck, test, and build
  - Runs on every push and pull request
  - Node.js 24 for latest features

- **GitHub Pages Deployment**
  - Jekyll-based documentation site
  - Automated deployment on documentation changes
  - SEO optimized with sitemap

- **Development Tools**
  - `VITE_BASE_PATH` environment variable for flexible deployment
  - Enhanced ESLint configuration
  - Comprehensive test coverage with Vitest

### 🔧 Breaking Changes

#### Physics Constants Rescaled

| Constant | v1.0.0 | v2.0.0 | Unit | Impact |
|----------|--------|--------|------|--------|
| `GRAVITY.y` | `0.1` | `600` | px/s² | Simulation now frame-rate independent |
| `REPULSION_STRENGTH` | `50` | `3000` | px/s | Scaled for per-second physics |

**Migration:** If you customized these values, multiply by `60` (for 60 FPS baseline).

#### Uniform Buffer Layout

```wgsl
// v1.0.0 (16 bytes)
struct Uniforms {
  canvasSize: vec2f,
  mousePos: vec2f,
}

// v2.0.0 (32 bytes)
struct Uniforms {
  canvasSize: vec2f,
  mousePos: vec2f,
  deltaTime: f32,
  _pad1: f32,
  _pad2: f32,
  _pad3: f32,
}
```

### 🐛 Bug Fixes

| Issue | Severity | Description | Fix |
|-------|----------|-------------|-----|
| Memory leak | 🔴 Critical | `setupCanvas()` accumulated resize listeners | Moved event handling to caller |
| Duplicate handlers | 🔴 Critical | Both `setupCanvas()` and `main.ts` added listeners | Single handler in `main.ts` |
| Frame-rate dependency | 🔴 Critical | Physics speed varied with FPS | Added deltaTime scaling |
| Lockfile drift | 🟡 High | `package-lock.json` out of sync | Regenerated lockfile |
| ESLint error | 🟢 Medium | `prefer-const` violation | Fixed variable declaration |

### 📚 Documentation

- Comprehensive README (English and Chinese)
- API reference documentation
- Performance benchmarks guide
- Troubleshooting guide
- GitHub Pages landing page
- Security policy (`SECURITY.md`)
- Contributing guidelines (`CONTRIBUTING.md`)

### 📦 Dependencies

Updated to latest compatible versions:
- TypeScript: ~5.6.2
- Vite: ^6.0.1
- Vitest: ^2.1.8
- ESLint: ^9.0.0

---

## [1.0.0] - 2025-02-13

### 🎉 Initial Release

First public release of the WebGPU Particle Fluid Simulation.

[1.0.0]: https://github.com/LessUp/particle-fluid-sim/releases/tag/v1.0.0

### ✨ Features

#### Core Simulation

- **GPU-Accelerated Physics** via WebGPU compute shaders
  - Parallel computation with `workgroup_size(64)`
  - Configurable gravity and boundary bounce
  - Position and velocity updates on GPU

- **Mouse/Touch Interaction**
  - Inverse-distance repulsion force
  - HiDPI coordinate mapping
  - Configurable radius and strength

- **Visual Effects**
  - Persistent motion trails via offscreen texture
  - Velocity-based color mapping (cyan → purple)
  - Four-pass render pipeline

- **Adaptive Quality**
  - Runtime particle scaling (2,500–10,000)
  - Device capability detection
  - Viewport size consideration

#### Technical

- **HiDPI Support**
  - `devicePixelRatio`-aware canvas
  - Proper input coordinate mapping

- **Property-Based Testing**
  - Vitest + fast-check integration
  - 42 test cases covering core invariants

#### Project Setup

- MIT License
- `.editorconfig` for consistent formatting
- TypeScript strict mode
- ESLint + Prettier configuration
- Vite build system

---

## 变更日志摘要

### 版本历史

| 版本 | 日期 | 主要更新 |
|------|------|----------|
| **2.0.0** | 2026-03-09 | 帧率无关物理引擎、关键 Bug 修复、CI/CD 基础设施 |
| **1.0.0** | 2025-02-13 | 初始版本，WebGPU 计算着色器粒子仿真 |

### 2.0.0 关键变更

#### 破坏性变更 ⚠️

- **物理常量重新标定**
  - 重力: `0.1` → `600 px/s²`
  - 排斥力度: `50` → `3000 px/s`
  - 原因: 支持帧率无关的物理计算

- **Uniform Buffer 扩展**
  - 大小: 16 字节 → 32 字节
  - 新增: `deltaTime` 字段
  - 新增: 填充字节用于对齐

#### 新功能 ✨

- 帧率无关的物理仿真
- 速度限制防止溢出
- 触摸事件优化（防止页面滚动）
- GitHub Actions CI/CD
- GitHub Pages 自动部署

#### 修复的 Bug 🐛

- 修复内存泄漏（resize 监听器累积）
- 修复重复的 resize 处理器
- 修复帧率依赖问题
- 修复锁文件同步问题

### 文档更新 📚

- 添加中英文双语文档
- 完整的 API 参考
- 性能优化指南
- 故障排除指南

---

## Migration Guides

### Upgrading from 1.0.0 to 2.0.0

#### 1. Update Custom Physics Constants

```typescript
// Before (v1.0.0)
export const GRAVITY = { x: 0.0, y: 0.1 };
export const REPULSION_STRENGTH = 50;

// After (v2.0.0)
export const GRAVITY = { x: 0.0, y: 600.0 };
export const REPULSION_STRENGTH = 3000.0;
```

#### 2. Update Custom Shaders

Add `deltaTime` to your Uniforms struct:

```wgsl
struct Uniforms {
  canvasSize: vec2f,
  mousePos: vec2f,
  deltaTime: f32,    // NEW
  _pad1: f32,        // NEW
  _pad2: f32,        // NEW
  _pad3: f32,        // NEW
}
```

#### 3. Update Physics Calculations

```wgsl
// Before (v1.0.0)
p.velocity += gravity;
p.position += p.velocity;

// After (v2.0.0)
p.velocity += gravity * uniforms.deltaTime;
p.position += p.velocity * uniforms.deltaTime;
```

---

## Version History Summary

| Version | Date | Key Changes |
|---------|------|-------------|
| 2.0.0 | 2026-03-09 | Frame-rate independent physics, deltaTime, velocity clamping, CI/CD |
| 1.0.0 | 2025-02-13 | Initial release, WebGPU compute shaders, adaptive quality |

---

## Contributors

Thanks to all contributors who have helped improve this project!

See [GitHub Contributors](https://github.com/LessUp/particle-fluid-sim/graphs/contributors) for the full list.

---

*Changelog Version: 2.0.0 | Last Updated: 2026-04-16*
