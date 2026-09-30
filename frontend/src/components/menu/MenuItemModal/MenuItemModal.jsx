import { Plus } from 'lucide-react';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import LazyImage from '../../common/LazyImage/LazyImage';
import formatPrice from '../../../utils/formatPrice';
import { MENU_FILTER_TAGS } from '../../../utils/filterMenu';
import styles from './MenuItemModal.module.css';

const TAG_LABELS = Object.fromEntries(MENU_FILTER_TAGS.map((tag) => [tag.value, tag.label]));

function MenuItemModal({ item, open, onClose, onAdd }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="menu-item-title">
      {item && (
        <div className={styles.layout}>
          <div className={styles.media}>
            <LazyImage src={item.image} alt={item.name} width={640} height={800} priority />
          </div>

          <div className={styles.content}>
            <span className="eyebrow">{item.category?.name}</span>
            <h2 id="menu-item-title" className={styles.title}>
              {item.name}
            </h2>
            <p className={styles.price}>{formatPrice(item.price)}</p>
            <p className={styles.description}>{item.description}</p>

            {item.ingredients.length > 0 && (
              <div className={styles.group}>
                <h3 className={styles.groupTitle}>Ingredients</h3>
                <ul className={styles.chips}>
                  {item.ingredients.map((ingredient) => (
                    <li key={ingredient} className={styles.chip}>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className={styles.facts}>
              {item.tags.length > 0 && (
                <div>
                  <dt>Good to know</dt>
                  <dd>{item.tags.map((tag) => TAG_LABELS[tag]).join(', ')}</dd>
                </div>
              )}
              {item.calories != null && (
                <div>
                  <dt>Calories</dt>
                  <dd>{item.calories} kcal</dd>
                </div>
              )}
              <div>
                <dt>Availability</dt>
                <dd>{item.isAvailable ? 'Available today' : 'Sold out today'}</dd>
              </div>
            </dl>

            {onAdd && item.isAvailable && (
              <Button icon={Plus} size="lg" fullWidth onClick={() => onAdd(item)}>
                Add to cart
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default MenuItemModal;
