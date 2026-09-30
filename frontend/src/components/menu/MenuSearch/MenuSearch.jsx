import { Search, X } from 'lucide-react';
import styles from './MenuSearch.module.css';

function MenuSearch({ value, onChange }) {
  return (
    <div className={styles.search} role="search">
      <label htmlFor="menu-search" className="visually-hidden">
        Search the menu
      </label>
      <Search className={styles.icon} size={20} strokeWidth={2} aria-hidden="true" />
      <input
        id="menu-search"
        type="search"
        className={styles.input}
        placeholder="Search coffee, cake, chicken..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={18} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default MenuSearch;
