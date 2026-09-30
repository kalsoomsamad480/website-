import { useContext } from 'react';
import { CartContext } from '../context/contexts';

export default function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>.');
  return context;
}
