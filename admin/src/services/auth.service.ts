import type { LoginFormData } from "../validators/auth.validator";
import api from "../utils/axios";

export const authService = {
  login: async (data: LoginFormData) => {
    // baseURL is already set to /api/version1/admin in axios.ts
    const response = await api.post(`/auth/login`, data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post(`/auth/refresh-token`);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(`/auth/logout`);
    return response.data;
  },
};
