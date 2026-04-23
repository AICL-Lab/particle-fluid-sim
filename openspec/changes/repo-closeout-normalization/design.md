# Design: Repository Closeout Normalization

## Overview

This change treats repository cleanup as a single governance and information-architecture effort rather than a series of isolated edits. The implementation order is deliberate:

1. define the closeout rules in OpenSpec,
2. realign docs and contributor/tool instructions,
3. simplify engineering automation and tooling,
4. fix code and verification gaps,
5. polish outward presentation and archive the change.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Source of truth | Keep `openspec/specs/` authoritative | Prevents README/docs/tool instructions from diverging again |
| Branch policy | Keep `master` as default branch | Minimizes churn and avoids low-value migration work |
| Workflow style | One primary closeout stream, limited side branches | Matches the goal of finishing quickly with low coordination overhead |
| Review policy | Use `/review` or code review before archive-critical merges | Provides a quality gate without overcomplicating the flow |
| Autopilot policy | Prefer one long autopilot session over `/fleet` | Aligns with cost and context concerns |
| MCP policy | Stay lean; prefer native tools/skills unless MCP adds clear value | Avoids context-heavy integrations that are not justified |
| LSP policy | Standardize on TypeScript language service + ESLint/Prettier guidance | Best fit for the repo's TypeScript/Vite/WebGPU stack |

## Information Architecture

The repository will be organized around four distinct document layers:

1. **OpenSpec layer** — requirements, design, testing, and change proposals
2. **Project entry layer** — README and GitHub About/Homepage for discovery
3. **Contributor workflow layer** — AGENTS, CLAUDE, Copilot instructions, contributing guide
4. **Reference layer** — only the durable technical docs that add value beyond README/specs

Any document that does not have a unique role should be consolidated or removed.

## Tooling and Contributor Guidance

### AI Tool Alignment

- `AGENTS.md` defines the project-wide OpenSpec workflow and repository invariants.
- `CLAUDE.md` and Copilot instructions must agree with `AGENTS.md` instead of inventing a separate process.
- Additional model-specific files should either be rewritten to the same truth or removed.

### Review and Execution Flow

1. Audit or explore before editing.
2. Write or update the OpenSpec change first for behavioral or governance changes.
3. Implement in small, coherent batches.
4. Use `/review` or a code review pass before archive-critical steps.
5. Use the full validation gate before archiving the change.

## Pages and Public Presentation

The Pages site should act as a project landing surface first and a document index second. The implementation should emphasize:

- what the project is,
- why it is interesting,
- where to try it,
- where to inspect the code/specs,
- where to find focused technical reference.

The Pages build should avoid fragile root-relative assumptions and should not depend on a hand-maintained documentation maze.

## Verification Strategy

The closeout change is complete only when:

- repo structure and docs are aligned,
- automation is simplified and meaningful,
- GitHub metadata is curated,
- runtime validation passes,
- high-risk weakly-tested areas have targeted additional coverage,
- the final OpenSpec workflow is documented and actionable.

