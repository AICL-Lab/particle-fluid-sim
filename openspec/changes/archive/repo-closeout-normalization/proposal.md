# Change Proposal: Repository Closeout Normalization

## Status

**Completed**

## Summary

Normalize the repository around OpenSpec as the source of truth, remove documentation and tooling drift, harden the codebase for a maintenance-ready finish, and improve the public project presentation without expanding the product scope.

## Motivation

The repository already contains a working WebGPU simulation, CI, Pages, and an OpenSpec scaffold, but the project has accumulated drift in several areas:

- documentation duplication and stale references,
- generic or inconsistent AI-tool instructions,
- overgrown or low-signal engineering/process files,
- fragile Pages generation,
- uneven verification depth in important runtime modules,
- GitHub metadata and workflows that are functional but not tightly curated for a closeout phase.

The goal of this change is to finish the project cleanly and intentionally so future work, if any, happens from a stable and well-documented baseline rather than from a drifting repository.

## Goals

1. Reassert `openspec/specs/` as the single source of truth.
2. Replace generic governance/tooling docs with project-specific guidance.
3. Remove or consolidate stale, duplicated, or low-value documentation.
4. Simplify workflows, hooks, and local tooling for a low-noise closeout posture.
5. Fix bugs and reduce the highest-confidence gaps in the runtime codebase.
6. Turn GitHub Pages into a stronger project landing surface.
7. Curate GitHub About/homepage/topics with `gh`.
8. Encode a practical OpenSpec + AI-tool operating model for the rest of the closeout work.

## Non-Goals

- Adding major new runtime features.
- Announcing archival or deprecation status to public readers.
- Introducing heavyweight infrastructure that increases maintenance burden.
- Migrating the default branch from `master` to `main`.

## Scope

### In Scope

- OpenSpec proposal, design, tasks, and delta specs for repository normalization
- `AGENTS.md`, `CLAUDE.md`, Copilot instructions, contributing/process docs
- README/docs/Pages information architecture
- GitHub workflows, hooks, editor/tooling guidance, and repository metadata
- Code/spec drift fixes and targeted test improvements

### Out of Scope

- New simulation capabilities not needed for closeout hardening
- Broad rebranding unrelated to the existing project identity
- Multi-branch workflow expansion or `/fleet`-first execution strategy

## Success Criteria

- Repository guidance points consistently to `openspec/specs/`.
- Low-value or duplicated documentation is removed or consolidated.
- AI-tool instructions become concise, project-specific, and aligned.
- GitHub automation reflects the actual default branch and meaningful validation steps.
- Pages and GitHub metadata present the project clearly and deliberately.
- The repository passes the validation pipeline and has better coverage in weak runtime areas.
