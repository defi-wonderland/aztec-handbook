import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

const categories = [
  {
    title: 'Background',
    icon: '/img/specialization.svg',
    href: '/docs/background/overview',
  },
  {
    title: 'Stack',
    icon: '/img/specialization.svg',
    href: '/docs/stack/overview',
  },
  {
    title: 'Governance',
    icon: '/img/governance.svg',
    href: '/docs/governance/overview',
  },
  {
    title: 'Privacy',
    icon: '/img/specialization.svg',
    href: '/docs/privacy/overview',
  },
];

function Home(): React.ReactElement {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title={siteConfig.title}
      description="A curated guide to our best practices, processes, and technical insights.">
      <main className={styles.main}>
        <div className={styles.centerContent}>
          <div className={styles.heroTitle}>
            <img src="/img/logo/aztec.svg" alt="Aztec Handbook" className={styles.heroImage} />
          </div>
          <p className={styles.description}>
           New to Aztec? This handbook is your guide through all the things you need to know before you get started. Cheers!
          </p>
          <div className={styles.buttonContainer}>
            <Link to="/docs/welcome" className={styles.buttonLink}>
              <img src="/img/buttons/button.svg" alt="Get Started" className={styles.buttonImage} />
            </Link>
          </div>
          <div className={styles.categoryCards}>
            {categories.map((category) => (
              <Link
                key={category.title}
                to={category.href}
                className={styles.categoryCard}
              >
                <span className={styles.categoryTitle}>{category.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
