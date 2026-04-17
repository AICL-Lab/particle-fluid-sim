# QWEN.md - WebGPU Particle Fluid Simulation

## Project Overview

**WebGPU Particle Fluid Simulation** is a high-performance particle physics simulation running entirely on the GPU using WebGPU compute shaders. The project simulates 10,000 particles with realistic physics including gravity, mouse repulsion, velocity clamping, and boundary bouncing, all rendered with beautiful motion trails and velocity-based color mapping.

### Key Features

- **GPU-Accelerated Physics**: All physics calculations run on the GPU via WebGPU compute shaders
- **Frame-Rate Independent**: Physics uses delta time for consistent simulation speed at any FPS
- **Adaptive Quality System**: Automatically detects device capabilities and scales particle count (2,500-10,000)
- **Persistent Motion Trails**: Offscreen texture accumulation with fade effect
- **Velocity-Based Colors**: Cyan (slow) to purple (fast) gradient mapping
- **HiDPI Support**: Proper scaling for retina displays
- **Interactive**: Mouse/touch interaction to push particles around

### Architecture

The project uses a heterogeneous CPU-GPU computing model:

- **CPU (TypeScript)**: WebGPU initialization, quality detection, input handling, frame loop orchestration
- **GPU (WGSL)**: 4-pass render pipeline (Compute → Trail → Render → Present)

Each frame executes:
1. **Compute Pass**: Parallel particle physics calculation (workgroup_size: 64)
2. **Trail Pass**: Fade persistent offscreen texture
3. **Render Pass**: Draw particles as colored points
4. **Present Pass**: Composite to swapchain canvas

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Language** | TypeScript 5.6 (ES2020) |
| **Graphics API** | WebGPU with WGSL shaders |
| **Build Tool** | Vite 6 |
| **Testing** | Vitest 4 + fast-check (property-based testing) |
| **Linting** | ESLint 9 + @typescript-eslint |
| **Formatting** | Prettier 3 |
| **Module System** | ES Modules (type: "module") |
| **Package Manager** | npm |

## Project Structure

```
particle-fluid-sim/
├── specs/                 # 📋 Specifications (Single Source of Truth)
│   ├── product/           # Product requirements & acceptance criteria
│   ├── rfc/               # Technical architecture decisions
│   ├── api/               # API contracts & type definitions
│   └── testing/           # BDD test specifications
├── docs/                  # 📖 Developer & user documentation
│   ├── API.md             # Complete API reference
│   ├── PERFORMANCE.md     # Optimization guide
│   ├── TROUBLESHOOTING.md # Common issues & solutions
│   ├── architecture/      # System architecture
│   ├── setup/            # Environment setup guides
│   └── tutorials/        # Step-by-step tutorials
├── src/                   # 💻 Source code
│   ├── config/           # Simulation constants & configuration
│   │   └── sim.ts        # All simulation constants
│   ├── core/             # Core modules
│   │   ├── webgpu.ts     # WebGPU device initialization
│   │   ├── buffers.ts    # GPU buffer management
│   │   ├── physics.ts    # CPU physics reference
│   │   ├── color.ts      # Color mapping utilities
│   │   ├── input.ts      # Mouse/touch input handling
│   │   ├── pipelines.ts  # WebGPU pipeline creation
│   │   ├── quality.ts    # Adaptive quality scaling
│   │   └── renderer.ts   # Render loop orchestration
│   ├── shaders/          # WGSL shaders
│   │   ├── compute.wgsl  # Physics compute shader
│   │   ├── trail.wgsl    # Trail fade effect
│   │   ├── render.wgsl   # Particle rendering
│   │   └── present.wgsl  # Screen compositing
│   └── test/             # Test utilities
├── scripts/              # 🔧 Build & release automation
│   └── build-docs.js     # Documentation site builder
├── .github/              # 🤖 CI/CD workflows
├── index.html            # Application entry point
├── main.ts               # TypeScript entry point
└── docs/site/            # Documentation website source
```

## Development Workflow

This project follows **Spec-Driven Development (SDD)** methodology. All code implementations must be based on specifications in `/specs/`.

### Key Principles

1. **Specs First**: Always review `/specs/` before writing code
2. **Spec-First Updates**: Update specs before implementing changes
3. **100% Spec Compliance**: Code must match spec definitions exactly
4. **No Gold-Plating**: Don't add features not defined in specs

### AI Agent Workflow

When implementing features or fixing bugs:

1. Review relevant specs in `/specs/`
2. If instructions conflict with specs, stop and ask for clarification
3. For new features, propose spec updates first
4. Implement code following specs exactly
5. Write tests covering spec acceptance criteria

See `AGENTS.md` for complete SDD workflow instructions.

## Commands

### Development

```bash
# Start development server with HMR (http://localhost:5173)
npm run dev

# Preview production build locally
npm run preview
```

### Building

```bash
# TypeScript check + production build
npm run build

# TypeScript type checking only
npm run typecheck

# Clean build artifacts
npm run clean
```

### Testing

```bash
# Run all tests
npm test

# Watch mode (TDD)
npm run test:watch

# With coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check
```

## Code Conventions

### TypeScript

- **Strict mode** enabled
- ES2020 target with ESNext modules
- No unused locals or parameters
- Bundler module resolution
- WebGPU types included (`@webgpu/types`)

### Testing

- Property-based testing with **fast-check**
- Minimum 100 runs per property
- Tests cover:
  - Particle initialization bounds
  - Physics integration correctness
  - Boundary bounce behavior
  - Color interpolation accuracy
  - Quality heuristic calculations
  - HiDPI coordinate mapping

### Naming

- Constants: `UPPER_SNAKE_CASE`
- Variables/Functions: `camelCase`
- Types/Interfaces: `PascalCase`
- Shader files: `*.wgsl`
- Test files: `*.test.ts` (co-located with source)

### Style

- Prettier for formatting
- ESLint for code quality
- JSDoc comments for public APIs
- Co-locate tests with source files

## Key Configuration

### Simulation Constants (`src/config/sim.ts`)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `PARTICLE_COUNT` | 10,000 | Base particle count |
| `GRAVITY` | `{x: 0, y: 600}` | Gravity acceleration (px/s²) |
| `MAX_SPEED` | 800 | Velocity ceiling (px/s) |
| `REPULSION_RADIUS` | 200 | Mouse influence radius (px) |
| `REPULSION_STRENGTH` | 3,000 | Mouse repulsion force (px/s) |
| `DAMPING` | 0.9 | Bounce energy retention |
| `TRAIL_FADE_ALPHA` | 0.05 | Trail persistence |

### Data Layouts

**Particle Buffer** (16 bytes per particle):
```
┌─────────┬─────────┬─────────┬─────────┐
│  x (f32)│  y (f32)│ vx (f32)│ vy (f32)│
└─────────┴─────────┴─────────┴─────────┘
```

**Uniform Buffer** (32 bytes):
```
┌──────────┬───────────┬───────────┬───────────┐
│ width    │  height   │  mouseX   │  mouseY   │
│ deltaTime│  _pad1    │  _pad2    │  _pad3    │
└──────────┴───────────┴───────────┴───────────┘
```

## Browser Requirements

WebGPU support required. Minimum browsers:
- Chrome 113+
- Edge 113+
- Safari 17+ (macOS 14+)
- Firefox Nightly (enable `dom.webgpu.enabled` flag)

Node.js 18+ for development.

## CI/CD

GitHub Actions workflows:

1. **CI** (`ci.yml`): Lint → TypeCheck → Test → Build
2. **Pages** (`pages.yml`): Build documentation site and deploy to GitHub Pages

## Important Files

| File | Purpose |
|------|---------|
| `specs/product/webgpu-particle-fluid-sim.md` | Product requirements (PRD) |
| `specs/rfc/0001-core-architecture.md` | Core architecture RFC |
| `src/config/sim.ts` | All simulation constants |
| `src/core/renderer.ts` | Main render loop |
| `src/core/webgpu.ts` | WebGPU initialization |
| `src/shaders/*.wgsl` | WGSL shader files |
| `docs/site/index.html` | Documentation landing page |
| `scripts/build-docs.js` | Docs build script |

## Quick Reference

### Adding a New Feature

1. Update specs in `/specs/`
2. Implement code following specs
3. Add tests covering acceptance criteria
4. Run `npm test && npm run lint && npm run typecheck`
5. Commit with descriptive message
6. Open PR

### Modifying Shaders

1. Update WGSL shader file
2. Update corresponding TypeScript constants if needed
3. Update CPU reference implementation in `src/core/physics.ts`
4. Add/update property tests
5. Test on multiple devices for performance

### Performance Guidelines

- Keep workgroup size at 64 (optimal for most GPUs)
- Minimize per-frame CPU allocation
- Use adaptive quality system for low-end devices
- Benchmark before merging performance-sensitive changes
- Target: 60 FPS, < 16ms frame time

## Links

- **Live Demo**: https://lessup.github.io/particle-fluid-sim/
- **Documentation**: https://lessup.github.io/particle-fluid-sim/docs/
- **Repository**: https://github.com/LessUp/particle-fluid-sim
