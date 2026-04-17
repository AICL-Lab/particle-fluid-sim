// Search index data
const SEARCH_INDEX = [
    {
        title: "API Reference",
        url: "/docs/API/",
        content: "Complete API documentation for WebGPU Particle Fluid Simulation including configuration, types, core modules, and shader constants.",
        tags: ["api", "documentation", "reference", "typescript"]
    },
    {
        title: "Performance Guide",
        url: "/docs/PERFORMANCE/",
        content: "Performance benchmarks, optimization tips, and profiling techniques for the WebGPU particle simulation.",
        tags: ["performance", "optimization", "benchmarks", "gpu"]
    },
    {
        title: "Troubleshooting",
        url: "/docs/TROUBLESHOOTING/",
        content: "Common issues and solutions for WebGPU Particle Fluid Simulation including browser compatibility, initialization errors, and performance problems.",
        tags: ["troubleshooting", "help", "faq", "errors"]
    },
    {
        title: "Architecture Overview",
        url: "/docs/architecture/",
        content: "High-level architecture of the WebGPU Particle Fluid Simulation including CPU-GPU heterogeneous computing model, core components, and data flow.",
        tags: ["architecture", "design", "webgpu", "compute"]
    },
    {
        title: "Setup Guide",
        url: "/docs/setup/",
        content: "Environment setup, development workflow, build process, and deployment instructions for the WebGPU Particle Fluid Simulation project.",
        tags: ["setup", "getting-started", "installation", "development"]
    },
    {
        title: "Tutorials",
        url: "/docs/tutorials/",
        content: "Step-by-step guides for users and developers, from first interaction to building the project.",
        tags: ["tutorials", "guides", "learning", "beginner"]
    },
    {
        title: "README",
        url: "/README/",
        content: "Project overview, features, quick start guide, controls, technical details, and roadmap for WebGPU Particle Fluid Simulation.",
        tags: ["readme", "overview", "introduction"]
    },
    {
        title: "Changelog",
        url: "/CHANGELOG/",
        content: "Version history and release notes for WebGPU Particle Fluid Simulation including v2.0.0 with frame-rate independent physics and v1.0.0 initial release.",
        tags: ["changelog", "releases", "version", "history"]
    },
    {
        title: "Contributing Guide",
        url: "/CONTRIBUTING/",
        content: "Guidelines for contributing to the WebGPU Particle Fluid Simulation project including development setup, coding standards, and pull request process.",
        tags: ["contributing", "development", "guidelines", "community"]
    },
    {
        title: "Maintenance Guide",
        url: "/docs/maintenance/",
        content: "Maintenance procedures for the WebGPU Particle Fluid Simulation project including dependency updates, performance monitoring, and documentation upkeep.",
        tags: ["maintenance", " upkeep", "monitoring"]
    },
    {
        title: "WebGPU",
        url: "/docs/API/#webgpu-module",
        content: "WebGPU module handles device initialization, adapter selection, and canvas configuration. Includes createWebGPUDevices(), configureCanvasContext(), and error handling.",
        tags: ["webgpu", "initialization", "device", "adapter"]
    },
    {
        title: "Simulation Config",
        url: "/docs/API/#simulation-config",
        content: "Simulation configuration constants including PARTICLE_COUNT, GRAVITY, REPULSION_RADIUS, MAX_SPEED, MOUSE_RADIUS, MOUSE_FORCE, and DAMPING.",
        tags: ["config", "constants", "simulation", "parameters"]
    },
    {
        title: "Quality System",
        url: "/docs/architecture/#adaptive-quality-system",
        content: "Adaptive quality system that adjusts particle count at startup based on hardware concurrency, device memory, and viewport size. Scaling rules for different device capabilities.",
        tags: ["quality", "adaptive", "performance", "scaling"]
    }
];
