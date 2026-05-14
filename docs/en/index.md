---
layout: home
hero:
  name: WebGPU Particle Fluid
  text: Technical Whitepaper
  tagline: High-performance GPU particle simulation with compute shaders. Explore the architecture behind 10,000 particles at 60 FPS.
  actions:
    - theme: brand
      text: Live Demo
      link: /demo/
    - theme: alt
      text: Read Whitepaper
      link: /en/whitepaper/architecture
features:
  - icon: ⚡
    title: GPU-Accelerated Physics
    details: All physics calculations run on the GPU via WebGPU compute shaders. Gravity, repulsion, velocity clamping, and boundary bounce in parallel for 10,000 particles.
  - icon: 🎯
    title: Adaptive Quality
    details: Automatically detects device capabilities and adjusts particle count from 2,500 to 10,000. Low-end devices get smooth performance while high-end hardware runs at full capacity.
  - icon: 🎨
    title: Persistent Trails
    details: Beautiful motion trails via dedicated offscreen texture with velocity-based color mapping. Slow particles appear cyan, fast particles glow purple.
  - icon: 📊
    title: Frame-Rate Independent
    details: Physics uses delta time calculations, so simulation runs at the same speed whether you're getting 30 FPS or 144 FPS. No physics explosions on frame drops.
---
