import api from "../utils/axios";

export const customerService = {
  getCustomers: async (params?: Record<string, string | number | boolean | undefined>) => {
    const response = await api.get(`/user`, { params });
    return response.data;
  },

  updateCustomerStatus: async (id: string, isActive: boolean) => {
    const response = await api.patch(`/user/status/${id}`, { isActive });
    return response.data;
  },

  deleteCustomer: async (id: string) => {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  },
};
