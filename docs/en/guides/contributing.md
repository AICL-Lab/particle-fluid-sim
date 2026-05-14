# Contributing Guide

How to contribute to the WebGPU Particle Fluid Simulation project.

## Development Workflow

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/particle-fluid-sim.git
cd particle-fluid-sim
npm install
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

Follow the spec-driven development workflow:

1. **Read** [AGENTS.md](../../../AGENTS.md) for workflow details
2. **Update specs** before implementing features
3. **Write tests** for new functionality
4. **Run validation**: `npm run verify`

### 4. Submit Pull Request

```bash
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Code Style

### TypeScript

- Strict mode enabled
- Prefer `const` over `let`
- Use explicit return types for public functions

### Formatting

Run Prettier before committing:

```bash
npm run format
```

### Linting

```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type        | Description      |
| ----------- | ---------------- |
| `feat:`     | New feature      |
| `fix:`      | Bug fix          |
| `docs:`     | Documentation    |
| `test:`     | Tests            |
| `refactor:` | Code refactoring |
| `chore:`    | Maintenance      |

Examples:

```
feat: add particle count URL parameter
fix: correct HiDPI coordinate mapping
docs: update API reference
```

## Spec-Driven Development

This project follows OpenSpec methodology:

1. **Specs are source of truth** - `openspec/specs/`
2. **Update specs first** - Before implementing changes
3. **Tests validate specs** - Property-based testing
4. **Code implements specs** - TypeScript + WGSL

### Spec Locations

| Directory                 | Purpose                |
| ------------------------- | ---------------------- |
| `openspec/specs/product/` | Product requirements   |
| `openspec/specs/rfc/`     | Architecture decisions |
| `openspec/specs/api/`     | API contracts          |
| `openspec/specs/testing/` | Test specifications    |

## Pull Request Checklist

- [ ] Code compiles (`npm run typecheck`)
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Coverage maintained (`npm run test:coverage`)
- [ ] Build succeeds (`npm run build`)
- [ ] Specs updated (if applicable)
- [ ] Documentation updated (if applicable)

## Getting Help

- **Issues:** [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues)
- **Discussions:** [GitHub Discussions](https://github.com/LessUp/particle-fluid-sim/discussions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
