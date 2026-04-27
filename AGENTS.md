# AGENTS.md

## Mission

Finish `particle-fluid-sim` cleanly. Optimize for correctness, clarity, low maintenance burden, and closeout readiness rather than feature expansion.

## Source of truth

- `openspec/specs/` is the single source of truth for requirements, architecture, API, and testing.
- The active repository-wide normalization work lives in `openspec/changes/repo-closeout-normalization/` until it is archived.
- If code, docs, and specs disagree, resolve the conflict explicitly instead of silently drifting.

## Current project posture

- The project is in a **closeout normalization** phase.
- The goal is to harden the current version, simplify the repository, improve presentation quality, and reduce future maintenance burden.
- Do **not** announce archival or low-maintenance intent in public-facing docs unless explicitly requested.

## Repository invariants

1. **Default branch** is `master`. Do not introduce `main` migration work unless explicitly requested.
2. **WebGPU only**. Do not add WebGL or fallback renderers.
3. **WGSL shaders** live in `src/shaders/`.
4. **Tests are colocated** with source as `*.test.ts`.
5. **Documentation must stay high-signal**. Remove or consolidate generic, stale, or duplicate content instead of adding more boilerplate.

## OpenSpec workflow

### Reading and updating specs

1. **Before implementation**: Read relevant specs in `openspec/specs/`
2. **For behavioral changes**: Update the active OpenSpec change under `openspec/changes/` first
3. **After decisions**: Update `proposal.md`, `design.md`, `tasks.md` when scope changes

### Current active change

- `openspec/changes/repo-closeout-normalization/` — canonical closeout workstream

## Execution rules

1. Read relevant specs before making changes.
2. For non-trivial behavior, workflow, documentation, or architecture changes, update the active OpenSpec change first.
3. Implement in coherent batches that leave the repo in a valid state.
4. Prefer deletion/consolidation over adding more low-value files.
5. Prefer a single long-running autopilot execution over `/fleet` unless the work truly splits into independent streams.
6. Use `/review` or an equivalent review pass before archive-critical merges and major workflow changes.

## Validation gate

Run the repository quality gate in this order:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

This matches CI and should be treated as the closeout gate.

## Tooling policy

### AI instruction files

- `AGENTS.md` defines repository-wide rules.
- `CLAUDE.md` and `.github/copilot-instructions.md` must align with this file, not invent parallel workflows.
- `opencode.json` carries the same workflow into OpenCode without introducing a second process model.
- Keep model-specific files concise and project-specific.

### LSP, MCP, and plugins

- Repository-level Copilot LSP configuration lives in `.github/lsp.json`.
- Prefer built-in GitHub tooling, repo-local config, and skills before adding new MCP servers.
- Keep plugin/MCP usage lean; avoid context-heavy integrations that do not materially help this repository.

## High-value file map

| Path                                                  | Purpose                                     |
| ----------------------------------------------------- | ------------------------------------------- |
| `openspec/specs/product/webgpu-particle-fluid-sim.md` | Product requirements                        |
| `openspec/specs/rfc/0001-core-architecture.md`        | Core architecture                           |
| `openspec/specs/rfc/0002-implementation-tasks.md`     | Historical implementation tasks             |
| `openspec/changes/repo-closeout-normalization/`       | Active closeout normalization change        |
| `.github/copilot-instructions.md`                     | Copilot project instructions                |
| `.github/lsp.json`                                    | Repository-level LSP config for Copilot CLI |
| `src/config/sim.ts`                                   | Shared simulation constants                 |
| `src/core/renderer.ts`                                | Runtime orchestration                       |
| `src/core/pipelines.ts`                               | GPU pipeline setup                          |
| `docs/site/` + `scripts/build-docs.js`                | Current Pages site and builder              |

## Practical priorities

When in doubt, prefer work that does one of the following:

1. removes drift,
2. simplifies the repo,
3. improves correctness or verification,
4. improves the project's public presentation,
5. makes future maintenance smaller and clearer.
