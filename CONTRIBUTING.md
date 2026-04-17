# Contributing Guide

Thank you for your interest in contributing to the WebGPU Particle Fluid Simulation project! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Spec-Driven Development](#spec-driven-development)
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
├── specs/                # Specification documents (Source of Truth)
│   ├── product/          # Product requirements (PRD)
│   ├── rfc/              # Technical design documents (RFCs)
│   ├── api/              # API specifications
│   ├── db/               # Database schema (N/A for this project)
│   └── testing/          # BDD test specifications
├── docs/                 # Documentation
│   ├── setup/            # Environment setup guides
│   ├── tutorials/        # User tutorials
│   ├── architecture/     # Architecture overview
│   ├── assets/           # Static assets
│   ├── API.md            # API reference
│   ├── PERFORMANCE.md    # Performance guide
│   └── TROUBLESHOOTING.md# Troubleshooting guide
├── src/                  # Source code
│   ├── config/           # Simulation configuration
│   ├── core/             # Core modules
│   └── shaders/          # WGSL shader files
├── .github/              # GitHub workflows and templates
├── AGENTS.md             # AI agent workflow for SDD
├── CONTRIBUTING.md       # This file
├── CHANGELOG.md          # Version history
└── LICENSE               # MIT License
```

---

## Spec-Driven Development

This project strictly follows **Spec-Driven Development (SDD)**. All code implementation must use the specification documents in the `/specs` directory as the **Single Source of Truth**.

### How to Participate in Spec Writing

#### 1. Understanding the Spec Directory Structure

| Directory | Purpose | When to Update |
|-----------|---------|----------------|
| `specs/product/` | Product requirements, user stories, acceptance criteria | Adding new features, changing behavior |
| `specs/rfc/` | Technical design, architecture decisions | Changing architecture, adding new systems |
| `specs/api/` | Interface contracts, type definitions | Changing public APIs |
| `specs/testing/` | BDD test specifications | Adding new test scenarios |
| `specs/db/` | Database schema (not applicable) | — |

#### 2. Spec-First Workflow

**Before writing any code**, follow this process:

```
┌─────────────────────────────────────────────────────────────┐
│                  Spec-Driven Development                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Review Specs                                        │
│  ├── Read relevant specs in /specs/                          │
│  ├── Identify conflicts with your proposed changes           │
│  └── Document gaps if spec is incomplete                     │
│                                                              │
│  Step 2: Update Specs First                                  │
│  ├── Create/modify spec document                             │
│  ├── Define acceptance criteria                              │
│  ├── Submit spec change for review                           │
│  └── Wait for spec approval                                  │
│                                                              │
│  Step 3: Implement Code                                      │
│  ├── Write code 100% following spec                          │
│  ├── No features beyond spec (No Gold-Plating)               │
│  └── Reference spec IDs in comments                          │
│                                                              │
│  Step 4: Test Against Spec                                   │
│  ├── Write tests for acceptance criteria                     │
│  ├── Cover all boundary conditions in spec                   │
│  └── Ensure tests validate spec requirements                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Writing Good Specs

**Product Requirements (PRD):**

```markdown
### REQ-X: Feature Name

**User Story:** As a [user], I want [goal] so that [benefit].

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-X.1 | The system SHALL... | High |
| REQ-X.2 | IF condition THEN system SHALL... | Medium |

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
```

**Technical Design (RFC):**

```markdown
## Overview
Brief description of the technical change.

## Design
Detailed technical design with diagrams.

## Decision Records
| Decision | Rationale |
|----------|-----------|
| Choice A | Because of B |

## Impact
- Performance: ...
- Compatibility: ...
```

#### 4. Spec Review Process

1. **Create spec PR first** - Before code implementation
2. **Discuss and iterate** - Specs are contracts, get them right
3. **Approve spec** - At least one maintainer approval
4. **Merge spec** - Then begin code implementation
5. **Reference spec in code PR** - Link to the approved spec

### When to Update Specs

| Change Type | Spec Update Required |
|-------------|---------------------|
| New feature | Yes — Product + RFC |
| Bug fix | No — Unless behavior was underspecified |
| Refactoring | No — Unless architecture changes |
| Performance improvement | Maybe — If technique changes |
| Documentation | No |
| Test additions | Maybe — If adding new test specifications |

### Spec Conflict Resolution

If you find a conflict between spec and existing code:

1. **Document the conflict** - Open an issue describing the discrepancy
2. **Determine correct behavior** - Discuss with maintainers
3. **Update either spec or code** - Whichever is correct
4. **Never silently diverge** - Always resolve conflicts

---

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
- `spec/` — Specification updates

### 2. Follow SDD Workflow

1. **Read specs** in `/specs/` directory
2. **Update specs first** if needed
3. **Implement code** following spec definitions
4. **Write tests** based on acceptance criteria

### 3. Make Your Changes

- Follow the [Code Style](#code-style) guidelines
- Add tests for new functionality
- Update documentation as needed
- Keep changes focused and atomic

### 4. Verify Your Changes

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

### 5. Commit Your Changes

Follow the [Commit Convention](#commit-convention) guidelines.

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub.

---

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

### Mapping Tests to Specs

Reference spec requirements in your tests:

```typescript
describe('REQ-3.2: Boundary Bounce', () => {
  it('should reverse velocity when particle exceeds canvas bounds', () => {
    // Validates: REQ-3.2
  });
});
```

---

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

---

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
| `spec` | Specification updates |

### Examples

```bash
feat(quality): add viewport-based particle scaling
fix(physics): correct boundary bounce damping calculation
docs(api): document createRenderer function
test(color): add property tests for velocityToColor
refactor(buffers): extract buffer validation to separate function
spec(product): add REQ-9 for touch gesture support
```

### Breaking Changes

```bash
feat(api)!: change createPipelines signature

BREAKING CHANGE: createPipelines now requires format parameter
```

---

## Pull Request Process

### Before Submitting

- [ ] Specs updated if applicable (spec changes first!)
- [ ] All tests pass (`npm test`)
- [ ] Code is linted (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention
- [ ] PR references relevant spec documents

### PR Title

Use the same format as commit messages:

```
feat(scope): brief description
```

### PR Description

Include:

1. **What** — Description of changes
2. **Why** — Motivation/context
3. **Specs** — Link to relevant spec documents
4. **How** — Implementation approach (if non-trivial)
5. **Testing** — How you tested the changes
6. **Screenshots** — For UI changes

### Review Process

1. Spec changes reviewed and approved first (if applicable)
2. Automated checks must pass (CI)
3. At least one approval required
4. Resolve all review comments
5. Squash and merge preferred

---

## Issue Guidelines

### Bug Reports

Include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Console errors
- Reference to spec if behavior is defined there

### Feature Requests

Include:

- Use case / problem statement
- Proposed solution
- Reference to existing spec or propose new spec location
- Alternatives considered
- Additional context

### Issue Template

```markdown
## Description
[Description of the issue]

## Related Spec
[Link to relevant spec document, if exists]

## Steps to Reproduce (for bugs)
1. Step 1
2. Step 2
3. ...

## Expected Behavior
[What should happen according to spec]

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

For more details on the Spec-Driven Development workflow, see [AGENTS.md](AGENTS.md).

Thank you for contributing!
