import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  async getMyOrders() {
    const res = await api.get('/orders');
    return res.data;
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};
