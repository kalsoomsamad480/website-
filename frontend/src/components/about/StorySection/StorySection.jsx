import LazyImage from '../../common/LazyImage/LazyImage';
import ScrollReveal from '../../common/ScrollReveal/ScrollReveal';
import styles from './StorySection.module.css';

const FACTS = [
  { value: '2019', label: 'Opened on Garden Street' },
  { value: '3', label: 'Roasting days every week' },
  { value: '7 am', label: 'When the first buns come out' },
];

function StorySection() {
  return (
    <section className={`container ${styles.layout}`} aria-labelledby="story-title">
      <ScrollReveal className={styles.media}>
        <LazyImage
          src="/images/gallery/barista-pour.webp"
          alt="A barista pouring steamed milk into an espresso"
          width={800}
          height={1100}
        />
      </ScrollReveal>

      <ScrollReveal className={styles.text} delay={0.1}>
        <h2 id="story-title">
          It started with <em>one</em> long table.
        </h2>
        <p className="lead">
          In 2019, a few students needed a place that was calmer than the library and friendlier
          than a chain cafe. So we built one.
        </p>
        <p>
          The first version of Alladin Cafe was a single long table, a borrowed espresso machine, and
          a handwritten sign asking people to keep their voices low. It filled up in a week.
        </p>
        <p>
          Today we have three seating zones, a small roastery at the back, and a bakery that starts
          before sunrise. The idea has not changed: good coffee, honest food, and a quiet seat for
          as long as you need it.
        </p>
        <ul className={styles.facts}>
          {FACTS.map((fact) => (
            <li key={fact.label}>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}

export default StorySection;
