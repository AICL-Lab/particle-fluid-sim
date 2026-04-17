# Tutorials

> **Version**: 2.0.0 | **Last Updated**: 2026-04-17

Welcome to the WebGPU Particle Fluid Simulation tutorials. These guides will help you understand and use the simulation effectively.

---

## Getting Started

### For Users

1. **[Basic Usage](./basic-usage.md)** - How to run and interact with the simulation
2. **[Understanding the Simulation](./understanding-simulation.md)** - Learn about physics and visual effects

### For Developers

1. **[Development Setup](../setup/README.md)** - Set up your development environment
2. **[Modifying Parameters](./modifying-parameters.md)** - Customize simulation behavior
3. **[Adding Features](./adding-features.md)** - Extend the simulation

---

## Tutorial List

| Tutorial | Difficulty | Description |
|----------|------------|-------------|
| [Basic Usage](./basic-usage.md) | 🟢 Beginner | Run and interact with the simulation |
| [Understanding Simulation](./understanding-simulation.md) | 🟢 Beginner | Learn physics and visual concepts |
| [Modifying Parameters](./modifying-parameters.md) | 🟡 Intermediate | Customize simulation behavior |
| [Adding Features](./adding-features.md) | 🔴 Advanced | Extend the simulation with new features |

---

## Quick Tutorial: Basic Usage

### Running the Simulation

1. Open the [Live Demo](https://lessup.github.io/particle-fluid-sim/) or run locally
2. The simulation starts automatically with 10,000 particles

### Mouse Interaction

| Action | Effect |
|--------|--------|
| Move mouse over canvas | Particles are pushed away from cursor |
| Move mouse quickly | Creates wave-like patterns |
| Move mouse in circles | Creates swirling vortex effects |

### Visual Effects

- **Color Gradient**: Particles change color based on speed
  - Cyan = Slow moving
  - Purple = Fast moving
- **Trail Effect**: Particles leave fading trails showing their path

---

## Quick Tutorial: Modifying Parameters

The simulation behavior can be customized by editing `src/config/sim.ts`:

### Change Gravity

```typescript
// Default: downward gravity
GRAVITY: { x: 0, y: 600 }

// Try: no gravity (floating)
GRAVITY: { x: 0, y: 0 }

// Try: sideways gravity
GRAVITY: { x: 300, y: 0 }
```

### Change Particle Count

```typescript
// Default
PARTICLE_COUNT: 10000

// Lower count for better performance
PARTICLE_COUNT: 5000
```

### Change Trail Persistence

```typescript
// Default: 5% fade per frame
TRAIL_FADE_ALPHA: 0.05

// Longer trails (slower fade)
TRAIL_FADE_ALPHA: 0.02

// Shorter trails (faster fade)
TRAIL_FADE_ALPHA: 0.1
```

---

## Learning Path

```
┌─────────────────────────────────────────────────────────────┐
│                    Learning Path                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Basic Usage ────▶ 2. Understanding ────▶ 3. Modify      │
│     (User)              Simulation           Parameters      │
│                                                              │
│                          ▼                                   │
│                                                              │
│                    4. Adding Features                        │
│                     (Developer)                              │
│                                                              │
│                          ▼                                   │
│                                                              │
│                    5. Contributing                           │
│                     (Contributor)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Additional Resources

- [API Reference](../API.md) - Complete technical documentation
- [Performance Guide](../PERFORMANCE.md) - Optimization tips
- [Troubleshooting](../TROUBLESHOOTING.md) - Common issues
- [Contributing Guide](../../CONTRIBUTING.md) - How to contribute

---

## Need Help?

- **Bug Reports**: [GitHub Issues](https://github.com/LessUp/particle-fluid-sim/issues)
- **Questions**: [GitHub Discussions](https://github.com/LessUp/particle-fluid-sim/discussions)
