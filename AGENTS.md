# OpenSpec AI Agent Guide

> **Project**: WebGPU Particle Fluid Simulation
> **Version**: 2.0.0
> **Last Updated**: 2026-04-23

This project uses **OpenSpec** for specification-driven development. All code must follow specs in `openspec/specs/` as the single source of truth.

---

## OpenSpec Commands

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Create a change proposal with specs, design, and tasks |
| `/opsx:apply` | Implement tasks from a change proposal |
| `/opsx:archive` | Archive completed change, merge delta specs |
| `/opsx:explore` | Unstructured investigation and research |

---

## Workflow

### For New Features

1. **Propose the change**
   ```
   /opsx:propose add-feature-name
   ```
   This creates `openspec/changes/add-feature-name/` with:
   - `proposal.md` - Why & what
   - `specs/` - Delta specs (ADDED/MODIFIED/REMOVED)
   - `design.md` - Technical approach
   - `tasks.md` - Implementation checklist

2. **Implement the change**
   ```
   /opsx:apply add-feature-name
   ```

3. **Archive when complete**
   ```
   /opsx:archive add-feature-name
   ```

### For Bug Fixes

Use judgment based on complexity:
- **Simple fix** → Direct fix with test
- **Complex fix affecting specs** → Create change proposal

---

## Spec Paths

| Spec | Path |
|------|------|
| Product Requirements | `openspec/specs/product/webgpu-particle-fluid-sim.md` |
| Core Architecture | `openspec/specs/rfc/0001-core-architecture.md` |
| Implementation Tasks | `openspec/specs/rfc/0002-implementation-tasks.md` |
| TypeScript Interfaces | `openspec/specs/api/typescript-interfaces.md` |
| BDD Specifications | `openspec/specs/testing/bdd-specifications.md` |

---

## ID Reference Format

This project uses structured IDs for traceability:

| Prefix | Pattern | Example |
|--------|---------|---------|
| REQ | `REQ-X.Y` | REQ-3.2 (Boundary Bounce) |
| TASK | `TASK-X.Y` | TASK-4.1 (Compute Shader) |
| NFR | `NFR-X` | NFR-1 (60 FPS Target) |
| FUT | `FUT-X` | FUT-1 (SPH Fluid Dynamics) |

---

## Core Principles

1. **Specs are Single Source of Truth** — All code follows specs
2. **Change Proposals First** — For new features, create `/opsx:propose` first
3. **No Gold-Plating** — Only implement what specs define
4. **Test Against Acceptance Criteria** — Specs define test requirements

---

## OpenSpec Directory Structure

```
openspec/
├── specs/                    # Current specifications (source of truth)
│   ├── product/              # Product requirements
│   ├── rfc/                  # Technical design documents
│   ├── api/                  # API specifications
│   └── testing/              # BDD test specifications
├── changes/                  # Active change proposals
│   └── archive/              # Completed changes
└── config.yaml               # Project configuration
```

---

## AI Agent Workflow Instructions

When asked to develop a new feature, modify existing functionality, or fix a bug, **follow this workflow strictly**:

### Step 1: Review Specs (审查规范)

- Before writing any code, read relevant specs in `openspec/specs/`
- If user instructions conflict with existing specs, stop and point out the conflict

### Step 2: Spec-First Update (规范优先)

- For new features or interface changes, **propose spec changes first**
- Wait for user confirmation before proceeding to implementation

### Step 3: Implementation (代码实现)

- Write code that 100% follows spec definitions
- No gold-plating — only implement what specs define

### Step 4: Test Validation (测试验证)

- Write tests based on acceptance criteria in specs
- Ensure tests cover all boundary conditions defined in specs

---

## Validation Order

Per CI: `lint → typecheck → test:coverage → build`

---

## Commands

| Command | Notes |
|---------|-------|
| `npm run dev` | Dev server at :5173 |
| `npm run build` | `tsc && vite build` (typecheck included) |
| `npm test` | Vitest with happy-dom |
| `npm run typecheck` | Standalone type check |
| `npm run lint` | ESLint on src/ |

---

## Project Notes

- **WGSL shaders** in `src/shaders/` are imported as assets (Vite config)
- **Tests colocated** with source: `*.test.ts` alongside `*.ts`
- **Property-based testing** uses fast-check; tests have 2min timeout
- **Node 18+** required
- **WebGPU required** — no WebGL fallback

---

*This file is the AI agent configuration for OpenSpec-driven development. Do not remove.*
