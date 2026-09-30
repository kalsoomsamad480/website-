import { ArrowRight } from 'lucide-react';
import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import Button from '../../components/common/Button/Button';
import DataBoundary from '../../components/common/DataBoundary/DataBoundary';
import LazyImage from '../../components/common/LazyImage/LazyImage';
import Loader from '../../components/common/Loader/Loader';
import ReservationCTA from '../../components/common/ReservationCTA/ReservationCTA';
import StudyOverview from '../../components/study/StudyOverview/StudyOverview';
import styles from './StudySpace.module.css';

function StudySpace() {
  return (
    <>
      <SEO
        title="Study Space"
        description="Quiet zones, fast Wi-Fi, and a power socket at every seat. See study passes and book a desk at Alladin Cafe."
      />
      <PageHeader
        eyebrow="Study space"
        title={
          <>
            A quiet seat for <em>deep</em> work.
          </>
        }
        intro="Fast Wi-Fi, a socket at every seat, and a quiet zone that stays quiet. Stay for an hour or the whole day."
      >
        <Button to="/reserve?seat=study-desk" icon={ArrowRight}>
          Book a study desk
        </Button>
      </PageHeader>

      <div className={`container ${styles.hero}`}>
        <LazyImage
          src="/images/study/hero.webp"
          alt="People working quietly on laptops at Alladin Cafe"
          width={1400}
          height={900}
          priority
        />
      </div>

      <DataBoundary fallback={<Loader />} errorTitle="Study space details did not load.">
        <StudyOverview />
      </DataBoundary>

      <ReservationCTA
        title={
          <>
            Your desk is <em>waiting</em>.
          </>
        }
        text="Book a study desk for a focused session, or a table if you are bringing the whole group."
        primary={{ to: '/reserve?seat=study-desk', label: 'Book a study desk' }}
        secondary={{ to: '/reserve', label: 'Reserve a table' }}
      />
    </>
  );
}

export default StudySpace;
