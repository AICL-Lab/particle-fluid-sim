# Contributing Guide

Thank you for your interest in contributing to the WebGPU Particle Fluid Simulation project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Code Style](#code-style)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

---

## Code of Conduct

Be respectful and inclusive. We welcome contributions from everyone.

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- A WebGPU-compatible browser for testing:
  - Chrome 113+
  - Edge 113+
  - Safari 17+ (macOS 14+)

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/particle-fluid-sim.git
cd particle-fluid-sim

# Install dependencies
npm install

# Start development server
npm run dev
```

### Verify Setup

```bash
# Run type checking
npm run typecheck

# Run linter
npm run lint

# Run tests
npm test

# Build for production
npm run build
```

All commands should pass without errors.

## Project Structure

```
particle-fluid-sim/
├── src/
│   ├── config/           # Simulation configuration
│   │   └── sim.ts        # Constants + WGSL preamble builders
│   ├── core/             # Core modules
│   │   ├── buffers.ts    # GPU buffer management
│   │   ├── color.ts      # Color mapping functions
│   │   ├── input.ts      # Mouse/touch handling
│   │   ├── physics.ts    # Physics calculations
│   │   ├── pipelines.ts  # WebGPU pipeline creation
│   │   ├── quality.ts    # Adaptive quality logic
│   │   ├── renderer.ts   # Render loop management
│   │   └── webgpu.ts     # WebGPU initialization
│   ├── shaders/          # WGSL shader files
│   ├── main.ts           # Application entry point
│   ├── style.css         # UI styles
│   └── types.ts          # Type definitions
├── docs/                 # Documentation
├── .github/              # GitHub workflows and templates
└── .kiro/                # Project specifications
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` — New features
- `fix/` — Bug fixes
- `docs/` — Documentation changes
- `refactor/` — Code refactoring
- `test/` — Test additions/changes
- `chore/` — Maintenance tasks

### 2. Make Your Changes

- Follow the [Code Style](#code-style) guidelines
- Add tests for new functionality
- Update documentation as needed
- Keep changes focused and atomic

### 3. Verify Your Changes

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Format (if needed)
npm run format

# Run tests
npm test

# Build
npm run build
```

### 4. Commit Your Changes

Follow the [Commit Convention](#commit-convention) guidelines.

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub.

## Testing Guidelines

### Test Structure

Tests are located alongside source files with `.test.ts` extension:

```
src/
├── core/
│   ├── physics.ts
│   ├── physics.test.ts    # Tests for physics.ts
│   ├── color.ts
│   └── color.test.ts      # Tests for color.ts
```

### Running Tests

```bash
# Run all tests once
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage
```

### Property-Based Testing

This project uses [fast-check](https://github.com/dubzzz/fast-check) for property-based testing. When adding new physics or math functions:

```typescript
import * as fc from 'fast-check';

describe('MyFunction', () => {
  it('should satisfy property X', () => {
    fc.assert(
      fc.property(
        // Arbitraries for inputs
        fc.float({ min: 0, max: 1000, noNaN: true }),
        // Property function
        (input) => {
          const result = myFunction(input);
          return result >= 0; // Your property
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Naming

Use descriptive test names that explain the expected behavior:

```typescript
// Good
it('should return zero repulsion when particle is outside radius', () => { ... });
it('should clamp velocity to max speed', () => { ... });

// Avoid
it('works correctly', () => { ... });
it('test repulsion', () => { ... });
```

## Code Style

### TypeScript

- Use strict type checking (enabled in `tsconfig.json`)
- Prefer explicit return types for public functions
- Use `const` over `let` when possible
- Avoid `any` type; use `unknown` when type is truly unknown

### Formatting

This project uses Prettier with these key settings:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

Run `npm run format` to auto-format code.

### Linting

ESLint rules are configured in `eslint.config.js`. Key rules:

- `@typescript-eslint/explicit-function-return-type: warn` — Consider adding return types
- `@typescript-eslint/no-unused-vars: error` — No unused variables
- `@typescript-eslint/no-explicit-any: warn` — Avoid `any`
- `no-console: warn` — Use `console.warn` or `console.error` instead

Run `npm run lint` to check, `npm run lint:fix` to auto-fix.

### WGSL Shaders

- Keep shader code aligned with TypeScript equivalents
- Document any deviations from CPU implementation
- Use meaningful variable names

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code change without fix/feature |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |
| `ci` | CI/CD changes |

### Examples

```bash
feat(quality): add viewport-based particle scaling
fix(physics): correct boundary bounce damping calculation
docs(api): document createRenderer function
test(color): add property tests for velocityToColor
refactor(buffers): extract buffer validation to separate function
```

### Breaking Changes

```bash
feat(api)!: change createPipelines signature

BREAKING CHANGE: createPipelines now requires format parameter
```

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention

### PR Title

Use the same format as commit messages:

```
feat(scope): brief description
```

### PR Description

Include:

1. **What** — Description of changes
2. **Why** — Motivation/context
3. **How** — Implementation approach (if non-trivial)
4. **Testing** — How you tested the changes
5. **Screenshots** — For UI changes

### Review Process

1. Automated checks must pass (CI)
2. At least one approval required
3. Resolve all review comments
4. Squash and merge preferred

## Issue Guidelines

### Bug Reports

Include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Console errors

### Feature Requests

Include:

- Use case / problem statement
- Proposed solution
- Alternatives considered
- Additional context

### Issue Template

```markdown
## Description
[Description of the issue]

## Steps to Reproduce (for bugs)
1. Step 1
2. Step 2
3. ...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., macOS 14]
- Device: [e.g., MacBook Pro]

## Additional Context
[Screenshots, logs, etc.]
```

---

## Questions?

Feel free to open an issue for questions or discussions about the project.

Thank you for contributing!
