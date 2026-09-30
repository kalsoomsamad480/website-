import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import styles from './ChatInput.module.css';

function ChatInput({ onSend, disabled, inputRef }) {
  const [value, setValue] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <label htmlFor="chat-input" className="visually-hidden">
        Message the assistant
      </label>
      <input
        ref={inputRef}
        id="chat-input"
        className={styles.input}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about the menu, hours, or booking..."
        maxLength={500}
        autoComplete="off"
      />
      <button
        type="submit"
        className={styles.send}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
      >
        <SendHorizontal size={20} aria-hidden="true" />
      </button>
    </form>
  );
}

export default ChatInput;
