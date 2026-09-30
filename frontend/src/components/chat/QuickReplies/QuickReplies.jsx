import styles from './QuickReplies.module.css';

function QuickReplies({ options, onPick, disabled }) {
  if (!options?.length) return null;
  return (
    <div className={styles.list} role="group" aria-label="Suggested replies">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={styles.chip}
          onClick={() => onPick(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default QuickReplies;
