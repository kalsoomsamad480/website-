import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import formatPrice from '../../../utils/formatPrice';
import { formatLongDate } from '../../../utils/formatDate';
import { formatTime } from '../../../utils/openingHours';
import styles from './ChatMessage.module.css';

const URL_RE = /(https?:\/\/[^\s]+)/g;

/** Plain text with line breaks; URLs become links (split with a capture group puts URLs at odd indexes). */
function RichText({ text }) {
  return text.split(URL_RE).map((part, index) =>
    index % 2 === 1 ? (
      <a key={index} href={part} target="_blank" rel="noreferrer" className={styles.link}>
        {part.replace(/^https?:\/\//, '')}
      </a>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function Action({ action, onNavigate }) {
  if (!action) return null;

  if (action.type === 'menu_items' && action.items?.length) {
    return (
      <ul className={styles.items}>
        {action.items.map((item) => (
          <li key={item.slug}>
            <Link
              to={`/menu?search=${encodeURIComponent(item.name)}`}
              className={styles.item}
              onClick={onNavigate}
            >
              {item.image && (
                <img src={item.image} alt="" width={44} height={44} className={styles.thumb} />
              )}
              <span className={styles.itemText}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>{formatPrice(item.price)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  if (action.type === 'reservation_created' && action.reservation) {
    const r = action.reservation;
    return (
      <div className={styles.booking}>
        <CalendarCheck size={20} aria-hidden="true" />
        <span>
          <strong>{r.seatType === 'table' ? 'Table' : 'Study desk'} requested</strong>
          <br />
          {formatLongDate(r.date)}, {formatTime(r.time)}, {r.guests}{' '}
          {r.guests === 1 ? 'person' : 'people'}
        </span>
      </div>
    );
  }

  if (action.type === 'link' && action.href) {
    return (
      <Link to={action.href} className={styles.actionLink} onClick={onNavigate}>
        {action.label}
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    );
  }
  return null;
}

function ChatMessage({ message, onNavigate }) {
  const isUser = message.role === 'user';
  return (
    <li className={`${styles.row} ${isUser ? styles.user : styles.assistant}`}>
      <div className={`${styles.bubble} ${message.isError ? styles.error : ''}`}>
        <span className="visually-hidden">{isUser ? 'You said: ' : 'Assistant: '}</span>
        <p className={styles.text}>
          <RichText text={message.text} />
        </p>
        {!isUser && <Action action={message.action} onNavigate={onNavigate} />}
      </div>
    </li>
  );
}

export default ChatMessage;
