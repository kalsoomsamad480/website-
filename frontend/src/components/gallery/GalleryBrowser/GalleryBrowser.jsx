import { use, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MasonryGrid from '../MasonryGrid/MasonryGrid';
import Lightbox from '../Lightbox/Lightbox';
import useSelection from '../../../hooks/useSelection';
import { getGallery } from '../../../services/galleryService';
import styles from './GalleryBrowser.module.css';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'food', label: 'Food' },
  { value: 'space', label: 'The space' },
  { value: 'people', label: 'People' },
];

function GalleryBrowser() {
  const images = use(getGallery());
  const [filter, setFilter] = useState('all');
  const viewer = useSelection();

  const visible = filter === 'all' ? images : images.filter((image) => image.category === filter);

  return (
    <>
      <ul className={styles.filters} aria-label="Filter photos">
        {FILTERS.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              className={`${styles.chip} ${filter === option.value ? styles.active : ''}`}
              aria-pressed={filter === option.value}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MasonryGrid images={visible} onOpen={viewer.open} />
        </motion.div>
      </AnimatePresence>

      <Lightbox
        images={visible}
        index={viewer.selected ?? 0}
        open={viewer.isOpen}
        onClose={viewer.close}
        onChange={viewer.setSelected}
      />
    </>
  );
}

export default GalleryBrowser;
