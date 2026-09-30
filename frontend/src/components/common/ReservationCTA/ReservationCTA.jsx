import { ArrowRight } from 'lucide-react';
import Button from '../Button/Button';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import styles from './ReservationCTA.module.css';

/** Gold call-to-action band that ends most pages. */
function ReservationCTA({
  title = (
    <>
      Save your <em>seat</em>.
    </>
  ),
  text = 'Book a table for friends or a study desk for a focused session. It takes less than a minute.',
  primary = { to: '/reserve', label: 'Reserve a table' },
  secondary = { to: '/reserve?seat=study-desk', label: 'Book a study desk' },
}) {
  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="reservation-cta-title">
      <ScrollReveal className={`${styles.band} on-gold`}>
        <div className={styles.text}>
          <h2 id="reservation-cta-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.lead}>{text}</p>
        </div>
        <div className={styles.actions}>
          <Button to={primary.to} size="lg" icon={ArrowRight}>
            {primary.label}
          </Button>
          {secondary && (
            <Button to={secondary.to} variant="ghostDark" size="lg">
              {secondary.label}
            </Button>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}

export default ReservationCTA;
