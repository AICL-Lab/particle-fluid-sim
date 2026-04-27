import React from 'react';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/HeroSection';
import FeatureCard from '@site/src/components/FeatureCard';
import styles from './index.module.css';

const features = [
  {
    title: 'GPU Compute Shaders',
    description:
      'All physics calculations run in parallel on the GPU using WebGPU compute shaders for maximum performance.',
  },
  {
    title: 'Frame-Rate Independent',
    description:
      'Physics uses delta time calculations, ensuring consistent simulation speed at any frame rate.',
  },
  {
    title: 'Adaptive Quality',
    description:
      'Automatically detects device capabilities and scales particle count from 2,500 to 10,000 for optimal performance.',
  },
  {
    title: 'Visual Effects',
    description:
      'Beautiful motion trails with velocity-based color mapping from cyan to purple based on particle speed.',
  },
  {
    title: 'Interactive Controls',
    description:
      'Push particles with mouse or touch input. HiDPI-aware coordinate mapping for Retina displays.',
  },
  {
    title: 'Modern Stack',
    description:
      'Built with TypeScript, Vite, WebGPU, and Vitest for a great developer experience.',
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout
      title="WebGPU Particle Fluid Simulation"
      description="High-performance WebGPU particle fluid simulation with 10,000+ particles, GPU compute shaders, and real-time physics."
    >
      <HeroSection
        title="Particle Fluid Simulation"
        subtitle="A spec-driven WebGPU reference project with 10,000+ particles, compute-shader physics, adaptive quality, and a polished browser demo you can inspect and extend."
        badge="WebGPU Powered"
        stats={[
          { value: '10K+', label: 'Particles' },
          { value: '60', label: 'FPS Target' },
          { value: 'GPU', label: 'Accelerated' },
        ]}
        actions={
          <>
            <a className="button button--primary button--lg" href="/demo">
              🚀 Launch Demo
            </a>
            <a className="button button--secondary button--lg" href="/docs/intro">
              📖 Explore Specs
            </a>
          </>
        }
      />
      <main>
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Features</h2>
            <p className={styles.sectionSubtitle}>
              Built with modern web technologies for maximum performance
            </p>
            <div className={styles.featuresGrid}>
              {features.map((feature, idx) => (
                <FeatureCard key={idx} {...feature} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
