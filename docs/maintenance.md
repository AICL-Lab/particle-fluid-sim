# Workflow Guide

This project is in a closeout normalization phase. The goal is to finish the repository cleanly, not to expand scope.

## Operating principles

1. `openspec/specs/` is the source of truth.
2. Keep `master` as the default branch target.
3. Prefer deleting or consolidating stale material over adding more boilerplate.
4. Use short-lived branches only when they make the work clearer.
5. Use `/review` or an equivalent review pass before archive-critical changes.

## OpenSpec workflow

### Existing active change

Repository-wide cleanup and closeout work should stay under:

`openspec/changes/repo-closeout-normalization/`

### Command flow

| Command | Use |
|---------|-----|
| `/opsx:explore` | Research before changing specs or code |
| `/opsx:propose <name>` | Start a substantial new feature or governance change |
| `/opsx:apply <name>` | Implement the approved change |
| `/opsx:archive <name>` | Merge the finished change back into the main specs |

### Expected sequence

1. Read the relevant spec files.
2. Update the active OpenSpec change if the task affects behavior, workflow, architecture, or repository policy.
3. Implement in coherent batches.
4. Run the validation gate.
5. Request or run review before merging high-impact changes.

## Local quality gates

### Full validation gate

Run this before pushing archive-critical or broad cleanup work:

```bash
npm run verify
```

That expands to:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

### Hooks

The repository includes lightweight git hooks in `.githooks/`.

Install them locally:

```bash
npm run hooks:install
```

The default hook split is:

- **pre-commit** → `lint` + `typecheck`
- **pre-push** → `test:coverage` + `build`

## GitHub workflow

### Pull requests

Use a PR when the work changes repository policy, Pages behavior, public docs, CI, or runtime behavior. The PR description should make these points clear:

1. What changed
2. Why it changed
3. Whether OpenSpec changed
4. Which validation and review steps were run

### GitHub CLI

The repository is managed primarily through GitHub and `gh`. High-value operations include:

```bash
gh repo view LessUp/particle-fluid-sim
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
4. the OpenSpec closeout change is ready to archive.

### GitHub-native command choices

| Command | Use in this repository |
|---------|------------------------|
| `/review` | Before archive-critical merges, workflow rewrites, or major Pages/public-doc changes |
| `/research` | For cross-cutting investigation when the answer spans specs, docs, workflows, and runtime code |
| `/remote` | Only when GitHub-hosted execution clearly helps more than a local long-running session |

Default to local, repo-aware work first. Reach for `/remote` only when the task benefits from cloud execution rather than because it is available.

## Releases and tags

If a release is needed, use a tag-driven flow and keep the release notes grounded in the final verified changes. Avoid stale, version-hardcoded release scripts or one-off manual notes files.
