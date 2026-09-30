import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartContext } from './contexts';
import { calculateTotals } from '../utils/money';

const STORAGE_KEY = 'studymind.cart.v1';
const MAX_QUANTITY = 20;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

/** Cart items, drawer state, and the "added" toast. Saved to localStorage. */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked: the cart still works for this visit
    }
  }, [items]);

  // Keep carts in sync across open tabs
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setItems(loadCart());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((menuItem, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((line) => line.id === menuItem._id);
      if (existing) {
        return current.map((line) =>
          line.id === menuItem._id
            ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
            : line,
        );
      }
      const line = {
        id: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.image,
        quantity: Math.min(MAX_QUANTITY, quantity),
      };
      return [...current, line];
    });
    setToast({ name: menuItem.name, key: Date.now() });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setItems((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== id)
        : current.map((line) =>
            line.id === id ? { ...line, quantity: Math.min(MAX_QUANTITY, quantity) } : line,
          ),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((current) => current.filter((line) => line.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => {
    setToast(null);
    setIsOpen(true);
  }, []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const value = useMemo(() => {
    const count = items.reduce((sum, line) => sum + line.quantity, 0);
    return {
      items,
      count,
      ...calculateTotals(items),
      isOpen,
      toast,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      dismissToast,
    };
  }, [
    items,
    isOpen,
    toast,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    dismissToast,
  ]);

  return <CartContext value={value}>{children}</CartContext>;
}

export default CartProvider;
