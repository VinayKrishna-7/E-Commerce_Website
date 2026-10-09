import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

const GUEST_WISHLIST_KEY = 'shopease_guest_wishlist';

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getGuestWishlist = () => {
    try {
      const stored = localStorage.getItem(GUEST_WISHLIST_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestWishlist = (newItems) => {
    try {
      localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(newItems));
    } catch {
      // ignore
    }
  };

  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        // Merge guest items if any
        const guestItems = getGuestWishlist();
        if (guestItems.length > 0) {
          for (const item of guestItems) {
            try {
              await wishlistService.addToWishlist(item.product.id);
            } catch {
              // ignore duplicate
            }
          }
          localStorage.removeItem(GUEST_WISHLIST_KEY);
        }

        const data = await wishlistService.getWishlist();
        setItems(data.items || []);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setItems(getGuestWishlist());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return items.some((item) => item.product?.id === productId || item.productId === productId);
  };

  const toggleWishlist = async (product) => {
    if (!product) return;
    const isSaved = isInWishlist(product.id);

    if (isSaved) {
      // Remove
      if (isAuthenticated) {
        try {
          await wishlistService.removeFromWishlist(product.id);
          setItems((prev) => prev.filter((item) => (item.product?.id || item.productId) !== product.id));
          success(`Removed "${product.name}" from wishlist`);
        } catch (err) {
          toastError(err.message || 'Could not update wishlist');
        }
      } else {
        const current = getGuestWishlist();
        const updated = current.filter((item) => item.product.id !== product.id);
        saveGuestWishlist(updated);
        setItems(updated);
        success(`Removed "${product.name}" from wishlist`);
      }
    } else {
      // Add
      if (isAuthenticated) {
        try {
          await wishlistService.addToWishlist(product.id);
          await fetchWishlist();
          success(`Saved "${product.name}" to wishlist`);
        } catch (err) {
          toastError(err.message || 'Could not add to wishlist');
        }
      } else {
        const current = getGuestWishlist();
        const updated = [...current, { id: 'guest_' + product.id, product, productId: product.id }];
        saveGuestWishlist(updated);
        setItems(updated);
        success(`Saved "${product.name}" to wishlist`);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(productId);
        setItems((prev) => prev.filter((item) => (item.product?.id || item.productId) !== productId));
        success('Item removed from wishlist');
      } catch (err) {
        toastError(err.message || 'Could not remove item');
      }
    } else {
      const current = getGuestWishlist();
      const updated = current.filter((item) => item.product.id !== productId);
      saveGuestWishlist(updated);
      setItems(updated);
      success('Item removed from wishlist');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        loading,
        count: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
