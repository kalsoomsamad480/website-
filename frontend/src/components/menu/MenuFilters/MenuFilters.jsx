import { ChevronDown } from 'lucide-react';
import { MENU_FILTER_TAGS, PRICE_RANGES, SORT_OPTIONS } from '../../../utils/filterMenu';
import styles from './MenuFilters.module.css';

function Select({ id, label, value, options, onChange }) {
  return (
    <div className={styles.selectWrap}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.chevron} size={18} aria-hidden="true" />
    </div>
  );
}

function MenuFilters({ tags, onToggleTag, price, onPriceChange, sort, onSortChange }) {
  return (
    <div className={styles.filters}>
      <ul className={styles.chips} aria-label="Filter by tag">
        {MENU_FILTER_TAGS.map((tag) => {
          const isOn = tags.includes(tag.value);
          return (
            <li key={tag.value}>
              <button
                type="button"
                className={`${styles.chip} ${isOn ? styles.chipOn : ''}`}
                aria-pressed={isOn}
                onClick={() => onToggleTag(tag.value)}
              >
                {tag.label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={styles.selects}>
        <Select
          id="menu-price"
          label="Price range"
          value={price}
          options={PRICE_RANGES}
          onChange={onPriceChange}
        />
        <Select
          id="menu-sort"
          label="Sort by"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}

export default MenuFilters;
