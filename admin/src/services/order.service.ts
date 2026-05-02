import api from "../utils/axios";

export const orderService = {
  getOrders: async (params?: any) => {
    const response = await api.get(`/order`, { params });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/order/status/${orderId}`, { status });
    return response.data;
  },

  updatePaymentStatus: async (orderId: string, status: string) => {
    const response = await api.patch(`/order/payment-status/${orderId}`, { status });
    return response.data;
  },

  deleteOrder: async (orderId: string) => {
    const response = await api.delete(`/order/${orderId}`);
    return response.data;
  },
};
