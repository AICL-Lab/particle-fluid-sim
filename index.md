---
layout: default
title: WebGPU Particle Fluid Simulation
lang: en
---

<section class="hero section--hero">
  <div class="container hero__content">
    <div class="hero__badge">
      <span class="dot" aria-hidden="true"></span>
      <span>v2.0.0 Now Available</span>
    </div>
    
    <h1 class="hero__title">
      High-Performance GPU Particle Simulation
    </h1>
    
    <p class="hero__description">
      A cutting-edge WebGPU particle fluid simulation that runs entirely in your browser. 
      Experience real-time physics with 10,000+ particles, adaptive quality scaling, and 
      persistent motion trails powered by GPU compute shaders.
    </p>
    
    <div class="hero__actions">
      <a href="https://lessup.github.io/particle-fluid-sim/" class="btn btn--primary btn--lg">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:8px;">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Launch Demo
      </a>
      <a href="{{ '/docs/' | relative_url }}" class="btn btn--secondary btn--lg">
        Documentation
      </a>
      <a href="https://github.com/LessUp/particle-fluid-sim" class="btn btn--ghost btn--lg" target="_blank" rel="noopener noreferrer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:8px;">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a>
    </div>
    
    <div class="hero__stats">
      <div class="hero__stat">
        <span class="value">10K+</span>
        <span class="label">Particles</span>
      </div>
      <div class="hero__stat">
        <span class="value">60</span>
        <span class="label">FPS Target</span>
      </div>
      <div class="hero__stat">
        <span class="value">GPU</span>
        <span class="label">Accelerated</span>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__header">
      <h2>Key Features</h2>
      <p>Built with modern web technologies for maximum performance and compatibility.</p>
    </div>
    
    <div class="grid grid--3">
      <div class="card animate-on-scroll">
        <div class="card__icon">⚡</div>
        <h3 class="card__title">GPU Compute Shaders</h3>
        <p class="card__description">Physics simulation runs entirely on the GPU using WebGPU compute shaders, enabling thousands of particles at 60 FPS.</p>
      </div>
      
      <div class="card animate-on-scroll">
        <div class="card__icon">🎨</div>
        <h3 class="card__title">Adaptive Quality</h3>
        <p class="card__description">Automatically scales from 2,500 to 10,000 particles based on device capabilities, ensuring optimal performance everywhere.</p>
      </div>
      
      <div class="card animate-on-scroll">
        <div class="card__icon">⏱️</div>
        <h3 class="card__title">Frame-Rate Independent</h3>
        <p class="card__description">Physics uses deltaTime for consistent simulation speed regardless of refresh rate or performance variations.</p>
      </div>
      
      <div class="card animate-on-scroll">
        <div class="card__icon">💫</div>
        <h3 class="card__title">Persistent Trails</h3>
        <p class="card__description">Motion trails rendered through an offscreen texture with configurable fade, creating beautiful visual effects.</p>
      </div>
      
      <div class="card animate-on-scroll">
        <div class="card__icon">📱</div>
        <h3 class="card__title">Multi-Device Support</h3>
        <p class="card__description">Works on desktop, laptop, and mobile devices with HiDPI support for crisp rendering on all screens.</p>
      </div>
      
      <div class="card animate-on-scroll">
        <div class="card__icon">🧪</div>
        <h3 class="card__title">Well Tested</h3>
        <p class="card__description">Comprehensive property-based testing with Vitest and fast-check ensures reliability and correctness.</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section__header">
      <h2>Render Pipeline</h2>
      <p>Each frame executes four GPU passes in sequence for optimal performance.</p>
    </div>
    
    <div class="pipeline">
      <div class="pipeline__step">
        <div class="number">1</div>
        <h4>Compute</h4>
        <p>Update particle positions, apply gravity, mouse repulsion, and boundary bounce</p>
      </div>
      
      <div class="pipeline__step">
        <div class="number">2</div>
        <h4>Trail</h4>
        <p>Fade the persistent offscreen texture to create motion trails</p>
      </div>
      
      <div class="pipeline__step">
        <div class="number">3</div>
        <h4>Render</h4>
        <p>Draw particles to the offscreen texture with velocity-based colors</p>
      </div>
      
      <div class="pipeline__step">
        <div class="number">4</div>
        <h4>Present</h4>
        <p>Composite the final image to the screen with proper scaling</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__header">
      <h2>Quick Start</h2>
      <p>Get started in minutes with these simple commands.</p>
    </div>
    
    <div class="code-block">
      <div class="code-block__header">
        <span>Terminal</span>
      </div>
      <pre><code class="language-bash"># Clone the repository
git clone https://github.com/LessUp/particle-fluid-sim.git
cd particle-fluid-sim

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in a WebGPU-enabled browser</code></pre>
    </div>
    
    <div class="grid grid--2" style="margin-top: 3rem;">
      <div class="card">
        <h3 class="card__title">Requirements</h3>
        <ul class="feature-list">
          <li>Node.js 18+</li>
          <li>Chrome 113+, Edge 113+, or Safari 17+</li>
          <li>WebGPU-enabled graphics hardware</li>
        </ul>
      </div>
      
      <div class="card">
        <h3 class="card__title">Documentation</h3>
        <ul class="feature-list">
          <li><a href="{{ '/docs/API' | relative_url }}">API Reference</a></li>
          <li><a href="{{ '/docs/PERFORMANCE' | relative_url }}">Performance Guide</a></li>
          <li><a href="{{ '/docs/TROUBLESHOOTING' | relative_url }}">Troubleshooting</a></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section__header">
      <h2>Configuration</h2>
      <p>Fine-tune the simulation to your needs with these configurable constants.</p>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>PARTICLE_COUNT</code></td>
          <td>10,000</td>
          <td>Default number of particles</td>
        </tr>
        <tr>
          <td><code>GRAVITY</code></td>
          <td>600 px/s²</td>
          <td>Downward acceleration</td>
        </tr>
        <tr>
          <td><code>MAX_SPEED</code></td>
          <td>800 px/s</td>
          <td>Velocity ceiling</td>
        </tr>
        <tr>
          <td><code>REPULSION_RADIUS</code></td>
          <td>200 px</td>
          <td>Mouse influence radius</td>
        </tr>
        <tr>
          <td><code>TRAIL_FADE_ALPHA</code></td>
          <td>0.05</td>
          <td>Trail persistence</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section__header">
      <h2>Browser Support</h2>
      <p>WebGPU is required. Check <a href="https://caniuse.com/webgpu" target="_blank" rel="noopener noreferrer">caniuse.com/webgpu</a> for latest support.</p>
    </div>
    
    <div class="grid grid--4">
      <div class="card" style="text-align: center;">
        <div class="card__icon" style="margin: 0 auto;">🌐</div>
        <h4 class="card__title">Chrome</h4>
        <p class="card__description">113+</p>
      </div>
      <div class="card" style="text-align: center;">
        <div class="card__icon" style="margin: 0 auto;">🌊</div>
        <h4 class="card__title">Edge</h4>
        <p class="card__description">113+</p>
      </div>
      <div class="card" style="text-align: center;">
        <div class="card__icon" style="margin: 0 auto;">🧭</div>
        <h4 class="card__title">Safari</h4>
        <p class="card__description">17+</p>
      </div>
      <div class="card" style="text-align: center;">
        <div class="card__icon" style="margin: 0 auto;">🦊</div>
        <h4 class="card__title">Firefox</h4>
        <p class="card__description">Nightly</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container" style="text-align: center;">
    <h2 style="margin-bottom: 1rem;">Ready to Get Started?</h2>
    <p style="font-size: 1.125rem; max-width: 600px; margin: 0 auto 2rem; color: var(--color-text-secondary);">
      Explore the documentation, try the live demo, or check out the source code on GitHub.
    </p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <a href="https://lessup.github.io/particle-fluid-sim/" class="btn btn--primary btn--lg">
        Try the Demo
      </a>
      <a href="{{ '/docs/' | relative_url }}" class="btn btn--secondary btn--lg">
        Read the Docs
      </a>
      <a href="https://github.com/LessUp/particle-fluid-sim" class="btn btn--ghost btn--lg" target="_blank" rel="noopener noreferrer">
        View on GitHub
      </a>
    </div>
  </div>
</section>
