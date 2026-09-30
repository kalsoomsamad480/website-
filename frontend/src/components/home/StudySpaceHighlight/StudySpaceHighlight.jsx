import { use } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import DataBoundary from '../../common/DataBoundary/DataBoundary';
import LazyImage from '../../common/LazyImage/LazyImage';
import ScrollReveal from '../../common/ScrollReveal/ScrollReveal';
import Skeleton from '../../common/Skeleton/Skeleton';
import AmenityList from '../../study/AmenityList/AmenityList';
import { getInfo } from '../../../services/infoService';
import styles from './StudySpaceHighlight.module.css';

function Amenities() {
  const info = use(getInfo());
  return <AmenityList amenities={info.amenities} tone="dark" />;
}

function StudySpaceHighlight() {
  return (
    <section className={`section on-dark ${styles.band}`} aria-labelledby="study-highlight-title">
      <div className={`container ${styles.layout}`}>
        <ScrollReveal className={styles.text}>
          <span className="eyebrow">The study space</span>
          <h2 id="study-highlight-title">
            Built for <em>deep</em> work.
          </h2>
          <p className="lead">
            Three zones for three moods: a silent room, a window bar for solo focus, and big tables
            for group projects.
          </p>
          <DataBoundary
            tone="dark"
            fallback={<Skeleton height={160} radius="var(--radius-md)" />}
            errorTitle="Study features did not load."
          >
            <Amenities />
          </DataBoundary>
          <div className={styles.actions}>
            <Button to="/study-space" variant="accent" icon={ArrowRight}>
              Explore the space
            </Button>
            <Button to="/reserve?seat=study-desk" variant="ghostLight">
              Book a desk
            </Button>
          </div>
        </ScrollReveal>

        <ScrollReveal className={styles.visual} delay={0.1}>
          <LazyImage
            src="/images/study/hero.webp"
            alt="People working on laptops at Alladin Cafe"
            width={1400}
            height={900}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export default StudySpaceHighlight;
