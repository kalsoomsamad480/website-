import { use, useMemo, useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import Button from '../../common/Button/Button';
import EmptyState from '../../common/EmptyState/EmptyState';
import FormField from '../../common/FormField/FormField';
import SegmentedControl from '../../common/SegmentedControl/SegmentedControl';
import CartItem from '../../cart/CartItem/CartItem';
import CartSummary from '../../cart/CartSummary/CartSummary';
import PaymentOptions from '../PaymentOptions/PaymentOptions';
import useCart from '../../../hooks/useCart';
import { getMenu } from '../../../services/menuService';
import { placeOrder } from '../../../services/orderService';
import { calculateTotals } from '../../../utils/money';
import styles from './CheckoutForm.module.css';

const ORDER_TYPES = [
  { value: 'pickup', label: 'Pickup' },
  { value: 'dine-in', label: 'Dine in' },
];

/** Reviews the cart against the live menu, then places the order. */
function CheckoutForm({ onPlaced }) {
  const cart = useCart();
  const menu = use(getMenu());
  const [orderType, setOrderType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Current price and availability for each cart line
  const lines = useMemo(() => {
    const byId = new Map(menu.map((item) => [item._id, item]));
    return cart.items.map((line) => {
      const live = byId.get(line.id);
      let warning = '';
      if (!live) warning = 'No longer on the menu. Please remove it.';
      else if (!live.isAvailable) warning = 'Sold out today. Please remove it.';
      else if (live.price !== line.price) warning = `Price updated to the current menu price.`;
      return {
        ...line,
        price: live?.price ?? line.price,
        warning,
        blocked: !live || !live.isAvailable,
      };
    });
  }, [cart.items, menu]);

  const totals = calculateTotals(lines.filter((line) => !line.blocked));
  const hasBlocked = lines.some((line) => line.blocked);

  if (!cart.items.length) {
    return (
      <EmptyState
        title="Your cart is empty."
        text="Add something from the menu and it will show up here."
        action={
          <Button to="/menu" icon={ArrowRight}>
            Browse the menu
          </Button>
        }
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const order = await placeOrder({
        items: lines.map((line) => ({ menuItem: line.id, quantity: line.quantity })),
        orderType,
        paymentMethod,
        notes: notes.trim(),
      });
      cart.clearCart();
      onPlaced(order);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.layout} onSubmit={handleSubmit}>
      <div className={styles.main}>
        <section className={styles.block} aria-labelledby="checkout-items">
          <h2 id="checkout-items" className={styles.blockTitle}>
            Your order
          </h2>
          <ul className={styles.items}>
            {lines.map((line) => (
              <CartItem
                key={line.id}
                item={line}
                price={line.price}
                warning={line.warning}
                onQuantityChange={cart.updateQuantity}
                onRemove={cart.removeItem}
              />
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="checkout-type">
          <h2 id="checkout-type" className={styles.blockTitle}>
            How would you like it?
          </h2>
          <SegmentedControl
            options={ORDER_TYPES}
            value={orderType}
            onChange={setOrderType}
            label="Order type"
          />
          <p className={styles.hint}>
            {orderType === 'pickup'
              ? 'Ready at the counter in about 15 minutes.'
              : 'Find a seat and we will bring it to your table.'}
          </p>
        </section>

        <section className={styles.block} aria-labelledby="checkout-payment">
          <h2 id="checkout-payment" className={styles.blockTitle}>
            Payment
          </h2>
          <PaymentOptions value={paymentMethod} onChange={setPaymentMethod} />
        </section>

        <section className={styles.block}>
          <FormField
            as="textarea"
            label="Notes for the barista"
            optional
            maxLength={300}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Oat milk, extra hot, no sugar..."
          />
        </section>
      </div>

      <aside className={styles.sidebar} aria-label="Order summary">
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>
            Order <em>summary</em>
          </h2>
          <CartSummary {...totals} />
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          {hasBlocked && (
            <p className={styles.error} role="alert">
              Remove the highlighted items to continue.
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            icon={ArrowRight}
            fullWidth
            disabled={submitting || hasBlocked}
          >
            {submitting ? 'Placing your order...' : 'Place order'}
          </Button>
          <p className={styles.secure}>
            <Lock size={14} aria-hidden="true" />
            Demo checkout. No real payment is taken.
          </p>
        </div>
      </aside>
    </form>
  );
}

export default CheckoutForm;
