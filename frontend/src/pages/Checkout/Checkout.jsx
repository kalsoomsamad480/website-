import { useState } from 'react';
import SEO from '../../components/common/SEO/SEO';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import DataBoundary from '../../components/common/DataBoundary/DataBoundary';
import Loader from '../../components/common/Loader/Loader';
import CheckoutForm from '../../components/checkout/CheckoutForm/CheckoutForm';
import OrderSuccess from '../../components/checkout/OrderSuccess/OrderSuccess';

function Checkout() {
  const [placedOrder, setPlacedOrder] = useState(null);

  const handlePlaced = (order) => {
    setPlacedOrder(order);
    window.scrollTo({ top: 0 });
  };

  if (placedOrder) {
    return (
      <>
        <SEO noIndex title="Order placed" description="Your Alladin Cafe order has been placed." />
        <OrderSuccess order={placedOrder} />
      </>
    );
  }

  return (
    <>
      <SEO noIndex title="Checkout" description="Review your Alladin Cafe order and check out." />
      <PageHeader
        eyebrow="Checkout"
        title={
          <>
            Almost <em>there</em>.
          </>
        }
        intro="Review your order, add a note for the barista, and choose pickup or dine in."
      />
      <div className="container">
        <DataBoundary fallback={<Loader />} errorTitle="We could not load your checkout.">
          <CheckoutForm onPlaced={handlePlaced} />
        </DataBoundary>
      </div>
    </>
  );
}

export default Checkout;
