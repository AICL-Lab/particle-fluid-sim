# RFC Delta: Repository Closeout Governance

## Overview

This delta defines how the repository should be normalized for a high-quality finish. The project is not entering feature expansion; it is entering a controlled closeout phase focused on correctness, clarity, maintainability, and presentation quality.

## Canonical Layers

| Layer | Canonical Artifact | Role |
|-------|--------------------|------|
| Requirements | `openspec/specs/` | Product, architecture, API, and testing truth |
| Proposal execution | `openspec/changes/repo-closeout-normalization/` | Current normalization workstream |
| Project entry | `README.md`, GitHub About, Pages home | Discovery and orientation |
| Contributor workflow | `AGENTS.md`, `CLAUDE.md`, Copilot instructions, `CONTRIBUTING.md` | Human/AI execution policy |
| Technical reference | Curated `docs/` set | Durable detail not duplicated elsewhere |

## Workflow Design

### Branching

- Keep `master` as the repository default branch.
- Use the fewest branches necessary for coherent work.
- Prefer finishing and merging meaningful vertical slices over long-lived parallel lines of development.

### Review Gates

Use a review pass at these checkpoints:

1. after the closeout specs and governance docs are rewritten,
2. before workflow/tooling simplification is finalized,
3. before archiving the OpenSpec change.

### Implementation Order

1. OpenSpec delta
2. Governance docs and contributor instructions
3. Workflow/tooling simplification
4. Code and test hardening
5. Pages and GitHub presentation
6. Final validation and archive

## Tooling Policy

### LSP

- Use the TypeScript language service as the primary code intelligence backbone.
- Layer ESLint and Prettier guidance on top of TypeScript rather than adding redundant servers.
- Keep editor recommendations limited to tools that directly improve this repository's TypeScript/WebGPU workflow.

### MCP and Plugins

- Default to a lean setup.
- Prefer native CLI tools, skills, and built-in GitHub integrations when they solve the need adequately.
- Introduce MCP or plugins only when they materially improve repo operations without excessive context or maintenance cost.

### AI Tool Coordination

- OpenSpec defines the workflow.
- `AGENTS.md` defines repository-wide rules.
- Tool-specific instruction files adapt behavior to the tool, but must not contradict repository rules.
- `/fleet` is not the default execution mode for this project.

## Public Presentation Design

The Pages site and GitHub metadata should communicate:

- what the project does,
- what is technically interesting about it,
- how to run or try it,
- where to inspect the implementation and specs.

The public presentation should be concise, technically credible, and visually sharper than a raw document dump.

