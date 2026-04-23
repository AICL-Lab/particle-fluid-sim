# Testing Delta: Repository Closeout Verification

## ADDED Verification Scenarios

### Scenario: Source-of-truth references are aligned

- Given the repository governance and contributor documents
- When internal OpenSpec references are reviewed
- Then retained documents should reference `openspec/specs/` correctly
- And outdated `specs/`-root references should be removed or corrected

### Scenario: Governance files are project-specific

- Given `AGENTS.md`, `CLAUDE.md`, Copilot instructions, and contributor docs
- When the workflow guidance is compared
- Then the files should describe the same OpenSpec-first process
- And they should avoid generic boilerplate unrelated to this repository

### Scenario: GitHub automation is meaningful

- Given the workflow configuration
- When CI and Pages automation are reviewed
- Then workflow triggers should match the chosen branch strategy
- And each workflow should exist for a clear repository need

### Scenario: Pages presentation is intentional

- Given the GitHub Pages site
- When a new visitor lands on the home page
- Then the page should quickly communicate value, demo path, code path, and spec path
- And the page should not behave like a low-value README mirror

### Scenario: Closeout stability is validated

- Given the codebase after normalization changes
- When the validation pipeline is executed
- Then lint, typecheck, coverage tests, and build should pass
- And targeted runtime confidence gaps should be reduced in high-risk modules

## Verification Notes

- Favor small, high-value tests in orchestration-heavy areas.
- Verify both file-level correctness and user-facing repository navigation.
- Treat broken internal links and contradictory workflow instructions as closeout defects.
