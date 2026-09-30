import { motion } from 'framer-motion';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import { fadeUp } from '../../../utils/motionVariants';
import { VALUES } from '../../../utils/constants';
import styles from './ValuesSection.module.css';

function ValuesSection() {
  return (
    <section className="section on-dark band" aria-labelledby="values-title">
      <div className="container">
        <SectionHeading
          id="values-title"
          eyebrow="What we value"
          title={
            <>
              Three things we <em>never</em> rush.
            </>
          }
        />
        <ul className={styles.grid}>
          {VALUES.map((value, index) => (
            <motion.li
              key={value.title}
              className={styles.item}
              variants={fadeUp}
              custom={index * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className={styles.title}>{value.title}</h3>
              <p className={styles.text}>{value.text}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ValuesSection;
