import LazyImage from '../../common/LazyImage/LazyImage';
import styles from './TeamCard.module.css';

function TeamCard({ member }) {
  return (
    <article className={styles.card}>
      <div className={styles.photo}>
        <LazyImage src={member.image} alt={`Portrait of ${member.name}`} width={600} height={750} />
      </div>
      <h3 className={styles.name}>{member.name}</h3>
      <p className={styles.role}>{member.role}</p>
      <p className={styles.note}>{member.note}</p>
    </article>
  );
}

export default TeamCard;
