import { motion } from 'framer-motion';
import LazyImage from '../../common/LazyImage/LazyImage';
import { fadeUp } from '../../../utils/motionVariants';
import styles from './SeatingZones.module.css';

const zoneImage = (name) => `/images/study/${name.toLowerCase().replace(/\s+/g, '-')}.webp`;

function SeatingZones({ zones }) {
  return (
    <ul className={styles.grid}>
      {zones.map((zone, index) => (
        <motion.li
          key={zone.name}
          className={styles.card}
          variants={fadeUp}
          custom={index * 0.08}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.media}>
            <LazyImage
              src={zoneImage(zone.name)}
              alt={`The ${zone.name}`}
              width={900}
              height={675}
            />
            <span className={styles.seats}>{zone.seats} seats</span>
          </div>
          <h3 className={styles.name}>{zone.name}</h3>
          <p className={styles.description}>{zone.description}</p>
        </motion.li>
      ))}
    </ul>
  );
}

export default SeatingZones;
