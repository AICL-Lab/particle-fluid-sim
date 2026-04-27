# Product Delta: Repository Closeout and Governance

## ADDED Requirements

### REQ-9: Source of Truth and Repository Structure

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-9.1 | The repository SHALL treat `openspec/specs/` as the single source of truth for requirements, design, and testing expectations | High |
| REQ-9.2 | Governance and contributor-facing documents SHALL reference `openspec/specs/` using correct paths | High |
| REQ-9.3 | Stale, duplicated, or low-value documentation SHALL be removed or consolidated so each retained document has a distinct purpose | High |
| REQ-9.4 | Repository automation and guidance SHALL target `master` as the default branch unless an explicit future migration is approved | High |

### REQ-10: Contributor and AI Tool Workflow

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-10.1 | The repository SHALL provide project-specific guidance for OpenSpec-driven development rather than generic AI-tool boilerplate | High |
| REQ-10.2 | `AGENTS.md`, `CLAUDE.md`, and the Copilot instructions file SHALL agree on the same development workflow and constraints | High |
| REQ-10.3 | The documented workflow SHALL favor short-lived implementation branches and avoid unnecessary branch proliferation | Medium |
| REQ-10.4 | The documented workflow SHALL identify review checkpoints for significant changes before archive-critical merges | Medium |

### REQ-11: Public Project Presentation

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-11.1 | GitHub Pages SHALL present the project as a compelling landing page rather than a low-value README mirror | High |
| REQ-11.2 | The project SHALL expose clear routes to the live demo, source repository, specs, and durable technical reference | High |
| REQ-11.3 | GitHub repository metadata SHALL include a curated description, homepage, and relevant topics | Medium |
| REQ-11.4 | Public-facing docs SHALL not announce archival or low-maintenance intent unless explicitly requested | High |

### REQ-12: Closeout Stability

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-12.1 | The repository SHALL pass the validation pipeline of lint, typecheck, coverage tests, and build before closeout | High |
| REQ-12.2 | High-risk weakly-tested runtime modules SHALL receive targeted additional verification before the change is archived | High |
| REQ-12.3 | Engineering configuration SHALL be simplified to a low-noise set of tools and workflows that are justified by project needs | Medium |

## ADDED Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-9 | Documentation and governance files SHALL optimize for signal over volume |
| NFR-10 | Tooling choices SHALL minimize maintenance burden and context overhead |
| NFR-11 | The closeout workflow SHALL remain executable by a single long-running AI-assisted session without depending on `/fleet` |

## Acceptance Criteria Summary

| Category | Criteria |
|----------|----------|
| Source of Truth | Retained governance docs point to `openspec/specs/` correctly |
| Workflow | AI-tool instructions are aligned and project-specific |
| Presentation | Pages and GitHub metadata clearly explain and showcase the project |
| Stability | Validation passes and weak runtime confidence gaps are reduced |

