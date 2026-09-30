import { use, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryTabs from '../CategoryTabs/CategoryTabs';
import MenuSearch from '../MenuSearch/MenuSearch';
import MenuFilters from '../MenuFilters/MenuFilters';
import MenuGrid from '../MenuGrid/MenuGrid';
import MenuItemModal from '../MenuItemModal/MenuItemModal';
import EmptyState from '../../common/EmptyState/EmptyState';
import Button from '../../common/Button/Button';
import useDebounce from '../../../hooks/useDebounce';
import useSelection from '../../../hooks/useSelection';
import { getCategories, getMenu } from '../../../services/menuService';
import { filterMenu } from '../../../utils/filterMenu';
import styles from './MenuBrowser.module.css';

/** Full menu with category tabs, search, tag filters, price and sort. Filters live in the URL. */
function MenuBrowser({ onAdd }) {
  const items = use(getMenu());
  const categories = use(getCategories());
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(() => params.get('search') || '');
  const debouncedSearch = useDebounce(search, 250);
  const modal = useSelection();

  const category = params.get('category') || 'all';
  const tags = useMemo(() => (params.get('tags') || '').split(',').filter(Boolean), [params]);
  const price = params.get('price') || 'any';
  const sort = params.get('sort') || 'featured';

  const setParam = (key, value, fallback) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const toggleTag = (tag) => {
    const next = tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag];
    setParam('tags', next.join(','), '');
  };

  const resetFilters = () => {
    setSearch('');
    setParams({}, { replace: true });
  };

  const visible = useMemo(
    () => filterMenu(items, { category, search: debouncedSearch, tags, price, sort }),
    [items, category, debouncedSearch, tags, price, sort],
  );

  const tabs = [
    { slug: 'all', name: 'All', count: items.length },
    ...categories.map((c) => ({ slug: c.slug, name: c.name, count: c.itemCount })),
  ];
  const hasFilters = category !== 'all' || tags.length > 0 || price !== 'any' || Boolean(search);

  return (
    <>
      <div className={styles.toolbar}>
        <MenuSearch value={search} onChange={setSearch} />
        <div className={styles.tabs}>
          <CategoryTabs
            categories={tabs}
            active={category}
            onChange={(slug) => setParam('category', slug, 'all')}
          />
        </div>
        <MenuFilters
          tags={tags}
          onToggleTag={toggleTag}
          price={price}
          onPriceChange={(value) => setParam('price', value, 'any')}
          sort={sort}
          onSortChange={(value) => setParam('sort', value, 'featured')}
        />
      </div>

      <div className={styles.summary}>
        <p aria-live="polite">
          Showing <strong>{visible.length}</strong> of {items.length} items
        </p>
        {hasFilters && (
          <button type="button" className={styles.reset} onClick={resetFilters}>
            Clear all filters
          </button>
        )}
      </div>

      {visible.length > 0 ? (
        <MenuGrid items={visible} onOpen={modal.open} onAdd={onAdd} />
      ) : (
        <EmptyState
          title="Nothing matches that yet."
          text="Try a different search, or clear the filters to see the whole menu."
          action={
            <Button variant="ghost" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      )}

      <MenuItemModal
        item={modal.selected}
        open={modal.isOpen}
        onClose={modal.close}
        onAdd={
          onAdd &&
          ((item) => {
            onAdd(item);
            modal.close();
          })
        }
      />
    </>
  );
}

export default MenuBrowser;
