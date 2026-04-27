import React from 'react';
import styles from './styles.module.css';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  badge?: string;
  stats?: Array<{ value: string; label: string }>;
  actions?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  badge,
  stats,
  actions,
}: HeroSectionProps): JSX.Element {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={
              {
                '--delay': i,
                '--x': `${20 + i * 12}%`,
                '--y': `${20 + (i % 3) * 20}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className={`container ${styles.heroContent}`}>
        {badge && <div className={styles.heroBadge}>{badge}</div>}
        <h1>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
        {stats && stats.length > 0 && (
          <div className={styles.heroStats}>
            {stats.map((stat, i) => (
              <React.Fragment key={i}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
                {i < stats.length - 1 && <div className={styles.statDivider} />}
              </React.Fragment>
            ))}
          </div>
        )}
        {actions && <div className={styles.heroActions}>{actions}</div>}
      </div>
    </section>
  );
}
