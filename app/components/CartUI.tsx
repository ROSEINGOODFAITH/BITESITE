import {createContext, useCallback, useContext, useMemo, useState} from 'react';

interface CartUIState {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartUIContext = createContext<CartUIState | null>(null);

export function CartUIProvider({children}: {children: React.ReactNode}) {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const value = useMemo(
    () => ({cartOpen, openCart, closeCart}),
    [cartOpen, openCart, closeCart],
  );
  return (
    <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>
  );
}

export function useCartUI(): CartUIState {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error('useCartUI must be used inside CartUIProvider');
  return ctx;
}
