import api from './api';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getProducts(params = {}) {
    const res = await api.get('/admin/products', { params });
    return res.data;
  },

  async createProduct(productData) {
    const res = await api.post('/admin/products', productData);
    return res.data;
  },

  async updateProduct(id, productData) {
    const res = await api.put(`/admin/products/${id}`, productData);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/admin/products/${id}`);
    return res.data;
  },

  async getOrders(params = {}) {
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },

  async updateOrderStatus(id, status) {
    const res = await api.patch(`/admin/orders/${id}/status`, { status });
    return res.data;
  },
};
