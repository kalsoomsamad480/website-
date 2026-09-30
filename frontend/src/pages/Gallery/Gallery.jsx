import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import DataBoundary from '../../components/common/DataBoundary/DataBoundary';
import Skeleton from '../../components/common/Skeleton/Skeleton';
import ReservationCTA from '../../components/common/ReservationCTA/ReservationCTA';
import GalleryBrowser from '../../components/gallery/GalleryBrowser/GalleryBrowser';

function Gallery() {
  return (
    <>
      <SEO title="Gallery" description="Photos of coffee, food, and quiet corners at Alladin Cafe." />
      <PageHeader
        eyebrow="Gallery"
        title={
          <>
            Moments from <em>our</em> tables.
          </>
        }
        intro="Morning light, latte art, and long afternoons of focused work."
      />
      <section className="container" aria-label="Photos">
        <DataBoundary
          fallback={<Skeleton height={480} radius="var(--radius-lg)" />}
          errorTitle="Photos did not load."
        >
          <GalleryBrowser />
        </DataBoundary>
      </section>
      <ReservationCTA />
    </>
  );
}

export default Gallery;
