# Contributing

This repository accepts focused contributions that improve correctness, clarity, presentation quality, or closeout readiness.

## Before changing code

1. Read the relevant files in `openspec/specs/`.
2. Check whether the active change in `openspec/changes/repo-closeout-normalization/` needs an update.
3. Read `AGENTS.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` if your tooling uses them.

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

| Step            | Expectation                                                                  |
| --------------- | ---------------------------------------------------------------------------- |
| 1. Read         | Start from the matching spec files in `openspec/specs/`                      |
| 2. Update specs | Update the active change if behavior, workflow, or repository policy changes |
| 3. Implement    | Make the code or doc changes in coherent batches                             |
| 4. Validate     | Run the repository quality gate                                              |
| 5. Review       | Use a review pass for high-impact or archive-critical changes                |

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
