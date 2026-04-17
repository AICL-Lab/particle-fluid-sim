# Maintenance Guide

> **Project:** WebGPU Particle Fluid Simulation
> **Version:** 2.0.0
> **Last Updated:** 2026-04-16

This guide provides instructions for maintaining the project after the initial implementation phase.

---

## Table of Contents

- [Version Release Process](#version-release-process)
- [Dependency Management](#dependency-management)
- [Documentation Updates](#documentation-updates)
- [Testing and Quality](#testing-and-quality)
- [GitHub Actions Maintenance](#github-actions-maintenance)
- [Common Maintenance Tasks](#common-maintenance-tasks)

---

## Version Release Process

### Pre-Release Checklist

1. **Update Version**
   ```bash
   # Update version in package.json
   npm version patch|minor|major
   ```

2. **Update CHANGELOG**
   - Move items from `[Unreleased]` to new version section
   - Add release date
   - Add version comparison link

3. **Run Full Test Suite**
   ```bash
   npm run typecheck
   npm run lint
   npm test
   npm run build
   ```

4. **Update Documentation**
   - Verify API docs match current code
   - Update README if needed
   - Update performance benchmarks if relevant
   - Update specs/ if requirements or architecture changed

### Release Steps

```bash
# 1. Create release commit
git add .
git commit -m "chore: release v2.1.0"

# 2. Create tag
git tag v2.1.0

# 3. Push to GitHub
git push origin master --tags
```

### Post-Release

- Create GitHub Release with notes from CHANGELOG
- Verify GitHub Pages deployment completes
- Test demo site functionality

---

## Dependency Management

### Dependabot

The project uses Dependabot for automated dependency updates:

- **npm dependencies**: Weekly on Mondays at 06:00 UTC
- **GitHub Actions**: Weekly on Mondays at 06:00 UTC

### Handling Dependabot PRs

1. Review the PR for breaking changes
2. Check the changelog of the updated package
3. Run tests locally:
   ```bash
   npm install
   npm test
   npm run build
   ```
4. Merge if all tests pass

### Manual Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm install package-name@version

# Update all minor/patch versions
npm update
```

### Security Vulnerabilities

```bash
# Run security audit
npm audit

# Fix automatically fixable issues
npm audit fix

# For breaking changes, review manually
npm audit fix --force
```

---

## Documentation Updates

### When to Update Documentation

| Change Type | Docs to Update |
|-------------|----------------|
| New function/module | `docs/API.md` |
| New feature | `README.md`, `CHANGELOG.md` |
| Bug fix | `CHANGELOG.md` |
| Performance change | `docs/PERFORMANCE.md` |
| Common issue discovered | `docs/TROUBLESHOOTING.md` |
| Breaking change | All relevant docs |
| Requirement change | `specs/product/` |
| Architecture change | `specs/rfc/` |

### Documentation Style Guide

- Use present tense ("Returns particle count" not "Returned")
- Include code examples for API functions
- Keep table of contents updated
- Use relative links for internal references
- Test all links before committing

### Updating API Documentation

When adding or modifying a function:

1. Document in the source file with JSDoc comments
2. Update `docs/API.md` with full signature and examples
3. Update TypeScript types in `src/types.ts` if needed

---

## Testing and Quality

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Code Quality Checks

```bash
# TypeScript type checking
npm run typecheck

# ESLint
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Pre-Commit Quality Gates

Before any commit, ensure:

- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds

---

## GitHub Actions Maintenance

### Workflow Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Lint, test, build on push/PR |
| `.github/workflows/pages.yml` | Deploy documentation to Pages |

### Common Workflow Issues

**Node.js deprecation warnings:**
- Update `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` env var if needed
- Or update action versions to support new Node.js

**Pages deployment failures:**
- Check Jekyll build errors in workflow logs
- Verify `_config.yml` syntax
- Ensure all referenced files exist

### Workflow Updates

When updating workflows:

1. Test locally with `act` CLI tool if available
2. Create a test branch and push
3. Monitor GitHub Actions run
4. Merge after verification

---

## Common Maintenance Tasks

### Adding a New Configuration Parameter

1. Add to `src/config/sim.ts`:
   ```typescript
   export const NEW_PARAM = 100;
   ```
2. Add to `SIMULATION_CONFIG` object
3. Create preamble function if used in shaders
4. Update `docs/API.md`
5. Add test if relevant
6. Update `CHANGELOG.md`

### Fixing a Bug

1. Create branch: `fix/description`
2. Write failing test that demonstrates the bug
3. Fix the code
4. Verify test passes
5. Run full test suite
6. Update `CHANGELOG.md` under `Unreleased/Fixed`
7. Create PR with description

### Adding a New Feature

1. Create branch: `feature/description`
2. **Update or create specs in `/specs/`** (Spec-Driven Development)
3. Implement with tests
4. Update documentation
5. Update `CHANGELOG.md` under `Unreleased/Added`
6. Create PR with description

### Performance Optimization

1. Baseline: measure current performance
2. Implement optimization
3. Re-measure on multiple devices
4. Update `docs/PERFORMANCE.md` if significant
5. Document approach in code comments

---

## Contact

For questions about maintenance procedures, open a discussion on GitHub.

---

*This guide is maintained as part of the project documentation. Update it when processes change.*
