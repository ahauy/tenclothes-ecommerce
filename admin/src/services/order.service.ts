import api from "../utils/axios";

export const orderService = {
  getOrderStats: async () => {
    const response = await api.get(`/orders/stats`);
    return response.data;
  },

  getOrders: async (params?: Record<string, string | number | boolean | undefined>) => {
    const response = await api.get(`/orders`, { params });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, statusData: { orderStatus?: string, paymentStatus?: string }) => {
    const response = await api.patch(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  batchUpdateOrderStatus: async (orderIds: string[], statusData: { orderStatus?: string, paymentStatus?: string }) => {
    const response = await api.patch(`/orders/batch/status`, { orderIds, ...statusData });
    return response.data;
  },

  deleteOrder: async (orderId: string) => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },

  batchDeleteOrders: async (orderIds: string[]) => {
    const response = await api.delete(`/orders/batch`, { data: { orderIds } });
    return response.data;
  },
};
