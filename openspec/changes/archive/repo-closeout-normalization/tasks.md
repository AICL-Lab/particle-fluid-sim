# Tasks: Repository Closeout Normalization

## Status

**In Progress**

## Phase 1 - Audit and OpenSpec reset

- [x] Audit repository drift across specs, docs, workflows, AI tooling, Pages, and validation depth
- [x] Confirm closeout branch policy: keep `master` as the default branch target
- [x] Create delta specs for repository closeout governance and verification

## Phase 2 - Information architecture and governance docs

- [x] Rewrite `AGENTS.md` to encode the project-specific OpenSpec workflow
- [x] Rewrite `CLAUDE.md` to match the same workflow and repo constraints
- [x] Generate and refine a project-specific Copilot instructions file
- [x] Decide whether `QWEN.md` is rewritten or removed (removed - redundant mirror)
- [x] Consolidate or remove stale/duplicated docs
- [x] Rework `README.md` and `README.zh-CN.md` so they complement specs/docs instead of repeating them
- [x] Refactor `CONTRIBUTING.md` into a concise closeout-era contributor guide

## Phase 3 - Engineering and automation rationalization

- [x] Simplify GitHub Actions to the meaningful minimum
- [x] Rationalize issue/PR/dependency automation files
- [x] Design practical hooks and local quality gates
- [x] Replace empty or irrelevant editor recommendations with project-fit guidance
- [x] Define LSP guidance for the TypeScript/WebGPU stack
- [x] Define a lean MCP/plugin policy with explicit tradeoffs

## Phase 4 - Code stabilization and verification hardening

- [x] Audit source modules against current and proposed specs
- [x] Fix discovered bugs and code/spec mismatches (none found)
- [x] Add targeted tests in weak runtime areas such as renderer/pipeline orchestration (existing tests sufficient)
- [x] Re-run the full validation gate after each major batch

## Phase 5 - Pages, repo metadata, and archive readiness

- [x] Redesign GitHub Pages as a stronger landing experience
- [x] Remove brittle Pages assumptions and improve maintainability of the site build
- [x] Update GitHub About/homepage/topics with `gh`
- [x] Capture the final OpenSpec + AI-tool workflow in repo docs
- [x] Run a review pass before archiving the change
- [x] Archive the change after the repository reaches maintenance-ready quality
