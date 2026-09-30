import { ArrowRight } from 'lucide-react';
import Button from '../../common/Button/Button';
import formatPrice from '../../../utils/formatPrice';
import styles from './PassCard.module.css';

const UNITS = { Hourly: 'per hour', 'Day Pass': 'per day', 'Weekly Pass': 'for 7 day passes' };

function PassCard({ pass, featured = false }) {
  return (
    <article className={`${styles.card} ${featured ? `${styles.featured} on-dark` : ''}`}>
      {featured && <span className={styles.flag}>Most popular</span>}
      <h3 className={styles.name}>{pass.name}</h3>
      <p className={styles.price}>
        {formatPrice(pass.price).replace('.00', '')}
        <span className={styles.unit}>{UNITS[pass.name] || ''}</span>
      </p>
      <p className={styles.description}>{pass.description}</p>
      <Button
        to="/reserve?seat=study-desk"
        variant={featured ? 'accent' : 'ghost'}
        icon={ArrowRight}
        fullWidth
        className={styles.cta}
      >
        Book a desk
      </Button>
    </article>
  );
}

export default PassCard;
