# Performance Guide

This document focuses on practical performance work for the current codebase. It intentionally avoids fabricated benchmark tables and instead records what to measure, where the hot paths are, and what changes are risky.

## What matters most

The project targets a smooth interactive experience at the highest particle count the device can sustain. The biggest performance-sensitive areas are:

1. **Compute pass cost** in `compute.wgsl`
2. **Render pass cost** in `render.wgsl`
3. **CPU-side frame orchestration** in `src/core/renderer.ts`
4. **Adaptive quality selection** in `src/core/quality.ts`

## Runtime design choices that protect performance

| Choice | Why it matters |
|--------|----------------|
| Workgroup size of `64` | Keeps compute shader dispatch aligned with the current design |
| Shared shader preambles | Prevents constant drift between TypeScript and WGSL |
| Persistent trail texture | Avoids per-frame texture allocation |
| Adaptive particle count | Prevents low-end devices from running the full 10K path |
| Uniform buffer reuse | Keeps CPU-side uploads small and predictable |

## How to measure

### Local development

```bash
npm run dev
```

Use the built-in HUD in the app to watch:

- FPS
- selected particle count
- quality tier

### Browser tools

Use browser performance tools when changing renderer, pipeline, or shader behavior:

1. Open DevTools
2. Record a few seconds of interaction
3. Look for long frames, GPU stalls, or repeated allocations
4. Re-test after changes, not just before them

### What to compare

When claiming a performance improvement, compare:

- same browser,
- same viewport size,
- same particle tier,
- same interaction pattern.

## High-risk changes

These changes are easy to make incorrectly:

### Shader changes

- Any change to compute behavior can affect both performance and correctness.
- Keep the CPU reference implementation aligned with WGSL logic.
- Re-run the physics and renderer tests after shader-adjacent changes.

### Renderer changes

- Avoid per-frame allocations in `renderer.ts`.
- Be careful when touching trail texture lifecycle or pass ordering.
- Reuse resources unless the canvas size changes.

### Quality heuristics

- Particle scaling affects both stability and user perception.
- Prefer predictable caps over clever heuristics that are hard to reason about.

## Practical tuning checklist

Before merging a performance-sensitive change:

1. Confirm the change still follows the relevant OpenSpec requirements.
2. Check whether the quality tier or particle count changed unintentionally.
3. Inspect whether any resource is now recreated every frame.
4. Re-run `npm run verify`.
5. If the change is material, run a review pass before merging.

## Non-goals

This guide is not trying to optimize for synthetic benchmark leaderboards. The goal is a stable, well-understood, maintenance-friendly runtime that still feels good in the browser.
