import { MapPin } from 'lucide-react';
import Button from '../../common/Button/Button';
import LazyImage from '../../common/LazyImage/LazyImage';
import OpenStatus from '../../common/OpenStatus/OpenStatus';
import { CAFE_INFO } from '../../../utils/constants';
import { getGroupedHours } from '../../../utils/openingHours';
import styles from './ContactInfo.module.css';

function ContactInfo() {
  const hours = getGroupedHours();

  return (
    <div className={styles.info}>
      <div className={styles.map}>
        <LazyImage
          src="/images/contact/storefront.webp"
          alt="The Alladin Cafe storefront at night"
          width={1000}
          height={750}
        />
        <div className={styles.mapCard}>
          <p className={styles.address}>{CAFE_INFO.address.join(', ')}</p>
          <Button href={CAFE_INFO.mapUrl} target="_blank" rel="noreferrer" size="sm" icon={MapPin}>
            Get directions
          </Button>
        </div>
      </div>

      <dl className={styles.details}>
        <div>
          <dt>Call us</dt>
          <dd>
            <a href={`tel:${CAFE_INFO.phone.replace(/\s/g, '')}`}>{CAFE_INFO.phone}</a>
          </dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${CAFE_INFO.email}`}>{CAFE_INFO.email}</a>
          </dd>
        </div>
        <div className={styles.hours}>
          <dt>Opening hours</dt>
          <dd>
            <ul>
              {hours.map((group) => (
                <li key={group.label}>
                  <span>{group.label}</span>
                  <span>{group.hours}</span>
                </li>
              ))}
            </ul>
            <OpenStatus className={styles.status} />
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default ContactInfo;
