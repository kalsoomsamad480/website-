import { useState } from 'react';
import styles from './ConfirmButton.module.css';

/** Two-step destructive action: "Delete" -> "Confirm delete" / "Keep". */
function ConfirmButton({ label = 'Delete', confirmLabel = 'Confirm delete', onConfirm, itemName }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return (
      <button type="button" className={styles.trigger} onClick={() => setAsking(true)}>
        {label}
        {itemName && <span className="visually-hidden"> {itemName}</span>}
      </button>
    );
  }

  return (
    <span className={styles.confirm}>
      <button
        type="button"
        className={styles.danger}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {busy ? 'Working...' : confirmLabel}
      </button>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setAsking(false)}
        disabled={busy}
      >
        Keep
      </button>
    </span>
  );
}

export default ConfirmButton;
