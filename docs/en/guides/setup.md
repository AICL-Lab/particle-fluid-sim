# Environment Setup

Detailed guide for setting up your development environment.

## Prerequisites

### Required

- **Node.js 18+** - JavaScript runtime
- **npm 9+** - Package manager (comes with Node.js)
- **Git** - Version control

### Recommended

- **VS Code** - IDE with TypeScript support
- **Chrome 113+** - Browser with WebGPU support

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Installation

```bash
npm run typecheck
npm test
```

## IDE Setup

### VS Code Extensions

Install these extensions for the best experience:

| Extension          | Purpose            |
| ------------------ | ------------------ |
| ESLint             | Code linting       |
| Prettier           | Code formatting    |
| TypeScript Nightly | Latest TS features |

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### LSP Configuration

The project includes `.github/lsp.json` for language server protocol configuration.

## Browser Setup

### Chrome

WebGPU is enabled by default in Chrome 113+.

### Safari

WebGPU requires Safari 17+ on macOS 14+ (Sonoma).

### Firefox

Enable WebGPU experimentally:

1. Open `about:config`
2. Set `dom.webgpu.enabled = true`
3. Restart browser

## Local Development

### Development Server

```bash
npm run dev
```

- Hot Module Replacement (HMR) enabled
- Accessible at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Troubleshooting

### "WebGPU not supported" Error

- Update to Chrome 113+ or Edge 113+
- Check `chrome://gpu` for WebGPU status
- Ensure hardware acceleration is enabled

### TypeScript Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Test Failures

```bash
# Run tests with verbose output
npm test -- --reporter=verbose
```

## Git Hooks

Install pre-commit hooks:

```bash
npm run hooks:install
```

This runs linting and type checking before each commit.
