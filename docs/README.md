# WebGPU Particle Fluid Simulation — Documentation Index

This directory keeps only the documentation that adds value beyond the README and the OpenSpec source of truth.

## Source of truth

The canonical project specs live in `openspec/specs/`:

| Document | Purpose |
|----------|---------|
| [Product Requirements](../openspec/specs/product/webgpu-particle-fluid-sim.md) | Functional and non-functional requirements |
| [Core Architecture RFC](../openspec/specs/rfc/0001-core-architecture.md) | Technical architecture decisions |
| [Implementation Tasks RFC](../openspec/specs/rfc/0002-implementation-tasks.md) | Historical implementation task record |
| [API Specification](../openspec/specs/api/typescript-interfaces.md) | Interface contracts and exposed types |
| [Testing Specification](../openspec/specs/testing/bdd-specifications.md) | BDD and verification expectations |

## Durable docs

| Document | Why it exists |
|----------|----------------|
| [API Reference](API.md) | Code-facing reference for modules, types, and runtime contracts |
| [Architecture Overview](architecture/README.md) | Shorter architecture map for readers who do not want the full RFC first |
| [Setup Guide](setup/README.md) | Local environment, LSP, editor, and hook setup |
| [Performance Guide](PERFORMANCE.md) | Practical profiling and tuning notes for the runtime |
| [Troubleshooting](TROUBLESHOOTING.md) | Runtime and browser problem-solving guide |
| [Workflow Guide](maintenance.md) | OpenSpec-first workflow, validation, review, and release hygiene |

## Reader paths

1. **Trying the project**: start with [README](../README.md) and the hosted demo.
2. **Understanding the implementation**: read [Architecture Overview](architecture/README.md), then the [Core Architecture RFC](../openspec/specs/rfc/0001-core-architecture.md).
3. **Making changes**: read [Setup Guide](setup/README.md), [Workflow Guide](maintenance.md), and [Contributing](../CONTRIBUTING.md).
4. **Checking expected behavior**: read the matching document in `openspec/specs/` before touching code.

## What was removed

This doc set intentionally avoids placeholder tutorial trees, empty asset guides, and duplicated process text. If a new document does not have a clear purpose that is not already covered by README, OpenSpec, or an existing reference doc, it should not be added.
