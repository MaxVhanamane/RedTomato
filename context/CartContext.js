import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

export const CartContext = createContext({
  cart: {},
  Total: 0,
  totalItems: 0,
  cartChange: 0,
  setCartChange: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  orderNow: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [Total, setTotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [cartChange, setCartChange] = useState(0);
  const router = useRouter();

  const calculateTotals = useCallback((myCart) => {
    let subTotal = 0;
    let totalQty = 0;
    const keys = Object.keys(myCart || {});

    for (let i = 0; i < keys.length; i++) {
      const item = myCart[keys[i]];
      if (item && item.price && item.qty) {
        subTotal += item.price * item.qty;
        totalQty += item.qty;
      }
    }

    setTotal(subTotal);
    setTotalItems(totalQty);
  }, []);

  const saveCart = useCallback((myCart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(myCart || {}));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
    calculateTotals(myCart);
  }, [calculateTotals]);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        setCart(parsed);
        calculateTotals(parsed);
      }
    } catch (error) {
      localStorage.removeItem('cart');
    }
  }, [calculateTotals]);

  const addToCart = useCallback((slug, qty, price, name, size, type, img) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (name in newCart) {
        newCart[name] = {
          ...newCart[name],
          qty: newCart[name].qty + qty,
        };
      } else {
        newCart[name] = { slug, qty: qty || 1, price, size, type, img };
      }
      saveCart(newCart);
      return newCart;
    });
    setCartChange(Math.random());
  }, [saveCart]);

  const removeFromCart = useCallback((slug, qty, price, name, size, type, img) => {
    setCart((prevCart) => {
      if (!(name in prevCart)) return prevCart;
      const newCart = { ...prevCart };

      if (newCart[name].qty <= 1) {
        const confirmed = typeof window !== 'undefined' ? confirm('Are you sure you want to remove this item?') : true;
        if (confirmed) {
          delete newCart[name];
        }
      } else {
        newCart[name] = {
          ...newCart[name],
          qty: newCart[name].qty - qty,
        };
      }

      saveCart(newCart);
      return newCart;
    });
    setCartChange(Math.random());
  }, [saveCart]);

  const clearCart = useCallback((skipConfirm = false) => {
    const proceed = skipConfirm || (typeof window !== 'undefined' ? confirm('Are you sure you want to clear the cart?') : true);
    if (proceed) {
      setCart({});
      saveCart({});
      setCartChange(Math.random());
    }
  }, [saveCart]);

  const orderNow = useCallback((slug, qty, price, name, size, type, img) => {
    const newCart = { [name]: { slug, qty, price, size, type, img } };
    setCart(newCart);
    saveCart(newCart);
    router.push('/checkout');
  }, [router, saveCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        Total,
        totalItems,
        cartChange,
        setCartChange,
        addToCart,
        removeFromCart,
        clearCart,
        orderNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
