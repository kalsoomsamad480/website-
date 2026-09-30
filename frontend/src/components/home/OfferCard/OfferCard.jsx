import LazyImage from '../../common/LazyImage/LazyImage';
import { formatShortDate } from '../../../utils/formatDate';
import styles from './OfferCard.module.css';

function OfferCard({ offer }) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <LazyImage src={offer.image} alt="" width={900} height={675} />
        {offer.discountText && <span className={styles.label}>{offer.discountText}</span>}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{offer.title}</h3>
        <p className={styles.description}>{offer.description}</p>
        <p className={styles.valid}>Valid until {formatShortDate(offer.validTill)}</p>
      </div>
    </article>
  );
}

export default OfferCard;
