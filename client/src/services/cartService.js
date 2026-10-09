import api from './api';

export const cartService = {
  async getCart() {
    const res = await api.get('/cart');
    return res.data;
  },

  async addToCart(productId, quantity = 1) {
    const res = await api.post('/cart', { productId, quantity });
    return res.data;
  },

  async updateCartItem(itemId, quantity) {
    const res = await api.patch(`/cart/${itemId}`, { quantity });
    return res.data;
  },

  async removeCartItem(itemId) {
    const res = await api.delete(`/cart/${itemId}`);
    return res.data;
  },

  async clearCart() {
    const res = await api.delete('/cart');
    return res.data;
  },
};
