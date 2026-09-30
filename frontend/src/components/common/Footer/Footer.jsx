import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import Logo from '../Logo/Logo';
import ScrollReveal from '../ScrollReveal/ScrollReveal';
import { CAFE_INFO, NAV_LINKS } from '../../../utils/constants';
import { getGroupedHours } from '../../../utils/openingHours';
import styles from './Footer.module.css';

const EXTRA_LINKS = [
  { to: '/reserve', label: 'Reservations' },
  { to: '/login', label: 'Sign in' },
];

function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}

function Footer() {
  const today = new Date().getDay();
  const hours = getGroupedHours();

  return (
    <footer className={`${styles.footer} on-dark`}>
      <div className="container">
        <ScrollReveal className={styles.cta}>
          <p className={styles.statement}>
            Stay a while. <em>Think</em> clearly.
          </p>
        </ScrollReveal>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo tone="light" />
            <p className={styles.tagline}>{CAFE_INFO.tagline}</p>
          </div>

          <nav aria-label="Footer">
            <h3 className={styles.heading}>Explore</h3>
            <ul className={styles.list}>
              {[...NAV_LINKS, ...EXTRA_LINKS].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={styles.heading}>Opening hours</h3>
            <ul className={styles.hours}>
              {hours.map((group) => {
                const isToday = group.dayIndexes.includes(today);
                return (
                  <li key={group.label} className={isToday ? styles.today : undefined}>
                    <span className={styles.day}>
                      {group.label}
                      {isToday && <span className={styles.todayTag}>Today</span>}
                    </span>
                    <span>{group.hours}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>Visit us</h3>
            <address className={styles.list}>
              <a href={CAFE_INFO.mapUrl} className={styles.link} target="_blank" rel="noreferrer">
                {CAFE_INFO.address.join(', ')}
              </a>
              <a href={`tel:${CAFE_INFO.phone.replace(/\s/g, '')}`} className={styles.link}>
                {CAFE_INFO.phone}
              </a>
              <a href={`mailto:${CAFE_INFO.email}`} className={styles.link}>
                {CAFE_INFO.email}
              </a>
            </address>
            <ul className={styles.socials}>
              {CAFE_INFO.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} className={styles.social} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            &copy; {new Date().getFullYear()} {CAFE_INFO.name}. Demo website with sample data.
          </p>
          <button type="button" className={styles.toTop} onClick={scrollToTop}>
            Back to top
            <ArrowUp size={16} strokeWidth={2.2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
