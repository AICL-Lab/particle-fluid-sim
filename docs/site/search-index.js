const SEARCH_INDEX = [
    {
        title: "API Reference",
        url: "docs/API/",
        content: "Complete API documentation for WebGPU Particle Fluid Simulation including configuration, types, core modules, and shader constants. Covers WebGPU initialization, buffer management, physics calculations, color mapping, input handling, and quality heuristics.",
        tags: ["api", "documentation", "reference", "typescript", "interface", "types"]
    },
    {
        title: "Performance Guide",
        url: "docs/PERFORMANCE/",
        content: "Performance benchmarks, optimization tips, and profiling techniques for the WebGPU particle simulation. Includes particle count scaling data, frame time breakdown, adaptive quality results, and GPU/CPU optimization strategies.",
        tags: ["performance", "optimization", "benchmarks", "gpu", "fps", "tuning"]
    },
    {
        title: "Troubleshooting",
        url: "docs/TROUBLESHOOTING/",
        content: "Common issues and solutions for WebGPU Particle Fluid Simulation including browser compatibility, initialization errors, performance problems, visual issues, mobile-specific issues, and debugging steps.",
        tags: ["troubleshooting", "help", "faq", "errors", "debug", "issues"]
    },
    {
        title: "Architecture Overview",
        url: "docs/architecture/",
        content: "High-level architecture of the WebGPU Particle Fluid Simulation including CPU-GPU heterogeneous computing model, core components, data flow, render pipeline, and adaptive quality system.",
        tags: ["architecture", "design", "webgpu", "compute", "pipeline", "gpu", "cpu"]
    },
    {
        title: "Setup Guide",
        url: "docs/setup/",
        content: "Environment setup, development workflow, build process, and deployment instructions for the WebGPU Particle Fluid Simulation project. Includes prerequisites, available scripts, project structure, and testing guide.",
        tags: ["setup", "getting-started", "installation", "development", "environment", "build"]
    },
    {
        title: "Tutorials",
        url: "docs/tutorials/",
        content: "Step-by-step guides for users and developers, from first interaction to building the project. Covers basic usage, understanding simulation, modifying parameters, and adding features.",
        tags: ["tutorials", "guides", "learning", "beginner", "how-to", "examples"]
    },
    {
        title: "README",
        url: "README/",
        content: "Project overview, features, quick start guide, controls, architecture, configuration, testing, development scripts, and browser support for WebGPU Particle Fluid Simulation.",
        tags: ["readme", "overview", "introduction", "quick-start", "features"]
    },
    {
        title: "Changelog",
        url: "CHANGELOG/",
        content: "Version history and release notes for WebGPU Particle Fluid Simulation. v2.0.0 introduces frame-rate independent physics, velocity clamping, touch optimization, and CI/CD. v1.0.0 initial release.",
        tags: ["changelog", "releases", "version", "history", "updates", "v2.0.0", "v1.0.0"]
    },
    {
        title: "Contributing Guide",
        url: "CONTRIBUTING/",
        content: "Guidelines for contributing to the WebGPU Particle Fluid Simulation project including development setup, coding standards, commit conventions, pull request process, and code of conduct.",
        tags: ["contributing", "development", "guidelines", "community", "pull-request", "commit"]
    },
    {
        title: "Maintenance Guide",
        url: "docs/maintenance/",
        content: "Maintenance procedures for the WebGPU Particle Fluid Simulation project including version release process, dependency management, documentation updates, testing, and GitHub Actions maintenance.",
        tags: ["maintenance", "release", "dependencies", "dependabot", "ci-cd"]
    },
    {
        title: "WebGPU Initialization",
        url: "docs/API/#webgpu-initialization",
        content: "WebGPU initialization module handles device initialization, adapter selection, canvas configuration, and error handling. Functions include initWebGPU(), setupCanvas(), reconfigureContext(), and showError().",
        tags: ["webgpu", "initialization", "device", "adapter", "canvas", "gpu"]
    },
    {
        title: "Buffer Management",
        url: "docs/API/#buffer-management",
        content: "GPU buffer management for particle data and uniforms. Functions include initializeParticles(), createParticleBuffer(), createUniformBuffer(), updateUniformBuffer(), and createBuffers().",
        tags: ["buffer", "gpu", "storage", "uniform", "particle", "data"]
    },
    {
        title: "Physics Calculations",
        url: "docs/API/#physics",
        content: "CPU reference implementation of physics calculations. Functions include applyGravity(), calculateRepulsion(), clampVelocity(), applyBoundaryBounce(), and updateParticle(). Mirrors WGSL compute shader logic.",
        tags: ["physics", "gravity", "velocity", "collision", "bounce", "simulation"]
    },
    {
        title: "Color Mapping",
        url: "docs/API/#color-mapping",
        content: "Color mapping based on particle velocity. Velocity-to-color interpolation from cyan (slow) to purple (fast). Functions include velocityToColor(), mixColors(), lerp(), and getSpeedFactor().",
        tags: ["color", "velocity", "mapping", "interpolation", "visual", "gradient"]
    },
    {
        title: "Input Handling",
        url: "docs/API/#input-handling",
        content: "Mouse and touch input handling with HiDPI coordinate mapping. Supports both mouse events and touch events. Returns offscreen coordinate when cursor leaves canvas.",
        tags: ["input", "mouse", "touch", "hidpi", "interaction", "events"]
    },
    {
        title: "Quality Heuristics",
        url: "docs/API/#quality-heuristics",
        content: "Runtime particle count adjustment based on device capabilities. Considers hardware concurrency, device memory, fallback adapter, and viewport size. Scales from 2,500 to 10,000 particles.",
        tags: ["quality", "adaptive", "performance", "scaling", "device", "detection"]
    },
    {
        title: "Simulation Configuration",
        url: "docs/API/#configuration",
        content: "Simulation configuration constants including PARTICLE_COUNT (10,000), GRAVITY (600 px/s²), MAX_SPEED (800 px/s), REPULSION_RADIUS (200px), REPULSION_STRENGTH (3000), DAMPING (0.9), and TRAIL_FADE_ALPHA (0.05).",
        tags: ["config", "constants", "simulation", "parameters", "settings", "tuning"]
    },
    {
        title: "WGSL Shader Constants",
        url: "docs/API/#shader-constants",
        content: "Constants injected into WGSL shaders: GRAVITY, REPULSION_RADIUS, REPULSION_STRENGTH, DAMPING, MAX_SPEED for compute shader. CYAN, PURPLE, MAX_SPEED for render shader. TRAIL_FADE_ALPHA for trail shader.",
        tags: ["wgsl", "shader", "constants", "compute", "render", "gpu"]
    },
    {
        title: "Render Pipeline",
        url: "docs/architecture/#render-pipeline",
        content: "Four-pass render pipeline: 1. Compute pass updates physics, 2. Trail pass fades persistent texture, 3. Render pass draws particles, 4. Present pass composites to screen.",
        tags: ["pipeline", "render", "compute", "trail", "present", "frame"]
    },
    {
        title: "Adaptive Quality System",
        url: "docs/architecture/#adaptive-quality-system",
        content: "Adaptive quality system adjusts particle count at startup based on hardware concurrency (CPU cores), device memory (RAM), fallback adapter status, and viewport pixels. Ensures optimal performance across devices.",
        tags: ["quality", "adaptive", "performance", "scaling", "device", "optimization"]
    }
];
