import { motion } from 'framer-motion';
import { Expand } from 'lucide-react';
import LazyImage from '../../common/LazyImage/LazyImage';
import { EASE_OUT } from '../../../utils/motionVariants';
import styles from './MasonryGrid.module.css';

function MasonryGrid({ images, onOpen }) {
  return (
    <ul className={styles.grid}>
      {images.map((image, index) => (
        <motion.li
          key={image._id}
          className={styles.item}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, ease: EASE_OUT, delay: (index % 3) * 0.06 }}
        >
          <button
            type="button"
            className={styles.tile}
            onClick={() => onOpen(index)}
            aria-label={`View larger: ${image.alt}`}
          >
            <LazyImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className={styles.image}
            />
            <span className={styles.hint} aria-hidden="true">
              <Expand size={18} />
            </span>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}

export default MasonryGrid;
