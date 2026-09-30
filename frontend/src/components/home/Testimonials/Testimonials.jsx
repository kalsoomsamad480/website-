import { use, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import DataBoundary from '../../common/DataBoundary/DataBoundary';
import Skeleton from '../../common/Skeleton/Skeleton';
import { getTestimonials } from '../../../services/testimonialService';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './Testimonials.module.css';

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE_OUT } },
  exit: (direction) => ({ opacity: 0, x: direction * -40, transition: { duration: 0.25 } }),
};

const pad = (value) => String(value).padStart(2, '0');

function Slider() {
  const testimonials = use(getTestimonials());
  const [[index, direction], setSlide] = useState([0, 1]);
  if (!testimonials.length) return null;

  const go = (step) =>
    setSlide(([current]) => [(current + step + testimonials.length) % testimonials.length, step]);
  const current = testimonials[index];

  return (
    <div
      className={styles.slider}
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
    >
      <div className={styles.stage} aria-live="polite">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.figure
            key={current._id}
            className={styles.slide}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${testimonials.length}`}
          >
            <blockquote className={styles.quote}>
              <p>{current.message}</p>
            </blockquote>
            <figcaption className={styles.person}>
              <img src={current.avatar} alt="" width={56} height={56} className={styles.avatar} />
              <span>
                <span className={styles.name}>{current.name}</span>
                <span className={styles.role}>
                  {current.role}, rated {current.rating} out of 5
                </span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className={styles.controls}>
        <p className={styles.counter}>
          <span className={styles.currentNumber}>{pad(index + 1)}</span> /{' '}
          {pad(testimonials.length)}
        </p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => go(1)}
            aria-label="Next testimonial"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="section surface" aria-labelledby="testimonials-title">
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <span className="eyebrow">Kind words</span>
          <h2 id="testimonials-title">
            Regulars, in their <em>own</em> words.
          </h2>
        </header>
        <DataBoundary
          fallback={<Skeleton height={260} radius="var(--radius-md)" />}
          errorTitle="Reviews did not load."
        >
          <Slider />
        </DataBoundary>
      </div>
    </section>
  );
}

export default Testimonials;
