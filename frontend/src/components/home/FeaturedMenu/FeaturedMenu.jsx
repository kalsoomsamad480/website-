import { use } from 'react';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../../common/SectionHeading/SectionHeading';
import Button from '../../common/Button/Button';
import DataBoundary from '../../common/DataBoundary/DataBoundary';
import MenuGrid, { MenuGridSkeleton } from '../../menu/MenuGrid/MenuGrid';
import MenuItemModal from '../../menu/MenuItemModal/MenuItemModal';
import useSelection from '../../../hooks/useSelection';
import useCart from '../../../hooks/useCart';
import { getMenu } from '../../../services/menuService';
import styles from './FeaturedMenu.module.css';

/** One popular item from each category, in menu order. */
function FeaturedItems() {
  const items = use(getMenu());
  const modal = useSelection();
  const { addItem } = useCart();

  const seen = new Set();
  const featured = items
    .filter((item) => {
      const slug = item.category?.slug;
      if (!item.tags.includes('popular') || seen.has(slug)) return false;
      seen.add(slug);
      return true;
    })
    .slice(0, 6);

  return (
    <>
      <MenuGrid items={featured} onOpen={modal.open} onAdd={addItem} columns={3} />
      <MenuItemModal
        item={modal.selected}
        open={modal.isOpen}
        onClose={modal.close}
        onAdd={(item) => {
          addItem(item);
          modal.close();
        }}
      />
    </>
  );
}

function FeaturedMenu() {
  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <div className={styles.head}>
          <SectionHeading
            id="featured-title"
            eyebrow="Crowd favorites"
            title={
              <>
                Loved by our <em>regulars</em>.
              </>
            }
            description="One favorite from every corner of the menu, from the first flat white to the last slice of cheesecake."
          />
          <Button to="/menu" variant="ghost" icon={ArrowRight} className={styles.link}>
            See the full menu
          </Button>
        </div>
        <DataBoundary
          fallback={<MenuGridSkeleton count={6} columns={3} />}
          errorTitle="Our favorites did not load."
        >
          <FeaturedItems />
        </DataBoundary>
      </div>
    </section>
  );
}

export default FeaturedMenu;
