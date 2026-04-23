# Tasks: Repository Closeout Normalization

## Status
**In Progress**

## Phase 1 - Audit and OpenSpec reset

- [x] Audit repository drift across specs, docs, workflows, AI tooling, Pages, and validation depth
- [x] Confirm closeout branch policy: keep `master` as the default branch target
- [ ] Create delta specs for repository closeout governance and verification

## Phase 2 - Information architecture and governance docs

- [ ] Rewrite `AGENTS.md` to encode the project-specific OpenSpec workflow
- [ ] Rewrite `CLAUDE.md` to match the same workflow and repo constraints
- [ ] Generate and refine a project-specific Copilot instructions file
- [ ] Decide whether `QWEN.md` is rewritten or removed
- [ ] Consolidate or remove stale/duplicated docs
- [ ] Rework `README.md` and `README.zh-CN.md` so they complement specs/docs instead of repeating them
- [ ] Refactor `CONTRIBUTING.md` into a concise closeout-era contributor guide

## Phase 3 - Engineering and automation rationalization

- [ ] Simplify GitHub Actions to the meaningful minimum
- [ ] Rationalize issue/PR/dependency automation files
- [ ] Design practical hooks and local quality gates
- [ ] Replace empty or irrelevant editor recommendations with project-fit guidance
- [ ] Define LSP guidance for the TypeScript/WebGPU stack
- [ ] Define a lean MCP/plugin policy with explicit tradeoffs

## Phase 4 - Code stabilization and verification hardening

- [ ] Audit source modules against current and proposed specs
- [ ] Fix discovered bugs and code/spec mismatches
- [ ] Add targeted tests in weak runtime areas such as renderer/pipeline orchestration
- [ ] Re-run the full validation gate after each major batch

## Phase 5 - Pages, repo metadata, and archive readiness

- [ ] Redesign GitHub Pages as a stronger landing experience
- [ ] Remove brittle Pages assumptions and improve maintainability of the site build
- [ ] Update GitHub About/homepage/topics with `gh`
- [ ] Capture the final OpenSpec + AI-tool workflow in repo docs
- [ ] Run a review pass before archiving the change
- [ ] Archive the change after the repository reaches maintenance-ready quality

