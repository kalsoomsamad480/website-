import { use } from 'react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import DataBoundary from '../../common/DataBoundary/DataBoundary';
import ScrollReveal from '../../common/ScrollReveal/ScrollReveal';
import Skeleton from '../../common/Skeleton/Skeleton';
import OfferCard from '../OfferCard/OfferCard';
import { getOffers } from '../../../services/offerService';
import styles from './OffersSection.module.css';

function OfferGrid() {
  const offers = use(getOffers());
  if (!offers.length) return null;

  return (
    <div className={styles.grid}>
      {offers.map((offer, index) => (
        <ScrollReveal key={offer._id} delay={index * 0.08}>
          <OfferCard offer={offer} />
        </ScrollReveal>
      ))}
    </div>
  );
}

function OffersSkeleton() {
  return (
    <div className={styles.grid}>
      {[0, 1, 2].map((key) => (
        <Skeleton key={key} height={380} radius="var(--radius-lg)" />
      ))}
    </div>
  );
}

function OffersSection() {
  return (
    <section className="section" aria-labelledby="offers-title">
      <div className="container">
        <SectionHeading
          id="offers-title"
          eyebrow="This month"
          title={
            <>
              Small <em>treats</em>, on us.
            </>
          }
          description="A few reasons to come in a little earlier, or stay a little longer."
        />
        <DataBoundary fallback={<OffersSkeleton />} errorTitle="Offers did not load.">
          <OfferGrid />
        </DataBoundary>
      </div>
    </section>
  );
}

export default OffersSection;
