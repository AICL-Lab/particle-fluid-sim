# QWEN.md

## Purpose

This file mirrors the repository rules for model/tooling setups that read `QWEN.md`. It is intentionally concise so it does not drift away from `AGENTS.md`.

## Canonical references

- Repository-wide rules: `AGENTS.md`
- Source of truth: `openspec/specs/`
- Active closeout change: `openspec/changes/repo-closeout-normalization/`
- Copilot project instructions: `.github/copilot-instructions.md`

## Project posture

- This repository is in a closeout normalization phase.
- Prioritize correctness, clarity, presentation quality, and low maintenance burden.
- Avoid feature expansion unless explicitly approved.

## Repository rules

1. Keep `master` as the default branch target.
2. Do not add WebGL fallbacks.
3. Keep docs concise and project-specific.
4. Remove or consolidate stale and duplicated content.
5. If rules conflict, follow `AGENTS.md`.

## Workflow

1. Read the relevant OpenSpec docs in `openspec/specs/`.
2. Update the active OpenSpec change for non-trivial workflow, documentation, architecture, or behavior changes.
3. Implement in coherent batches.
4. Use a review pass before archive-critical changes.

## Validation gate

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

## Project facts

- Runtime: TypeScript + Vite + WebGPU
- Shaders: `src/shaders/`
- Tests: colocated `*.test.ts`
- Pages: `docs/site/` with `scripts/build-docs.js`
