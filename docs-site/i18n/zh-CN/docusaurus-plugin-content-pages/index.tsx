import React from 'react';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/HeroSection';
import FeatureCard from '@site/src/components/FeatureCard';
import styles from '@site/src/pages/index.module.css';

const features = [
  {
    title: 'GPU 计算着色器',
    description: '所有物理计算使用 WebGPU 计算着色器在 GPU 上并行运行，实现最高性能。',
  },
  {
    title: '帧率无关',
    description: '物理计算使用增量时间，确保在任何帧率下都能保持一致的模拟速度。',
  },
  {
    title: '自适应质量',
    description: '自动检测设备性能，动态调整粒子数量（2,500 到 10,000）以获得最佳性能。',
  },
  {
    title: '视觉效果',
    description: '基于速度的颜色映射，粒子速度从青色到紫色渐变，呈现美丽的运动轨迹。',
  },
  {
    title: '交互控制',
    description: '通过鼠标或触摸推动粒子。支持 HiDPI 坐标映射，适配 Retina 显示屏。',
  },
  {
    title: '现代技术栈',
    description: '使用 TypeScript、Vite、WebGPU 和 Vitest 构建，提供出色的开发体验。',
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout
      title="WebGPU 粒子流体模拟"
      description="基于 WebGPU 的高性能粒子流体模拟，支持 10,000+ 粒子、GPU 计算着色器和实时物理计算。"
    >
      <HeroSection
        title="粒子流体模拟"
        subtitle="基于 WebGPU 的规范驱动参考项目，支持 10,000+ 粒子、计算着色器物理、自适应质量，以及可检查和扩展的精美浏览器演示。"
        badge="WebGPU 驱动"
        stats={[
          { value: '10K+', label: '粒子数' },
          { value: '60', label: '目标帧率' },
          { value: 'GPU', label: '加速' },
        ]}
        actions={
          <>
            <a className="button button--primary button--lg" href="/demo">
              🚀 启动演示
            </a>
            <a className="button button--secondary button--lg" href="/docs/intro">
              📖 查看规范
            </a>
          </>
        }
      />
      <main>
        <section className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>功能特性</h2>
            <p className={styles.sectionSubtitle}>使用现代 Web 技术构建，实现最高性能</p>
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
