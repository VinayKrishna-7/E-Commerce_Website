import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  async getFeaturedProducts() {
    const res = await api.get('/products', { params: { featured: true, limit: 8 } });
    return res.data;
  },
};
