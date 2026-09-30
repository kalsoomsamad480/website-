import styles from './HouseRules.module.css';

function HouseRules({ rules }) {
  return (
    <ol className={styles.list}>
      {rules.map((rule) => (
        <li key={rule} className={styles.rule}>
          {rule}
        </li>
      ))}
    </ol>
  );
}

export default HouseRules;
