import { icons } from './icons';
import styles from './LinkCard.module.css';

export default function LinkCard({ link, index }) {
  const Icon = icons[link.icon];

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      style={{ '--delay': `${index * 60}ms` }}
    >
      <span className={styles.accentBar} />

      <span className={styles.icon}>
        {Icon ? <Icon /> : null}
      </span>

      <span className={styles.text}>
        <span className={styles.label}>{link.label}</span>
        <span className={styles.desc}>{link.description}</span>
      </span>

      <span className={styles.arrow}>→</span>

      <span className={styles.glow} />
    </a>
  );
}
