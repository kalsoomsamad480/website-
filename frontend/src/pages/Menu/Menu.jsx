import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import DataBoundary from '../../components/common/DataBoundary/DataBoundary';
import ReservationCTA from '../../components/common/ReservationCTA/ReservationCTA';
import MenuBrowser from '../../components/menu/MenuBrowser/MenuBrowser';
import { MenuGridSkeleton } from '../../components/menu/MenuGrid/MenuGrid';
import useCart from '../../hooks/useCart';

function Menu() {
  const { addItem } = useCart();

  return (
    <>
      <SEO
        title="Menu"
        description="Browse coffee, cold drinks, bakery, snacks, meals, and desserts at Alladin Cafe."
      />
      <PageHeader
        eyebrow="The menu"
        title={
          <>
            Made slow, <em>served</em> warm.
          </>
        }
        intro="Coffee, cold drinks, fresh bakes, and honest meals, all made in-house every morning."
      />
      <section className="container" aria-labelledby="menu-items-title">
        <h2 id="menu-items-title" className="visually-hidden">
          All menu items
        </h2>
        <DataBoundary fallback={<MenuGridSkeleton count={8} />} errorTitle="The menu did not load.">
          <MenuBrowser onAdd={addItem} />
        </DataBoundary>
      </section>
      <ReservationCTA />
    </>
  );
}

export default Menu;
