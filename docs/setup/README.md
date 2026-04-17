# Development Environment Setup

> **Version**: 2.0.0 | **Last Updated**: 2026-04-17

This guide covers setting up the development environment for the WebGPU Particle Fluid Simulation project.

---

## Prerequisites

### Required Software

| Software | Minimum Version | Recommended |
|----------|-----------------|-------------|
| Node.js | 18.x | 20.x LTS |
| npm | 9.x | 10.x |
| Git | 2.x | Latest |

### Browser Requirements

WebGPU is required for running the simulation:

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome | 113+ | ✅ Recommended |
| Edge | 113+ | ✅ Recommended |
| Safari | 17+ | macOS 14+ |
| Firefox | Nightly | Behind flag |

Check [caniuse.com/webgpu](https://caniuse.com/webgpu) for the latest support status.

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Development Tools

### IDE Recommendations

**VS Code** is recommended with the following extensions:

| Extension | Purpose |
|-----------|---------|
| [WGSL](https://marketplace.visualstudio.com/items?itemName=PolyMeilex.wgsl) | WGSL shader syntax highlighting |
| [TypeScript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) | TypeScript language support |
| [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | Linting |
| [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) | Code formatting |

### Project Configuration

The project includes pre-configured settings:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Available Scripts

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

---

## Project Structure

```
particle-fluid-sim/
├── src/
│   ├── config/           # Simulation constants
│   │   └── sim.ts
│   ├── core/             # Core modules
│   │   ├── buffers.ts    # GPU buffer management
│   │   ├── color.ts      # Color mapping
│   │   ├── input.ts      # Input handling
│   │   ├── physics.ts    # Physics calculations
│   │   ├── pipelines.ts  # WebGPU pipelines
│   │   ├── quality.ts    # Quality heuristics
│   │   ├── renderer.ts   # Render loop
│   │   └── webgpu.ts     # WebGPU initialization
│   ├── shaders/          # WGSL shaders
│   │   ├── compute.wgsl
│   │   ├── present.wgsl
│   │   ├── render.wgsl
│   │   └── trail.wgsl
│   ├── main.ts           # Entry point
│   ├── style.css         # Styles
│   ├── types.ts          # Type definitions
│   └── types.test.ts     # Type tests
├── specs/                # Specification documents
├── docs/                 # Documentation
└── .github/              # GitHub configuration
```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run src/core/physics.test.ts
```

### Test Coverage

The project uses property-based testing with fast-check:

| Module | Coverage Target |
|--------|-----------------|
| `config/sim.ts` | 90% |
| `core/buffers.ts` | 95% |
| `core/color.ts` | 95% |
| `core/physics.ts` | 98% |
| `core/quality.ts` | 90% |

---

## Troubleshooting

### WebGPU Not Available

If you see "WebGPU not supported":

1. Ensure you're using a supported browser (Chrome 113+, Edge 113+, Safari 17+)
2. Check if WebGPU is enabled in browser flags
3. Verify GPU drivers are up to date

### Node.js Version Issues

```bash
# Check Node.js version
node --version

# Use nvm to switch versions
nvm install 20
nvm use 20
```

### Dependency Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

- Read the [Architecture Overview](../architecture/README.md)
- Review the [API Reference](../API.md)
- Check the [Performance Guide](../PERFORMANCE.md)
- See [Contributing Guide](../../CONTRIBUTING.md) for workflow

---

## Related Documentation

- [API Reference](../API.md)
- [Performance Guide](../PERFORMANCE.md)
- [Troubleshooting](../TROUBLESHOOTING.md)
- [Contributing Guide](../../CONTRIBUTING.md)
