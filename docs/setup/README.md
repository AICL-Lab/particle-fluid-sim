# Development Setup

This guide covers the local setup that matters for this repository today: TypeScript/WebGPU development, validation, LSP, editor settings, and hooks.

## Requirements

| Tool | Requirement |
|------|-------------|
| Node.js | 18+ |
| npm | 9+ |
| Git | Any recent version |
| Browser | Chrome 113+, Edge 113+, or Safari 17+ |

## Quick start

```bash
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim
npm install
npm run dev
```

Open `http://localhost:5173` in a WebGPU-capable browser.

## Validation commands

| Command | Purpose |
|---------|---------|
| `npm run lint` | ESLint on `src/` |
| `npm run typecheck` | Standalone TypeScript check |
| `npm run test:coverage` | Full test suite with coverage |
| `npm run build` | Production build |
| `npm run verify` | CI-order closeout gate |

## Editor and LSP

### VS Code

The repository ships with:

- `.vscode/settings.json`
- `.vscode/extensions.json`

Recommended extensions:

- ESLint
- Prettier
- GitHub Copilot
- GitHub Copilot Chat
- Shader syntax highlighting

### Copilot CLI LSP

Repository-level LSP configuration lives in:

`/.github/lsp.json`

This repository uses the TypeScript language service through:

```json
{
  "lspServers": {
    "typescript": {
      "command": "node_modules/.bin/typescript-language-server",
      "args": ["--stdio"]
    }
  }
}
```

This setup is repository-specific and works best with Copilot CLI. Other tools such as Claude Code or Codex may use their own editor or built-in code intelligence, but the TypeScript language server itself is not tied to one assistant.

### OpenCode project config

Repository-level OpenCode configuration lives in:

`/opencode.json`

It intentionally stays small:

- reuse shared repository instructions,
- keep file watching away from build artifacts,
- avoid preconfiguring heavy MCP/plugin stacks,
- bias the default workflow toward closeout implementation rather than feature sprawl.

## Git hooks

The repo includes project-local hooks in `.githooks/`.

Install them with:

```bash
npm run hooks:install
```

Hook policy:

- `pre-commit` runs `lint` and `typecheck`
- `pre-push` runs `test:coverage` and `build`

This keeps the fast checks local while still enforcing a strong pre-push gate.

## Pages and demo

- Local dev app: `npm run dev`
- Production app build: `npm run build`
- Pages site build: `npm run docs:build`

The hosted Pages site uses:

- `/` → landing page + docs/spec navigation
- `/demo/` → actual simulation build

## Repository-specific notes

1. `openspec/specs/` is the source of truth.
2. WGSL shaders live in `src/shaders/`.
3. Tests are colocated with source as `*.test.ts`.
4. The current repository-wide cleanup runs under `openspec/changes/repo-closeout-normalization/`.
