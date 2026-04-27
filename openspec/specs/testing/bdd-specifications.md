# Testing Specification: WebGPU Particle Fluid Simulation

> **Status:** Stable
> **Version:** 2.0.0
> **Last Updated:** 2026-04-17

## Overview

This document defines the BDD (Behavior-Driven Development) test specifications for the WebGPU Particle Fluid Simulation. Tests are implemented using Vitest with fast-check for property-based testing.

---

## Test Architecture

### Testing Framework

- **Vitest**: Main test runner
- **fast-check**: Property-based testing library
- **Coverage**: c8 via Vitest

### Test Structure

```
src/
├── config/
│   └── sim.test.ts         # Configuration validation
├── core/
│   ├── buffers.test.ts     # Buffer management tests
│   ├── color.test.ts       # Color mapping tests
│   ├── physics.test.ts     # Physics calculation tests
│   └── quality.test.ts     # Quality heuristics tests
└── types.test.ts           # Type validation tests
```

---

## Feature: WebGPU Initialization

### Scenario: Successful WebGPU initialization

```gherkin
Feature: WebGPU Initialization

  Scenario: WebGPU is supported and initialization succeeds
    Given a browser with WebGPU support
    And a canvas element exists in the DOM
    When initWebGPU is called
    Then it should return a valid GPUDevice
    And it should return a valid GPUCanvasContext
    And it should return a valid texture format

  Scenario: WebGPU is not supported
    Given a browser without WebGPU support
    When initWebGPU is called
    Then it should throw an error with type 'NOT_SUPPORTED'
    And the error message should suggest Chrome/Edge 113+

  Scenario: GPU adapter is unavailable
    Given WebGPU is supported
    But GPU adapter request fails
    When initWebGPU is called
    Then it should throw an error with type 'ADAPTER_UNAVAILABLE'
```

---

## Feature: Particle Data Management

### Scenario: Particle buffer creation

```gherkin
Feature: Particle Buffer Management

  Scenario: Create particle buffer with default count
    Given a valid GPUDevice
    And particle count is 10000
    When createParticleBuffer is called
    Then buffer size should be 160000 bytes (10000 × 16 bytes)
    And buffer usage should include STORAGE and COPY_DST

  Scenario: Initialize particles within bounds
    Given a particle buffer
    And canvas dimensions of 1920×1080
    When initializeParticles is called
    Then all particle positions should be within [0, width] × [0, height]
    And all particle velocities should be initialized to zero

  Property: Particle positions are uniformly distributed
    For all particles initialized
    Position X should be within [0, canvasWidth]
    Position Y should be within [0, canvasHeight]
```

---

## Feature: Particle Physics

### Scenario: Gravity application

```gherkin
Feature: Particle Physics

  Scenario: Apply gravity to stationary particle
    Given a particle with velocity (0, 0)
    And gravity is (0, 600) px/s²
    And delta time is 0.016 seconds
    When applyGravity is called
    Then velocity should be (0, 9.6) px/s

  Scenario: Velocity clamping
    Given a particle with velocity (1000, 1000)
    And MAX_SPEED is 800
    When clampVelocity is called
    Then velocity magnitude should be exactly 800
    And velocity direction should be preserved

  Scenario: Boundary bounce with damping
    Given a particle at position (-5, 100)
    With velocity (-100, 50)
    And canvas width is 800
    When bounce is applied
    Then particle position should be clamped to [0, width]
    And velocity X should be reversed with damping applied
```

### Property-Based Tests

```typescript
// Physics Integration Property
fc.property(
  fc.record({ x: fc.float(), y: fc.float() }), // position
  fc.record({ x: fc.float(), y: fc.float() }), // velocity
  fc.float({ min: 0.001, max: 0.1 }), // deltaTime
  (position, velocity, dt) => {
    // After physics update:
    // 1. Position should have changed
    // 2. Velocity should be clamped to MAX_SPEED
    // 3. Position should be within bounds after bounce
  }
);

// Boundary Bounce Property
fc.property(
  fc.float(), // position
  fc.float(), // velocity
  fc.float({ min: 0, max: 1000 }), // min bound
  fc.float({ min: 1000, max: 2000 }), // max bound
  (pos, vel, min, max) => {
    // After bounce:
    // Position should be within [min, max]
    // Velocity should be reversed if out of bounds
    // Energy should be reduced by damping factor
  }
);
```

---

## Feature: Mouse Interaction

### Scenario: Repulsion force application

```gherkin
Feature: Mouse Repulsion

  Scenario: Particle within repulsion radius
    Given a particle at position (500, 500)
    And mouse at position (450, 500)
    And REPULSION_RADIUS is 200
    When applyRepulsion is called
    Then particle should be pushed away from mouse
    And force should be inversely proportional to distance

  Scenario: Particle outside repulsion radius
    Given a particle at position (500, 500)
    And mouse at position (0, 0)
    And REPULSION_RADIUS is 200
    When applyRepulsion is called
    Then particle velocity should be unchanged

  Scenario: HiDPI coordinate mapping
    Given devicePixelRatio is 2
    And mouse event clientX/Y is (100, 100)
    When coordinates are mapped to canvas
    Then canvas coordinates should be (200, 200)
```

---

## Feature: Color Mapping

### Scenario: Velocity to color conversion

```gherkin
Feature: Velocity-Based Color Mapping

  Scenario: Stationary particle color
    Given a particle with velocity magnitude 0
    When velocityToColor is called
    Then color should be cyan (R=0, G=1, B=1)

  Scenario: Maximum speed particle color
    Given a particle with velocity magnitude MAX_SPEED
    When velocityToColor is called
    Then color should be purple (R=0.5, G=0, B=1)

  Scenario: Intermediate velocity color
    Given a particle with velocity magnitude MAX_SPEED/2
    When velocityToColor is called
    Then color should be interpolated between cyan and purple
    And brightness should be proportional to speed
```

### Property-Based Tests

```typescript
// Color Mapping Property
fc.property(
  fc.float({ min: -1000, max: 1000 }), // vx
  fc.float({ min: -1000, max: 1000 }), // vy
  (vx, vy) => {
    const color = velocityToColor({ x: vx, y: vy });
    // All RGB values should be in [0, 1]
    // Brightness should increase with speed
    // Color should never exceed valid range
  }
);
```

---

## Feature: Adaptive Quality System

### Scenario: Device capability detection

```gherkin
Feature: Adaptive Quality

  Scenario: High-end device
    Given hardwareConcurrency is 8
    And deviceMemory is 16
    And isFallbackAdapter is false
    And viewportPixels is 2073600 (1920×1080)
    When calculateQuality is called
    Then particle count should be 10000
    And quality tier should be 'high'

  Scenario: Low-end device with fallback adapter
    Given hardwareConcurrency is 2
    And deviceMemory is 2
    And isFallbackAdapter is true
    When calculateQuality is called
    Then particle count should be reduced to 40% or less
    And quality tier should be 'low'

  Scenario: 4K viewport
    Given viewportPixels is 8294400 (3840×2160)
    When calculateQuality is called
    Then particle count should be scaled down to 65%
```

---

## Feature: Render Loop

### Scenario: Frame timing

```gherkin
Feature: Render Loop

  Scenario: Frame delta time calculation
    Given previous frame timestamp is 0
    And current frame timestamp is 16.67ms
    When delta time is calculated
    Then delta time should be 0.01667 seconds

  Scenario: Delta time clamping
    Given frame drop causing 200ms gap
    When delta time is calculated
    Then delta time should be clamped to maximum of 100ms
    And physics should remain stable
```

---

## Test Coverage Requirements

| Module            | Minimum Coverage | Target |
| ----------------- | ---------------- | ------ |
| `config/sim.ts`   | 80%              | 90%    |
| `core/buffers.ts` | 85%              | 95%    |
| `core/color.ts`   | 90%              | 95%    |
| `core/physics.ts` | 95%              | 98%    |
| `core/quality.ts` | 85%              | 90%    |

---

## Test Execution

### Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npx vitest run src/core/physics.test.ts
```

### CI Integration

Tests are automatically run in GitHub Actions CI pipeline:

- On every push to `master` branch
- On every Pull Request
- Coverage report is uploaded as artifact

---

## Verification Matrix

| Requirement      | Test File         | Property/Function              |
| ---------------- | ----------------- | ------------------------------ |
| REQ-2.3          | `buffers.test.ts` | Particle Initialization Bounds |
| REQ-3.1, REQ-3.4 | `physics.test.ts` | Physics Update Correctness     |
| REQ-3.2          | `physics.test.ts` | Boundary Bounce Behavior       |
| REQ-4.2, REQ-4.3 | `physics.test.ts` | Repulsion Force Application    |
| REQ-5.2, REQ-5.3 | `color.test.ts`   | Velocity-Based Color Mapping   |
| REQ-8.1-8.4      | `quality.test.ts` | Adaptive Quality Scaling       |

---

## Test Data Fixtures

### Standard Test Scenarios

```typescript
const testFixtures = {
  // Standard canvas size
  canvasSize: { width: 1920, height: 1080 },

  // Standard mouse positions
  mouseCenter: { x: 960, y: 540 },
  mouseCorner: { x: 0, y: 0 },

  // Standard particles
  stationaryParticle: { x: 500, y: 500, vx: 0, vy: 0 },
  fastMovingParticle: { x: 500, y: 500, vx: 500, vy: 500 },

  // Time steps
  normalDelta: 0.01667, // ~60 FPS
  slowDelta: 0.03333, // ~30 FPS
  extremeDelta: 0.1, // Frame drop
};
```

---

## Maintenance

When adding new features:

1. Write test specification first (this file)
2. Implement property-based tests
3. Ensure coverage meets minimum requirements
4. Update verification matrix if adding new requirements
