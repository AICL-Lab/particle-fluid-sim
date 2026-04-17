# Database Schema Specification

> **Status:** Not Applicable
> **Version:** 2.0.0
> **Last Updated:** 2026-04-17

## Overview

The WebGPU Particle Fluid Simulation is a **client-side WebGPU application** that does not require a traditional database backend. All simulation state is maintained in GPU buffers and browser memory.

---

## Data Persistence Strategy

### Current State

| Aspect | Implementation |
|--------|---------------|
| Particle State | GPU Storage Buffer (volatile) |
| Configuration | Hardcoded in `src/config/sim.ts` |
| User Preferences | Not implemented |

### Potential Future Persistence

If state persistence is implemented in the future (see FUT-4 in Product Requirements), consider:

#### Local Storage Schema

```typescript
interface StoredSimulationState {
  version: string;
  timestamp: number;
  config: {
    particleCount: number;
    gravity: { x: number; y: number };
    trailFadeAlpha: number;
  };
  particles: Particle[];  // Only for small counts
}
```

#### IndexedDB Schema (for large particle counts)

```typescript
// Database: particle-sim-v1
// Object Store: simulation-states

interface SimulationStateRecord {
  id: string;
  name: string;
  createdAt: number;
  particleCount: number;
  // Particles stored as compressed ArrayBuffer
}
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Runtime                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐     ┌────────────────┐                  │
│  │  GPU Device    │────▶│ Storage Buffer │  (Particle data) │
│  └────────────────┘     └────────────────┘                  │
│         │                        │                          │
│         │                        ▼                          │
│         │              ┌────────────────┐                   │
│         │              │  Compute Pass  │  (Physics)        │
│         │              └────────────────┘                   │
│         │                        │                          │
│         ▼                        ▼                          │
│  ┌────────────────┐     ┌────────────────┐                  │
│  │ Uniform Buffer │────▶│  Render Pass   │  (Display)       │
│  └────────────────┘     └────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## No Database Required

This section intentionally left as a placeholder for consistency with the Spec-Driven Development directory structure. For this project:

- No server-side database
- No ORM or query language
- No migrations
- No schema versioning

---

## Related Documents

- [Product Requirements](../product/webgpu-particle-fluid-sim.md) - FUT-4: State Persistence
- [Core Architecture RFC](../rfc/0001-core-architecture.md) - Data Layout
