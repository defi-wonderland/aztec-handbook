import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'welcome',
    {
      type: 'category',
      label: 'Background',
      items: ['background/overview'],
    },
    {
      type: 'category',
      label: 'Stack',
      items: ['stack/overview'],
    },
    {
      type: 'category',
      label: 'Consensus & Block Production',
      items: ['consensus-block-production/overview'],
    },
    {
      type: 'category',
      label: 'Transactions & Messaging',
      items: ['transactions-and-messaging/overview'],
    },
    {
      type: 'category',
      label: 'Privacy',
      items: ['privacy/overview'],
    },
    {
      type: 'category',
      label: 'Contracts',
      items: ['contracts/overview'],
    },
    {
      type: 'category',
      label: 'Governance',
      items: ['governance/overview'],
    },
    {
      type: 'category',
      label: 'Tooling',
      items: ['tooling/overview'],
    },
  ],
};

export default sidebars;
