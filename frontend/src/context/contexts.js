import { createContext } from 'react';

// Context objects live apart from their providers so component files export only components
export const AuthContext = createContext(null);
export const CartContext = createContext(null);
