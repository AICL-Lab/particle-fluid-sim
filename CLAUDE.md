# CLAUDE.md

## First principles

- Read `AGENTS.md` and the relevant files in `openspec/specs/` before changing code or process.
- Treat `openspec/changes/repo-closeout-normalization/` as the active closeout workstream unless a new approved change supersedes it.
- Optimize for finishing the repository cleanly, not for adding more features.

## Repository rules

- Keep `master` as the default branch target.
- Do not add WebGL fallbacks; this project is WebGPU-only.
- Keep docs concise, project-specific, and non-duplicative.
- If guidance files disagree, `AGENTS.md` wins.

## Key commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

Run validation in CI order:

```bash
npm run lint && npm run typecheck && npm run test:coverage && npm run build
```

## Important project facts

- WGSL shaders are in `src/shaders/`.
- Tests are colocated as `*.test.ts`.
- Repository-level Copilot instructions are in `.github/copilot-instructions.md`.
- Repository-level Copilot LSP configuration is in `.github/lsp.json`.

## Workflow

1. Review the relevant OpenSpec docs.
2. Update the active change when behavior, workflow, or governance changes materially.
3. Implement in coherent batches.
4. Use `/review` before archive-critical steps or major workflow rewrites.
5. Use `/research` for cross-cutting investigations before large refactors.
6. Prefer one long-running autopilot session over `/fleet` unless parallelism is clearly worth it.
7. Use `/remote` only when GitHub-hosted execution is clearly more useful than a local session.
