import { defineConfig } from 'vitepress';
import { withMermaid } from 'vitepress-plugin-mermaid';
import llmstxt from 'vitepress-plugin-llms';

const rawBase = process.env.VITEPRESS_BASE;
const base = rawBase
  ? rawBase.startsWith('/')
    ? rawBase.endsWith('/')
      ? rawBase
      : `${rawBase}/`
    : `/${rawBase}/`
  : '/';

export default withMermaid(
  defineConfig({
    base,
    title: 'WebGPU Particle Fluid Simulation',
    description: 'High-performance particle fluid simulation with GPU compute shaders',

    // Ignore dead links for external files and localhost URLs
    ignoreDeadLinks: [
      /^\/demo\//,
      'http://localhost:5173',
      /AGENTS\.md$/,
      /CONTRIBUTING\.md$/,
      /README\.md$/,
      /\.\/\.\.\/openspec\//,
      /\.\/\.\.\/\.\.\/\.\.\/AGENTS/,
      /\.\/\.\.\/CONTRIBUTING/,
      /\.\/\.\.\/README/,
    ],

    locales: {
      root: {
        label: 'English',
        lang: 'en-US',
        link: '/en/',
      },
      en: {
        label: 'English',
        lang: 'en-US',
        link: '/en/',
        title: 'WebGPU Particle Fluid Simulation',
        description: 'Technical Whitepaper & Architecture Showcase',
        themeConfig: {
          nav: [
            {
              text: 'Whitepaper',
              link: '/en/whitepaper/architecture',
              activeMatch: '/en/whitepaper/',
            },
            { text: 'API Reference', link: '/en/api/', activeMatch: '/en/api/' },
            { text: 'Guides', link: '/en/guides/getting-started', activeMatch: '/en/guides/' },
            { text: 'Performance', link: '/en/performance' },
            { text: 'Demo', link: '/demo/' },
          ],
          sidebar: {
            '/en/whitepaper/': [
              {
                text: 'Technical Whitepaper',
                items: [
                  { text: 'System Architecture', link: '/en/whitepaper/architecture' },
                  { text: 'Compute Shader Design', link: '/en/whitepaper/compute-shader' },
                  { text: 'Render Pipeline', link: '/en/whitepaper/render-pipeline' },
                  { text: 'Adaptive Quality System', link: '/en/whitepaper/quality-system' },
                ],
              },
            ],
            '/en/api/': [
              {
                text: 'API Reference',
                items: [{ text: 'Overview', link: '/en/api/' }],
              },
            ],
            '/en/guides/': [
              {
                text: 'Development Guides',
                items: [
                  { text: 'Getting Started', link: '/en/guides/getting-started' },
                  { text: 'Environment Setup', link: '/en/guides/setup' },
                  { text: 'Testing', link: '/en/guides/testing' },
                  { text: 'Contributing', link: '/en/guides/contributing' },
                ],
              },
            ],
          },
        },
      },
      zh: {
        label: '简体中文',
        lang: 'zh-CN',
        link: '/zh/',
        title: 'WebGPU 粒子流体模拟',
        description: '技术白皮书与架构展示',
        themeConfig: {
          nav: [
            {
              text: '技术白皮书',
              link: '/zh/whitepaper/architecture',
              activeMatch: '/zh/whitepaper/',
            },
            { text: 'API 参考', link: '/zh/api/', activeMatch: '/zh/api/' },
            { text: '开发指南', link: '/zh/guides/getting-started', activeMatch: '/zh/guides/' },
            { text: '性能指南', link: '/zh/performance' },
            { text: '演示', link: '/demo/' },
          ],
          sidebar: {
            '/zh/whitepaper/': [
              {
                text: '技术白皮书',
                items: [
                  { text: '系统架构', link: '/zh/whitepaper/architecture' },
                  { text: '计算着色器设计', link: '/zh/whitepaper/compute-shader' },
                  { text: '渲染管线', link: '/zh/whitepaper/render-pipeline' },
                  { text: '自适应质量系统', link: '/zh/whitepaper/quality-system' },
                ],
              },
            ],
            '/zh/api/': [
              {
                text: 'API 参考',
                items: [{ text: '概述', link: '/zh/api/' }],
              },
            ],
            '/zh/guides/': [
              {
                text: '开发指南',
                items: [
                  { text: '快速开始', link: '/zh/guides/getting-started' },
                  { text: '环境配置', link: '/zh/guides/setup' },
                  { text: '测试', link: '/zh/guides/testing' },
                  { text: '贡献指南', link: '/zh/guides/contributing' },
                ],
              },
            ],
          },
        },
      },
    },

    themeConfig: {
      outline: [2, 3],
      search: { provider: 'local' },
      socialLinks: [{ icon: 'github', link: 'https://github.com/LessUp/particle-fluid-sim' }],
      footer: {
        message: 'Built with VitePress',
        copyright: `Copyright © ${new Date().getFullYear()} LessUp`,
      },
    },

    vite: {
      plugins: [llmstxt()],
    },

    mermaid: {
      // Mermaid configuration
    },
  })
);
