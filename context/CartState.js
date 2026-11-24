import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { UIProvider, useUI } from './UIContext';
import { CartProvider, useCart, CartContext } from './CartContext';

export { CartContext, useCart, CartProvider } from './CartContext';
export { AuthContext, useAuth, AuthProvider } from './AuthContext';
export { UIContext, useUI, UIProvider } from './UIContext';

function ContextBridge({ children }) {
  const auth = useAuth();
  const ui = useUI();
  const cart = useCart();

  const combinedValue = {
    // Auth domain
    token: auth.token,
    user: auth.user,
    role: auth.role,
    removeToken: auth.removeToken,
    setAuthData: auth.setAuthData,

    // UI domain
    progress: ui.progress,
    setProgress: ui.setProgress,
    sidebar: ui.sidebar,
    ref: ui.ref,
    changeHamburgerIcon: ui.changeHamburgerIcon,
    setChangeHamburgerIcon: ui.setChangeHamburgerIcon,
    importCartDynamically: ui.importCartDynamically,
    setImportCartDynamically: ui.setImportCartDynamically,
    toggleCart: ui.toggleCart,
    toggleSidebar: ui.toggleSidebar,
    toggleSidebarForNavIcons: ui.toggleSidebarForNavIcons,
    toggleCartForNavIcons: ui.toggleCartForNavIcons,

    // Cart domain
    cart: cart.cart,
    Total: cart.Total,
    totalItems: cart.totalItems,
    cartChange: cart.cartChange,
    setCartChange: cart.setCartChange,
    addToCart: cart.addToCart,
    removeFromCart: cart.removeFromCart,
    clearCart: cart.clearCart,
    orderNow: cart.orderNow,
  };

  return (
    <CartContext.Provider value={combinedValue}>
      {children}
    </CartContext.Provider>
  );
}

export default function CartState({ children }) {
  return (
    <UIProvider>
      <AuthProvider>
        <CartProvider>
          <ContextBridge>{children}</ContextBridge>
        </CartProvider>
      </AuthProvider>
    </UIProvider>
  );
}
