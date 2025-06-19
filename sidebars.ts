import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'welcome',
    {
      type: 'category',
      label: 'Background',
      items: ['background/overview', 'background/UTXOs', 'background/notes', 'background/nullifiers', 'background/zero-knowledge-proofs', 'background/zk-circuits'],
    },
    {
      type: 'category',
      label: 'Stack',
      items: ['stack/overview', { 
        type: 'category', label: 'Public State', items: [
          'stack/public-state/storage', 
          'stack/public-state/settlement', 
          'stack/public-state/avm'
        ] 
      },
      { 
        type: 'category', label: 'Private State', items: [
          'stack/private-state/pxe-and-notes', 
          'stack/private-state/private-kernel' 
        ] 
      },
      'stack/transaction-lifecycle'
    ],
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
      label: 'Governance',
      items: ['governance/overview'],
    },
    {
      type: 'category',
      label: 'Standards',
      items: ['standards/overview', 'standards/arc-20'],
    },
    {
      type: 'category',
      label: 'Tooling',
      items: ['tooling/overview'],
    },
  ],
};

export default sidebars;
