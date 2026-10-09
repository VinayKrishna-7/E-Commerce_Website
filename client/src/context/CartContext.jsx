import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { SHIPPING_THRESHOLD, FLAT_SHIPPING_FEE } from '../utils/constants';

const CartContext = createContext();

const GUEST_CART_KEY = 'shopease_guest_cart';

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load guest cart from localStorage
  const getGuestCart = () => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (newItems) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  // Sync / fetch cart depending on auth state
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        // First check if there's any guest cart items to merge
        const guestItems = getGuestCart();
        if (guestItems.length > 0) {
          for (const item of guestItems) {
            try {
              await cartService.addToCart(item.product.id, item.quantity);
            } catch {
              // ignore merge conflicts
            }
          }
          localStorage.removeItem(GUEST_CART_KEY);
        }

        const data = await cartService.getCart();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load cart from server:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setItems(getGuestCart());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      toastError('This item is currently out of stock');
      return false;
    }

    if (isAuthenticated) {
      try {
        const res = await cartService.addToCart(product.id, quantity);
        await fetchCart();
        success(`Added "${product.name}" to your cart`);
        return true;
      } catch (err) {
        toastError(err.message || 'Could not add to cart');
        return false;
      }
    } else {
      // Guest cart
      const current = getGuestCart();
      const existingIndex = current.findIndex((item) => item.product.id === product.id);

      let updated = [];
      if (existingIndex > -1) {
        const newQty = current[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          toastError(`Cannot add more than available stock (${product.stock})`);
          return false;
        }
        updated = [...current];
        updated[existingIndex].quantity = newQty;
      } else {
        if (quantity > product.stock) {
          toastError(`Cannot add more than available stock (${product.stock})`);
          return false;
        }
        updated = [
          ...current,
          {
            id: 'guest_' + product.id,
            quantity,
            product,
          },
        ];
      }
      saveGuestCart(updated);
      setItems(updated);
      success(`Added "${product.name}" to your cart`);
      return true;
    }
  };

  // Update quantity
  const updateQuantity = async (itemId, quantity, maxStock) => {
    if (quantity < 1) return;
    if (maxStock !== undefined && quantity > maxStock) {
      toastError(`Only ${maxStock} units available`);
      return;
    }

    if (isAuthenticated) {
      try {
        await cartService.updateCartItem(itemId, quantity);
        setItems((prev) =>
          prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
        );
      } catch (err) {
        toastError(err.message || 'Could not update quantity');
      }
    } else {
      const current = getGuestCart();
      const updated = current.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      saveGuestCart(updated);
      setItems(updated);
    }
  };

  // Remove item
  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await cartService.removeCartItem(itemId);
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        success('Item removed from cart');
      } catch (err) {
        toastError(err.message || 'Could not remove item');
      }
    } else {
      const current = getGuestCart();
      const updated = current.filter((item) => item.id !== itemId);
      saveGuestCart(updated);
      setItems(updated);
      success('Item removed from cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setItems([]);
      } catch (err) {
        console.error('Failed to clear cart:', err);
      }
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
      setItems([]);
    }
  };

  // Calculate totals
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const price = Number(item.product?.price || 0);
    return acc + price * item.quantity;
  }, 0);

  const shipping = subtotal > 0 && subtotal < SHIPPING_THRESHOLD ? FLAT_SHIPPING_FEE : 0;
  const grandTotal = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        totalItemsCount,
        subtotal,
        shipping,
        grandTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
