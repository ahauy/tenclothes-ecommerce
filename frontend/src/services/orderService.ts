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
};
