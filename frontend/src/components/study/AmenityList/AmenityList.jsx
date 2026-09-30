import styles from './AmenityList.module.css';

/** Study-friendly features as clean typography, no icons. amenities = [{ title, description }] */
function AmenityList({ amenities, tone = 'light' }) {
  return (
    <ul className={`${styles.list} ${tone === 'dark' ? styles.dark : ''}`}>
      {amenities.map((amenity) => (
        <li key={amenity.title} className={styles.item}>
          <h3 className={styles.title}>{amenity.title}</h3>
          <p className={styles.description}>{amenity.description}</p>
        </li>
      ))}
    </ul>
  );
}

export default AmenityList;
