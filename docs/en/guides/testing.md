# Testing Guide

How to test the WebGPU Particle Fluid Simulation codebase.

## Test Framework

The project uses **Vitest** for unit testing and **fast-check** for property-based testing.

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (TDD)
npm run test:watch

# With coverage report
npm run test:coverage

# Interactive UI
npm run test:ui
```

## Test Structure

Tests are colocated with source files:

```
src/core/
├── buffers.ts
├── buffers.test.ts
├── color.ts
├── color.test.ts
├── physics.ts
├── physics.test.ts
└── quality.ts
    └── quality.test.ts
```

## Property-Based Testing

The project uses **fast-check** for property-based tests:

### Example: Particle Bounds

```typescript
import * as fc from 'fast-check';
import { initializeParticles } from './buffers';

test('particles are initialized within canvas bounds', () => {
  fc.assert(
    fc.property(
      fc.record({
        width: fc.integer({ min: 100, max: 2000 }),
        height: fc.integer({ min: 100, max: 2000 }),
      }),
      fc.integer({ min: 100, max: 10000 }),
      (canvasSize, count) => {
        const particles = initializeParticles(canvasSize, count);
        // All particles should be within bounds
        for (let i = 0; i < count; i++) {
          const x = particles[i * 4];
          const y = particles[i * 4 + 1];
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThan(canvasSize.width);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThan(canvasSize.height);
        }
      }
    )
  );
});
```

## Test Categories

### Physics Tests

| Property            | Validates                               |
| ------------------- | --------------------------------------- |
| Particle bounds     | All particles within canvas             |
| Physics integration | Position/velocity updates match formula |
| Boundary bounce     | Correct reflection with damping         |
| Velocity clamping   | Speed ≤ MAX_SPEED                       |

### Color Tests

| Property      | Validates                |
| ------------- | ------------------------ |
| RGB range     | All components in [0, 1] |
| Speed mapping | Faster = more purple     |

### Quality Tests

| Property            | Validates                 |
| ------------------- | ------------------------- |
| Scale limits        | Output within valid range |
| Tier classification | Correct tier assignment   |

## Test Configuration

`vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
```

## Writing New Tests

### Unit Test Pattern

```typescript
import { describe, it, expect } from 'vitest';

describe('ModuleName', () => {
  it('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = doSomething(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### Property Test Pattern

```typescript
import * as fc from 'fast-check';

test('property description', () => {
  fc.assert(
    fc.property(
      fc.integer(), // arbitrary input
      (value) => {
        // Property that should always hold
        expect(function(value)).toBe(true);
      }
    ),
    { numRuns: 100 }
  );
});
```

## Coverage Goals

| Category   | Target |
| ---------- | ------ |
| Statements | 80%+   |
| Branches   | 75%+   |
| Functions  | 85%+   |
| Lines      | 80%+   |

Run coverage to see current status:

```bash
npm run test:coverage
```
