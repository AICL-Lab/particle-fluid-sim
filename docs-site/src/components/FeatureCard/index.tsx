import React from 'react';
import styles from './styles.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps): JSX.Element {
  return (
    <div className={styles.featureCard}>
      {icon && <div className={styles.featureIcon}>{icon}</div>}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
