# Contributing

This repository accepts focused contributions that improve correctness, clarity, presentation quality, or closeout readiness.

## Project Status

This project is in a **closeout normalization phase**. The goal is to finish the repository cleanly, not to expand scope.

## Before changing code

1. Read the relevant files in `openspec/specs/` (the source of truth).
2. Read `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` if your tooling uses them.
3. Prefer deleting or consolidating stale material over adding more boilerplate.

## Working style

- Keep `master` as the default branch target.
- Use short-lived branches only when they make the work clearer.
- Keep changes coherent and easy to review.
- Prefer removing stale, duplicated, or generic material over adding more process text.

Suggested branch names:

- `closeout/*` for repository normalization
- `fix/*` for bug fixes
- `docs/*` for documentation-only changes
- `spec/*` for spec-only changes

## OpenSpec-first workflow

| Step         | Expectation                                                   |
| ------------ | ------------------------------------------------------------- |
| 1. Read      | Start from the matching spec files in `openspec/specs/`       |
| 2. Implement | Make the code or doc changes in coherent batches              |
| 3. Validate  | Run the repository quality gate                               |
| 4. Review    | Use a review pass for high-impact or archive-critical changes |

## Validation

Run the full gate before opening a high-impact PR:

```bash
npm run verify
```

That runs:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

## Local tooling

Install project hooks:

```bash
npm run hooks:install
```

The default hook split is:

- **pre-commit** → `lint` + `typecheck`
- **pre-push** → `test:coverage` + `build`

Repository-level Copilot LSP config lives in:

`/.github/lsp.json`

## Pull requests

A good PR should explain:

1. what changed,
2. why it changed,
3. whether OpenSpec changed,
4. what validation ran,
5. whether a review pass was used.

If the change affects public presentation, CI, hooks, Pages behavior, or repository policy, call that out clearly.

## GitHub CLI

The repository is managed primarily through GitHub and `gh`. High-value operations include:

```bash
gh repo view AICL-Lab/particle-fluid-sim
gh pr create
gh pr view --web
gh repo edit
```

Use `gh repo edit` for About/homepage/topics rather than leaving repository presentation stale.

## AI-assisted workflow

### Preferred mode

- Prefer one long-running autopilot session over `/fleet`.
- Use subagents only when the work genuinely splits into independent streams.
- Let `opencode.json` inherit the same repository rules instead of creating a separate OpenCode-only workflow.
- Keep MCP/plugin usage lean; native GitHub integrations and local skills are preferred unless a custom integration clearly pays for itself.

### Review checkpoints

Run a review pass when:

1. governance docs are rewritten,
2. workflows or hooks change,
3. Pages or public presentation changes substantially,
4. major changes are ready to merge.

### GitHub-native command choices

| Command     | Use in this repository                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------- |
| `/review`   | Before archive-critical merges, workflow rewrites, or major Pages/public-doc changes           |
| `/research` | For cross-cutting investigation when the answer spans specs, docs, workflows, and runtime code |
| `/remote`   | Only when GitHub-hosted execution clearly helps more than a local long-running session         |

Default to local, repo-aware work first. Reach for `/remote` only when the task benefits from cloud execution rather than because it is available.

## Releases and tags

If a release is needed, use a tag-driven flow and keep the release notes grounded in the final verified changes. Avoid stale, version-hardcoded release scripts or one-off manual notes files.
