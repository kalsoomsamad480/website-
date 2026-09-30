import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import LazyImage from '../../common/LazyImage/LazyImage';
import ScrollReveal from '../../common/ScrollReveal/ScrollReveal';
import styles from './AboutTeaser.module.css';

function AboutTeaser() {
  return (
    <section className="section surface" aria-labelledby="about-teaser-title">
      <div className={`container ${styles.layout}`}>
        <ScrollReveal className={styles.images}>
          <div className={styles.tall}>
            <LazyImage
              src="/images/about/story-1.webp"
              alt="Our barista pulling an espresso shot"
              width={1000}
              height={1250}
            />
          </div>
          <div className={styles.small}>
            <LazyImage
              src="/images/about/story-2.webp"
              alt="Warm cafe interior with wooden tables"
              width={1000}
              height={750}
            />
          </div>
        </ScrollReveal>

        <ScrollReveal className={styles.text} delay={0.1}>
          <span className="eyebrow">Our story</span>
          <h2 id="about-teaser-title">
            A neighborhood cafe with a <em>studious</em> heart.
          </h2>
          <p className="lead">
            Alladin Cafe started with one long table, a borrowed espresso machine, and a few students
            who needed somewhere calm to think.
          </p>
          <p className={styles.body}>
            Today we roast in small batches, bake every morning, and keep one simple promise: good
            coffee and a quiet seat, for as long as you need it.
          </p>
          <Button to="/about" variant="ghost" icon={ArrowRight}>
            Read our story
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default AboutTeaser;
