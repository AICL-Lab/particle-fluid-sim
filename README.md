# WebGPU Particle Fluid Simulation

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
  <a href="https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml">
    <img src="https://github.com/LessUp/particle-fluid-sim/actions/workflows/ci.yml/badge.svg" alt="CI">
  </a>
  <a href="https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml">
    <img src="https://github.com/LessUp/particle-fluid-sim/actions/workflows/pages.yml/badge.svg" alt="Pages">
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

A high-performance particle fluid simulation built with **WebGPU compute shaders**. This project demonstrates modern GPU-accelerated physics with frame-rate independent simulation, adaptive quality scaling, and persistent motion trails.

🔮 **[Live Demo](https://lessup.github.io/particle-fluid-sim/)** | 📖 **[Documentation](docs/)** | 📋 **[Specs](specs/)** | 🐛 **[Issue Tracker](https://github.com/LessUp/particle-fluid-sim/issues)**

## ✨ Features

### GPU-Accelerated Physics
- **Compute Shader Physics** - Gravity, repulsion, clamping, and boundary bounce run entirely on GPU
- **Frame-Rate Independent** - Physics uses `deltaTime` for consistent simulation speed at any FPS
- **10,000 Particles** - Default count, adaptive scaling from 2,500 based on device capability

### Adaptive Quality System
- **Automatic Device Detection** - Analyzes GPU, CPU, memory, and viewport
- **Runtime Scaling** - Adjusts particle count from 2,500 to 10,000
- **Quality Tiers** - Low, Medium, High with HUD display

### Visual Effects
- **Persistent Trails** - Motion trails via dedicated offscreen texture
- **Velocity-Based Colors** - Cyan (slow) to Purple (fast) gradient
- **HiDPI Aware** - Proper scaling for retina displays

### Technical Excellence
- **TypeScript** - Full type safety
- **Property-Based Tests** - Vitest + fast-check for robust validation
- **WebGPU Best Practices** - Workgroup optimization, buffer reuse

## 🚀 Quick Start

### Requirements

- **Node.js**: 18+
- **Browser**: Chrome 113+, Edge 113+, or Safari 17+

### Installation

```bash
# Clone the repository
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in a WebGPU-enabled browser
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

## 📁 Project Structure

```
particle-fluid-sim/
├── specs/                # Specification documents (Source of Truth)
│   ├── product/          # Product requirements (PRD)
│   ├── rfc/              # Technical design documents
│   ├── api/              # API specifications
│   ├── db/               # Database schema (N/A for this project)
│   └── testing/          # BDD test specifications
├── docs/                 # Documentation
│   ├── setup/            # Environment setup guides
│   ├── tutorials/        # User tutorials
│   ├── architecture/     # Architecture overview
│   ├── assets/           # Static assets (images, diagrams)
│   ├── API.md            # API reference
│   ├── PERFORMANCE.md    # Performance guide
│   └── TROUBLESHOOTING.md# Troubleshooting guide
├── src/                  # Source code
│   ├── config/           # Simulation constants
│   ├── core/             # Core modules
│   └── shaders/          # WGSL shaders
├── .github/              # GitHub configuration
├── AGENTS.md             # AI Agent SDD workflow
├── CONTRIBUTING.md       # Contribution guide
├── CHANGELOG.md          # Version history
└── LICENSE               # MIT License
```

## 🏗️ Architecture

### Heterogeneous Computing

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| **CPU (TypeScript)** | TypeScript | Initialization, quality selection, input handling, frame loop |
| **GPU (WGSL)** | WebGPU Shading Language | Physics simulation, trail effects, rendering |

### Render Pipeline

Each frame executes four GPU passes in sequence:

| Pass | Shader | Input | Output | Purpose |
|------|--------|-------|--------|---------|
| **1. Compute** | `compute.wgsl` | Particle buffer | Particle buffer | Update physics |
| **2. Trail** | `trail.wgsl` | Offscreen texture | Offscreen texture | Fade trails |
| **3. Render** | `render.wgsl` | Particle buffer | Offscreen texture | Draw particles |
| **4. Present** | `present.wgsl` | Offscreen texture | Swap chain | Composite to screen |

### Physics Model

```
Each frame per particle:
  1. Apply gravity: velocity += gravity * dt
  2. Apply mouse repulsion: if distance < radius
  3. Clamp velocity to MAX_SPEED
  4. Update position: position += velocity * dt
  5. Boundary bounce with damping if out of bounds
```

## ⚙️ Configuration

Key constants in `src/config/sim.ts`:

| Constant | Default | Unit | Description |
|----------|---------|------|-------------|
| `PARTICLE_COUNT` | 10,000 | - | Default particle count |
| `GRAVITY` | {x: 0, y: 600} | px/s² | Gravity acceleration |
| `MAX_SPEED` | 800 | px/s | Velocity ceiling |
| `REPULSION_RADIUS` | 200 | px | Mouse influence radius |
| `REPULSION_STRENGTH` | 3000 | px/s | Mouse repulsion force |
| `DAMPING` | 0.9 | - | Bounce energy retention |
| `TRAIL_FADE_ALPHA` | 0.05 | - | Trail persistence |

## 🧪 Testing

The project uses **Vitest** with **fast-check** for property-based testing:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in UI mode
npm run test:ui
```

Test coverage includes:
- Particle initialization bounds
- Physics integration correctness
- Boundary bounce behavior
- Color interpolation
- Quality heuristic calculations

## 🌐 Browser Support

WebGPU is required. Check [caniuse.com/webgpu](https://caniuse.com/webgpu) for latest support.

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | 113+ | ✅ Recommended |
| Edge | 113+ | ✅ Recommended |
| Safari | 17+ | macOS 14+ |
| Firefox | Nightly | Behind `dom.webgpu.enabled` flag |
| Opera | 99+ | Chromium-based |

## 📚 Documentation

### Specifications (Source of Truth)

| Document | Description |
|----------|-------------|
| [📋 Product Requirements](specs/product/webgpu-particle-fluid-sim.md) | Functional & non-functional requirements |
| [📐 RFC 0001: Core Architecture](specs/rfc/0001-core-architecture.md) | System architecture & design decisions |
| [📝 RFC 0002: Implementation Tasks](specs/rfc/0002-implementation-tasks.md) | Implementation task tracking |
| [🔌 API Specification](specs/api/typescript-interfaces.md) | TypeScript interfaces and contracts |
| [🧪 Testing Specification](specs/testing/bdd-specifications.md) | BDD test specifications |

### Developer & User Guides

| Document | Description |
|----------|-------------|
| [📖 API Reference](docs/API.md) | Complete API documentation |
| [⚡ Performance Guide](docs/PERFORMANCE.md) | Benchmarks and optimization |
| [🔧 Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues and solutions |
| [🛠️ Maintenance Guide](docs/maintenance.md) | Version release and maintenance |
| [🏗️ Architecture Overview](docs/architecture/README.md) | System architecture |
| [📚 Tutorials](docs/tutorials/README.md) | User and developer tutorials |

Additional resources:
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [AGENTS.md](AGENTS.md) - Spec-Driven Development workflow for AI agents
- [Changelog](CHANGELOG.md) - Version history
- [Security Policy](.github/SECURITY.md) - Security guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the [Spec-Driven Development](AGENTS.md) workflow
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [WebGPU](https://www.w3.org/TR/webgpu/) - The graphics API that makes this possible
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [Vitest](https://vitest.dev/) - Blazing fast unit testing
- [fast-check](https://dubzzz.github.io/fast-check/) - Property-based testing

## 🔗 Links

- 🌐 **Live Demo**: https://lessup.github.io/particle-fluid-sim/
- 💻 **Repository**: https://github.com/LessUp/particle-fluid-sim
- 🐛 **Issue Tracker**: https://github.com/LessUp/particle-fluid-sim/issues
- 💬 **Discussions**: https://github.com/LessUp/particle-fluid-sim/discussions

---

<p align="center">
  Made with 💜 and WebGPU
</p>

<p align="center">
  <sub>Version 2.0.0 | Last Updated: 2026-04-17</sub>
</p>
