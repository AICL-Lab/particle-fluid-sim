# WebGPU Particle Fluid Simulation

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
  <a href="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/ci.yml">
    <img src="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/pages.yml">
    <img src="https://github.com/AICL-Lab/particle-fluid-sim/actions/workflows/pages.yml/badge.svg" alt="Pages">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/WebGPU-Enabled-005A9C?logo=webgpu&logoColor=white" alt="WebGPU">
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite">
</p>

<p align="center">
  <b>English</b> | <a href="README.zh-CN.md">简体中文</a>
</p>

---

<p align="center">
  <b>🔮 <a href="https://aicl-lab.github.io/particle-fluid-sim/demo/">Live Demo</a></b> · 
  <b>📖 <a href="https://aicl-lab.github.io/particle-fluid-sim/docs/">Documentation</a></b> · 
  <b>📋 <a href="openspec/specs/product/webgpu-particle-fluid-sim.md">Specifications</a></b>
</p>

---

A high-performance particle fluid simulation built with **WebGPU compute shaders**. Watch 10,000 particles interact with realistic physics, all running on your GPU.

> **💡 Try it:** Open the [Live Demo](https://aicl-lab.github.io/particle-fluid-sim/demo/) and move your mouse over the simulation to push particles around!

## ✨ Highlights

<table>
<tr>
<td>
<h3>⚡ GPU-Accelerated Physics</h3>
All physics calculations run on the GPU via WebGPU compute shaders. Gravity, repulsion, velocity clamping, and boundary bounce happen in parallel for 10,000 particles.
</td>
<td>
<h3>📊 Frame-Rate Independent</h3>
Physics uses delta time calculations, so the simulation runs at the same speed whether you're getting 30 FPS or 144 FPS.
</td>
</tr>
<tr>
<td>
<h3>🎯 Adaptive Quality</h3>
Automatically detects your device capabilities and adjusts particle count from 2,500 to 10,000 for optimal performance.
</td>
<td>
<h3>🎨 Persistent Trails</h3>
Beautiful motion trails via dedicated offscreen texture with velocity-based color mapping (cyan for slow, purple for fast).
</td>
</tr>
</table>

## 🚀 Quick Start

Get the simulation running in under a minute:

```bash
# 1. Clone the repository
git clone https://github.com/AICL-Lab/particle-fluid-sim.git
cd particle-fluid-sim

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Then open **http://localhost:5173** in a WebGPU-enabled browser.

### Requirements

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Browser**: Chrome 113+, Edge 113+, or Safari 17+ ([Check WebGPU Support](https://caniuse.com/webgpu))

## 🎮 Controls

| Action             | Effect                              |
| ------------------ | ----------------------------------- |
| **Move Mouse**     | Push particles away from cursor     |
| **Touch (Mobile)** | Same as mouse interaction           |
| **Resize Window**  | Automatically adjusts HiDPI scaling |

## 📁 Project Structure

Built with [OpenSpec](https://github.com/Fission-AI/OpenSpec) for specification-driven development:

```
particle-fluid-sim/
├── openspec/               # 📋 OpenSpec framework
│   ├── specs/              # Specifications (Single Source of Truth)
│   │   ├── product/        # Product requirements & acceptance criteria
│   │   ├── rfc/            # Technical architecture decisions
│   │   ├── api/            # API contracts & type definitions
│   │   └── testing/        # BDD test specifications
│   ├── changes/            # Active change proposals
│   └── config.yaml         # OpenSpec configuration
├── docs/                   # 📖 Developer & user documentation
│   ├── API.md              # Complete API reference
│   ├── PERFORMANCE.md      # Optimization guide
│   ├── TROUBLESHOOTING.md  # Common issues & solutions
│   ├── architecture/       # System architecture
│   ├── setup/              # Environment and toolchain setup
│   └── maintenance.md      # Closeout workflow and maintenance guide
├── src/                    # 💻 Source code
│   ├── config/             # Simulation constants & configuration
│   ├── core/               # Core modules (WebGPU, physics, rendering)
│   └── shaders/            # WGSL compute & render shaders
├── scripts/                # 🔧 Build & release automation
└── .github/                # 🤖 CI/CD workflows & templates
```

## 🏗️ Architecture

### CPU-GPU Heterogeneous Computing

```
┌─────────────────────────────────────────────────────┐
│  CPU (TypeScript)                                    │
│  • WebGPU initialization                            │
│  • Quality detection & scaling                      │
│  • Input handling (mouse/touch)                     │
│  • Frame loop orchestration                         │
└───────────────────┬─────────────────────────────────┘
                    │ writeBuffer / commandEncoder
                    ▼
┌─────────────────────────────────────────────────────┐
│  GPU (WGSL Shaders)                                  │
│                                                       │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  1.Compute  │─▶│ 2.Trail  │─▶│ 3. Render    │    │
│  │  Physics    │  │ Effects  │  │  Particles   │    │
│  └─────────────┘  └──────────┘  └──────┬───────┘    │
│                                         │            │
│                                         ▼            │
│                                ┌──────────────┐     │
│                                │ 4. Present   │     │
│                                │ To Screen    │     │
│                                └──────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Physics Pipeline

Each particle updates every frame with these steps:

1. **Apply Gravity** → `velocity += gravity * deltaTime`
2. **Mouse Repulsion** → Push away if within radius
3. **Clamp Velocity** → Limit to `MAX_SPEED`
4. **Update Position** → `position += velocity * deltaTime`
5. **Boundary Bounce** → Elastic collision with damping

### Performance Characteristics

| Metric            | Value          | Notes                          |
| ----------------- | -------------- | ------------------------------ |
| Particles         | 2,500 - 10,000 | Adaptive based on device       |
| Particle Size     | 16 bytes       | 4 × float32 (x, y, vx, vy)     |
| Compute Workgroup | 64 threads     | Optimized for GPU architecture |
| Frame Budget      | < 16ms         | Targets 60 FPS                 |

## ⚙️ Configuration

All constants in `src/config/sim.ts`:

| Parameter            | Default          | Description                             |
| -------------------- | ---------------- | --------------------------------------- |
| `PARTICLE_COUNT`     | 10,000           | Base particle count (scaled by quality) |
| `GRAVITY`            | `{x: 0, y: 600}` | Gravity acceleration (px/s²)            |
| `MAX_SPEED`          | 800              | Velocity ceiling (px/s)                 |
| `REPULSION_RADIUS`   | 200              | Mouse influence radius (px)             |
| `REPULSION_STRENGTH` | 3,000            | Mouse repulsion force (px/s)            |
| `DAMPING`            | 0.9              | Bounce energy retention (90%)           |
| `TRAIL_FADE_ALPHA`   | 0.05             | Trail persistence per frame             |

## 🧪 Testing

Property-based testing with **Vitest** + **fast-check**:

```bash
# Run all tests
npm test

# Watch mode (TDD)
npm run test:watch

# With coverage report
npm run test:coverage
```

### Test Coverage

- ✅ Particle initialization bounds
- ✅ Physics integration correctness
- ✅ Boundary bounce behavior
- ✅ Color interpolation accuracy
- ✅ Quality heuristic calculations
- ✅ HiDPI coordinate mapping

## 🛠️ Development

### Available Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `npm run dev`       | Start development server with HMR   |
| `npm run build`     | TypeScript check + production build |
| `npm run preview`   | Preview production build locally    |
| `npm run lint`      | Run ESLint                          |
| `npm run typecheck` | Run TypeScript type checking        |
| `npm run format`    | Format code with Prettier           |

### Contributing

We welcome contributions! Here's how to get started:

1. **Read** [AGENTS.md](AGENTS.md) for Spec-Driven Development workflow
2. **Follow** the [Contributing Guide](CONTRIBUTING.md)
3. **Update** specs before implementing features
4. **Test** your changes with `npm test`
5. **Submit** a Pull Request

Quick start for contributors:

```bash
# 1. Fork and clone
git clone https://github.com/AICL-Lab/particle-fluid-sim.git
cd particle-fluid-sim

# 2. Install dependencies
npm install

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make changes and run tests
npm test

# 5. Commit and push
git commit -m "feat: add your feature"
git push origin feature/your-feature-name

# 6. Open a Pull Request
```

## 📚 Documentation

### Specifications (Source of Truth)

| Document                                                                             | Description                              |
| ------------------------------------------------------------------------------------ | ---------------------------------------- |
| [📋 Product Requirements](openspec/specs/product/webgpu-particle-fluid-sim.md)       | Functional & non-functional requirements |
| [📐 RFC 0001: Core Architecture](openspec/specs/rfc/0001-core-architecture.md)       | System architecture & design decisions   |
| [📝 RFC 0002: Implementation Tasks](openspec/specs/rfc/0002-implementation-tasks.md) | Implementation task tracking             |
| [🧪 Testing Specification](openspec/specs/testing/bdd-specifications.md)             | BDD test specifications                  |

### Guides & Tutorials

| Document                                       | Description                                       |
| ---------------------------------------------- | ------------------------------------------------- |
| [📖 API Reference](docs/API.md)                | Complete API documentation                        |
| [⚡ Performance Guide](docs/PERFORMANCE.md)    | Benchmarks and optimization                       |
| [🔧 Troubleshooting](docs/TROUBLESHOOTING.md)  | Common issues and solutions                       |
| [📚 Docs Index](docs/README.md)                | Curated map of the durable documentation set      |
| [🏗️ Architecture](docs/architecture/README.md) | System architecture overview                      |
| [🚀 Setup Guide](docs/setup/README.md)         | Environment setup, LSP, and local tooling         |
| [🛠️ Workflow Guide](docs/maintenance.md)       | OpenSpec-first closeout workflow and review gates |

### Additional Resources

- [Contributing Guide](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Maintenance Guide](docs/maintenance.md)
- [Security Policy](.github/SECURITY.md)

## 🌐 Browser Support

WebGPU is required. [Check compatibility](https://caniuse.com/webgpu):

| Browser | Version | Status            |
| ------- | ------- | ----------------- |
| Chrome  | 113+    | ✅ Recommended    |
| Edge    | 113+    | ✅ Recommended    |
| Safari  | 17+     | ✅ macOS 14+      |
| Firefox | Nightly | ⚠️ Enable flag    |
| Opera   | 99+     | ✅ Chromium-based |

> **Firefox Users:** Enable WebGPU by setting `dom.webgpu.enabled = true` in `about:config`

## 🙏 Acknowledgments

Built with modern web technologies:

- [WebGPU](https://www.w3.org/TR/webgpu/) - Next-generation graphics API
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Lightning-fast build tool
- [Vitest](https://vitest.dev/) - Blazing fast testing framework
- [fast-check](https://dubzzz.github.io/fast-check/) - Property-based testing

## 📄 License

MIT License © 2026 [AICL-Lab](https://github.com/AICL-Lab)

See [LICENSE](LICENSE) for details.

## 🔗 Links

<p align="center">
  <a href="https://aicl-lab.github.io/particle-fluid-sim/demo/">🔮 Live Demo</a> ·
  <a href="https://github.com/AICL-Lab/particle-fluid-sim">💻 Repository</a> ·
  <a href="https://github.com/AICL-Lab/particle-fluid-sim/issues">🐛 Issues</a> ·
  <a href="https://github.com/AICL-Lab/particle-fluid-sim/discussions">💬 Discussions</a>
</p>

---

<p align="center">
  Made with 💜 and WebGPU
</p>
