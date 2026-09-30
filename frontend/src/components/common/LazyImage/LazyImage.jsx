import { useState } from 'react';
import styles from './LazyImage.module.css';

/**
 * Lazy-loaded image that fades in once decoded. The parent sets the size and aspect ratio;
 * pass width/height so the browser can reserve space and avoid layout shift.
 * Use `priority` for the largest above-the-fold image.
 */
function LazyImage({ src, alt, width, height, priority = false, className = '' }) {
  const [status, setStatus] = useState('loading');

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={`${styles.image} ${styles[status]} ${className}`}
    />
  );
}

export default LazyImage;
