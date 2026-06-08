import api from "../utils/axios";
import { useAuthStore } from "../stores/useAuthStore";

export const orderService = {
  getMyOrdersService: async () => {
    const token = useAuthStore.getState().accessToken;
    return await api.get("/orders/my-orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  cancelOrderService: async (orderCode: string, cancelReason: string) => {
    const token = useAuthStore.getState().accessToken;
    return await api.patch(`/orders/${orderCode}/cancel`, { cancelReason }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
  repurchaseOrderService: async (orderCode: string) => {
    const token = useAuthStore.getState().accessToken;
    return await api.post(`/orders/${orderCode}/repurchase`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
