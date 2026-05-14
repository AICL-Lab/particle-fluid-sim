# Performance Guide

Practical performance considerations for the particle simulation.

## What Matters Most

The biggest performance-sensitive areas:

1. **Compute pass** - GPU physics in `compute.wgsl`
2. **Render pass** - GPU drawing in `render.wgsl`
3. **Frame orchestration** - CPU side in `renderer.ts`
4. **Quality selection** - Adaptive scaling in `quality.ts`

## Runtime Design Choices

| Choice                   | Why It Matters                     |
| ------------------------ | ---------------------------------- |
| Workgroup size 64        | Optimal for most GPU architectures |
| Shared shader preambles  | Prevents constant drift            |
| Persistent trail texture | No per-frame allocation            |
| Adaptive particle count  | Graceful degradation               |
| Uniform buffer reuse     | Predictable CPU overhead           |

## Measuring Performance

### Development HUD

The built-in HUD shows:

- Current FPS
- Particle count
- Quality tier

### Browser DevTools

1. Open DevTools (F12)
2. Go to Performance tab
3. Record a few seconds of interaction
4. Analyze for long frames or GPU stalls

### What to Compare

When claiming a performance improvement:

- Same browser
- Same viewport size
- Same particle tier
- Same interaction pattern

## High-Risk Changes

### Shader Modifications

- Affects both performance and correctness
- Keep CPU reference aligned with WGSL
- Re-run physics tests after changes

### Renderer Changes

- Avoid per-frame allocations
- Be careful with trail texture lifecycle
- Reuse resources unless canvas resizes

### Quality Heuristics

- Particle scaling affects stability
- Prefer predictable caps over complex heuristics

## Performance Checklist

Before merging performance-sensitive changes:

1. Verify OpenSpec requirements still met
2. Check quality tier hasn't changed unexpectedly
3. Inspect for per-frame resource creation
4. Run `npm run verify`
5. Test on multiple devices if material change

## Particle Count Impact

| Particles | Compute Time | Render Time | Total Frame |
| --------- | ------------ | ----------- | ----------- |
| 2,500     | ~0.5ms       | ~0.3ms      | ~1-2ms      |
| 5,000     | ~1.5ms       | ~0.6ms      | ~3-4ms      |
| 10,000    | ~3ms         | ~1ms        | ~5-6ms      |

\*Typical on mid-range GPU

## Non-Goals

This project optimizes for:

- Stable, predictable performance
- Low maintenance burden
- Good experience across devices

Not for:

- Synthetic benchmark scores
- Maximum theoretical FPS
