# Copilot Instructions for particle-fluid-sim

## Mission

Finish the repository cleanly. Optimize for correctness, clarity, low maintenance burden, and closeout readiness rather than feature expansion.

## Source of truth

- Treat `openspec/specs/` as the single source of truth.
- For non-trivial behavioral, workflow, or architecture changes, update or create the relevant OpenSpec change under `openspec/changes/` before broad implementation.
- If code and specs disagree, surface the conflict and resolve it explicitly.

## Repository-specific rules

- Default branch policy is `master`; do not introduce `main` migration work unless explicitly requested.
- Keep documentation high-signal. Remove or consolidate generic, stale, or duplicate content instead of adding more process text.
- Prefer project-specific guidance over boilerplate in `AGENTS.md`, `CLAUDE.md`, and other model-specific files.
- This is a WebGPU-only project. Do not add WebGL fallbacks.
- WGSL shaders live in `src/shaders/` and are imported as assets.
- Tests are colocated with source as `*.test.ts`.

## Validation order

Run the existing closeout gate in this order:

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test:coverage`
4. `npm run build`

## Preferred workflow

1. Read the relevant OpenSpec docs first.
2. Update the active OpenSpec change when the task changes behavior, workflow, or repository policy.
3. Implement in coherent batches.
4. Use `/review` before archive-critical merges or major workflow changes.
5. Use `/research` for cross-cutting investigations before large refactors or workflow changes.
6. Prefer one long-running autopilot session over `/fleet` unless work truly splits into independent streams.
7. Use `/remote` only when GitHub-hosted execution clearly helps more than the local repository session.

## Tooling guidance

- Prefer built-in GitHub integrations and skills before adding new MCP servers.
- Keep MCP/plugin usage lean; avoid high-context integrations that do not materially improve this repository.
- Repository-level LSP configuration lives in `.github/lsp.json`.
