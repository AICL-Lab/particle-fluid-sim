import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'WebGPU Particle Fluid Simulation',
  tagline: 'High-performance particle fluid simulation with GPU compute shaders',
  url: 'https://lessup.github.io',
  baseUrl: '/particle-fluid-sim/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',

  // 国际化配置
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-CN'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      'zh-CN': {
        label: '简体中文',
        direction: 'ltr',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/LessUp/particle-fluid-sim/tree/master/docs-site/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Particle Fluid',
      logo: {
        alt: 'Particle Fluid Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/demo',
          label: 'Demo',
          position: 'left',
        },
        {
          href: 'https://github.com/LessUp/particle-fluid-sim',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} LessUp. Built with Docusaurus.`,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
