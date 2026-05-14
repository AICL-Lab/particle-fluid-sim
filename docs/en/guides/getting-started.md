# Getting Started

Get the simulation running in under a minute.

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in a WebGPU-enabled browser.

## Requirements

### Node.js

- **Version:** 18.0.0 or higher
- **Download:** [nodejs.org](https://nodejs.org/)

### Browser Support

| Browser | Version | Status            |
| ------- | ------- | ----------------- |
| Chrome  | 113+    | ✅ Recommended    |
| Edge    | 113+    | ✅ Recommended    |
| Safari  | 17+     | ✅ macOS 14+      |
| Firefox | Nightly | ⚠️ Enable flag    |
| Opera   | 99+     | ✅ Chromium-based |

> **Firefox Users:** Enable WebGPU by setting `dom.webgpu.enabled = true` in `about:config`

## Controls

| Action             | Effect                              |
| ------------------ | ----------------------------------- |
| **Move Mouse**     | Push particles away from cursor     |
| **Touch (Mobile)** | Same as mouse interaction           |
| **Resize Window**  | Automatically adjusts HiDPI scaling |

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
particle-fluid-sim/
├── src/
│   ├── config/         # Simulation constants
│   ├── core/           # Core modules
│   │   ├── webgpu.ts   # WebGPU initialization
│   │   ├── buffers.ts  # GPU buffer management
│   │   ├── physics.ts  # CPU physics reference
│   │   ├── color.ts    # Color mapping
│   │   ├── quality.ts  # Adaptive quality
│   │   ├── pipelines.ts# GPU pipeline creation
│   │   └── renderer.ts # Render loop
│   └── shaders/        # WGSL shaders
├── docs/               # Documentation
├── openspec/           # Specifications
└── .github/            # CI/CD workflows
```

## Next Steps

- [Environment Setup](/en/guides/setup) - Detailed configuration
- [Testing Guide](/en/guides/testing) - How to test the codebase
- [Architecture](/en/whitepaper/architecture) - System design
