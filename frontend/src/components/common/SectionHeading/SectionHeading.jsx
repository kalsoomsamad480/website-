import styles from './SectionHeading.module.css';

/** Eyebrow, title, and optional description. Pass JSX with <em> to accent a word. */
function SectionHeading({ id, eyebrow, title, description, align = 'left', as: Heading = 'h2' }) {
  return (
    <header className={`${styles.heading} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {description && <p className={`lead ${styles.description}`}>{description}</p>}
    </header>
  );
}

export default SectionHeading;
