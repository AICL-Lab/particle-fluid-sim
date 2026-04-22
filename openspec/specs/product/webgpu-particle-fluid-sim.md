# Product Requirements: WebGPU Particle Fluid Simulation

> **Status:** Stable — Maintenance Mode
> **Last Updated:** 2026-04-16
> **Version:** 2.0.0

## Introduction

A high-performance particle fluid simulation using WebGPU and TypeScript. The system leverages GPU compute shaders for real-time physics simulation of thousands of particles, featuring boundary bounce, mouse repulsion, and visual trails.

---

## Glossary

| Term | Definition |
|------|------------|
| **WebGPU Context** | The combination of GPUAdapter, GPUDevice, and GPUCanvasContext used for WebGPU operations |
| **Particle Buffer** | GPU storage buffer containing position and velocity data for all particles |
| **Uniform Buffer** | GPU buffer containing global parameters (canvas size, mouse position, delta time) |
| **Compute Pass** | GPU pass that executes compute shaders for parallel physics calculation |
| **Render Pass** | GPU pass that executes graphics pipelines for drawing |
| **Trail Texture** | Offscreen texture used to accumulate and fade particle positions |

---

## Functional Requirements

### REQ-1: WebGPU Initialization

**User Story:** As a user, I want the application to initialize WebGPU properly so I can view the simulation.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-1.1 | The system SHALL request and obtain a GPU adapter and device | High |
| REQ-1.2 | The system SHALL configure the canvas context with the preferred format | High |
| REQ-1.3 | The system SHALL make the canvas fullscreen and responsive to window resize | High |
| REQ-1.4 | IF WebGPU is not supported, the system SHALL display a clear error message | High |

### REQ-2: Particle Data Management

**User Story:** As a developer, I want efficient GPU particle data management for real-time simulation.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-2.1 | The system SHALL create a particle buffer with capacity for up to 10,000 particles | High |
| REQ-2.2 | Each particle SHALL store position (x, y) and velocity (vx, vy) as 32-bit floats | High |
| REQ-2.3 | Particles SHALL be initialized with random positions within canvas bounds | High |
| REQ-2.4 | The uniform buffer SHALL store canvas dimensions, mouse position, and delta time | High |

### REQ-3: Particle Physics

**User Story:** As a user, I want particles to move realistically with proper physics.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-3.1 | The compute shader SHALL update particle positions using velocity and delta time | High |
| REQ-3.2 | Particles exceeding canvas bounds SHALL bounce with velocity damping | High |
| REQ-3.3 | The compute shader SHALL use workgroup_size(64) for efficient parallel execution | Medium |
| REQ-3.4 | The system SHALL apply constant downward gravity to particle velocities | High |
| REQ-3.5 | Particle velocities SHALL be clamped to a maximum speed | High |

### REQ-4: Mouse Interaction

**User Story:** As a user, I want to interact with particles using my mouse cursor.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-4.1 | The system SHALL update mouse position in the uniform buffer on mouse/touch events | High |
| REQ-4.2 | Particles within the repulsion radius of the cursor SHALL be pushed away | High |
| REQ-4.3 | The repulsion force SHALL be inversely proportional to distance from cursor | High |
| REQ-4.4 | Mouse coordinates SHALL account for devicePixelRatio (HiDPI support) | Medium |

### REQ-5: Particle Rendering

**User Story:** As a user, I want to see particles rendered with visual appeal.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-5.1 | Each particle SHALL be rendered as a single point primitive | High |
| REQ-5.2 | Particle color SHALL be based on velocity magnitude | High |
| REQ-5.3 | Color SHALL interpolate from cyan (slow) to purple (fast) | Medium |
| REQ-5.4 | Particle brightness SHALL increase with velocity | Medium |

### REQ-6: Trail Effect

**User Story:** As a user, I want particles to leave motion trails for visual appeal.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-6.1 | The system SHALL maintain an offscreen texture for trail accumulation | High |
| REQ-6.2 | Each frame SHALL fade the trail texture with a semi-transparent black overlay | High |
| REQ-6.3 | Particles SHALL be rendered into the trail texture, accumulating over frames | High |
| REQ-6.4 | The final frame SHALL composite the trail texture to the canvas | High |

### REQ-7: Render Loop

**User Story:** As a user, I want a smooth and stable animation.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-7.1 | The system SHALL use requestAnimationFrame for the render loop | High |
| REQ-7.2 | Each frame SHALL execute: Compute → Trail → Render → Present passes | High |
| REQ-7.3 | The system SHALL use frame delta time for physics calculation | High |
| REQ-7.4 | Delta time SHALL be clamped to prevent physics explosion on frame drops | Medium |

### REQ-8: Adaptive Quality

**User Story:** As a user with a low-end device, I want the simulation to run smoothly.

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-8.1 | The system SHALL detect device capabilities at startup | Medium |
| REQ-8.2 | Particle count SHALL scale based on device memory and CPU cores | Medium |
| REQ-8.3 | Fallback adapter detection SHALL reduce particle count | Medium |
| REQ-8.4 | Viewport size SHALL affect particle count scaling | Low |

---

## Non-Functional Requirements

### Performance

| ID | Requirement |
|----|-------------|
| NFR-1 | The simulation SHALL maintain 60 FPS on mid-range devices |
| NFR-2 | Frame time SHALL not exceed 50ms on low-end devices |
| NFR-3 | Memory usage SHALL stay within GPU buffer limits |

### Compatibility

| ID | Requirement |
|----|-------------|
| NFR-4 | The system SHALL support Chrome 113+, Edge 113+, Safari 17+ |
| NFR-5 | The system SHALL display appropriate error messages for unsupported browsers |

### Code Quality

| ID | Requirement |
|----|-------------|
| NFR-6 | All core physics functions SHALL have property-based tests |
| NFR-7 | TypeScript SHALL be configured with strict mode |
| NFR-8 | Code SHALL pass ESLint with zero errors |

---

## Acceptance Criteria Summary

| Category | Criteria |
|----------|----------|
| **Functionality** | All REQ-1 through REQ-8 implemented and tested |
| **Performance** | 60 FPS on reference hardware (10K particles) |
| **Quality** | All tests pass, no linting errors |
| **Documentation** | README, API docs, and code comments complete |

---

## Verification Matrix

| Requirement | Test File | Property/Function |
|-------------|-----------|-------------------|
| REQ-2.3 | `buffers.test.ts` | Particle Initialization Bounds |
| REQ-3.1, REQ-3.4 | `physics.test.ts` | Physics Update Correctness |
| REQ-3.2 | `physics.test.ts` | Boundary Bounce Behavior |
| REQ-4.2, REQ-4.3 | `physics.test.ts` | Repulsion Force Application |
| REQ-5.2, REQ-5.3 | `color.test.ts` | Velocity-Based Color Mapping |
| REQ-8.1-8.4 | `quality.test.ts` | Adaptive Quality Scaling |

---

## Future Enhancements

Potential future requirements to consider:

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FUT-1 | SPH fluid dynamics | Low | Would require major architecture changes |
| FUT-2 | WebXR support | Low | VR/AR viewing capability |
| FUT-3 | Custom shaders | Medium | User-provided particle behaviors |
| FUT-4 | State persistence | Low | Save/load simulation state |
