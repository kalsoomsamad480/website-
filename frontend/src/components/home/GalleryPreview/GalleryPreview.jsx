import { use } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import DataBoundary from '../../common/DataBoundary/DataBoundary';
import LazyImage from '../../common/LazyImage/LazyImage';
import ScrollReveal from '../../common/ScrollReveal/ScrollReveal';
import Skeleton from '../../common/Skeleton/Skeleton';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import { getGallery } from '../../../services/galleryService';
import styles from './GalleryPreview.module.css';

function PreviewGrid() {
  const images = use(getGallery()).slice(0, 5);
  return (
    <ScrollReveal className={styles.grid}>
      {images.map((image) => (
        <Link
          key={image._id}
          to="/gallery"
          className={styles.tile}
          aria-label={`${image.alt}. Open the gallery`}
        >
          <LazyImage src={image.src} alt="" width={image.width} height={image.height} />
        </Link>
      ))}
    </ScrollReveal>
  );
}

function GalleryPreview() {
  return (
    <section className="section" aria-labelledby="gallery-preview-title">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading
            id="gallery-preview-title"
            eyebrow="Gallery"
            title={
              <>
                A look <em>inside</em>.
              </>
            }
          />
          <Button to="/gallery" variant="ghost" icon={ArrowRight}>
            See the gallery
          </Button>
        </div>
        <DataBoundary
          fallback={<Skeleton height={420} radius="var(--radius-lg)" />}
          errorTitle="Photos did not load."
        >
          <PreviewGrid />
        </DataBoundary>
      </div>
    </section>
  );
}

export default GalleryPreview;
