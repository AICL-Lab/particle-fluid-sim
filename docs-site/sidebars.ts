import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Reference',
      items: ['api', 'architecture', 'performance', 'troubleshooting'],
    },
  ],
};

export default sidebars;
