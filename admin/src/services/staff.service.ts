import api from "../utils/axios";

export const staffService = {
  getStaffs: async (params?: Record<string, string | number | boolean | undefined>) => {
    const response = await api.get(`/staffs`, { params });
    return response.data;
  },

  createStaff: async (data: Record<string, unknown> | FormData) => {
    const response = await api.post(`/staffs/create`, data);
    return response.data;
  },

  updateStaff: async (id: string, data: Record<string, unknown> | FormData) => {
    const response = await api.patch(`/staff/${id}`, data);
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await api.delete(`/staff/${id}`);
    return response.data;
  },
};
