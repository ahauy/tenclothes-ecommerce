import api from "../utils/axios";

export const authServices = {
  logInService: async (email: string, password: string) => {
    return await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
  },

  registerService: async (
    fullName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    return await api.post("/auth/register", {
      fullName,
      email,
      password,
      confirmPassword,
    });
  },

  logOutService: async () => {
    return await api.post(
      "auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
  },

  refreshToken: async () => {
    return await api.post("/auth/refresh-token", {}, { withCredentials: true });
  },
};
