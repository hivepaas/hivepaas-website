import type { ReactNode } from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Deploy apps',
    description: (
      <>
        From an image or a Git repository, with domains, HTTPS, environment
        variables, secrets and zero-downtime redeploys.
      </>
    ),
  },
  {
    title: 'Databases and the app store',
    description: (
      <>
        PostgreSQL, MySQL, Redis and hundreds of ready-made apps, installed from
        templates with their dependencies and data volumes.
      </>
    ),
  },
  {
    title: 'Your own cluster',
    description: (
      <>
        A Docker Swarm of one server or many: nodes, volumes, networks, backups
        and scheduled jobs, managed from one dashboard.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className="col col--4">
      <div className={styles.card}>
        <Heading as="h3" className={styles.cardTitle}>
          {title}
        </Heading>
        <p className={styles.cardText}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props) => (
            <Feature key={props.title} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
