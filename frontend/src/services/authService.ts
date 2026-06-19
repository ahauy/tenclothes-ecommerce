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

  forgotPasswordService: async (email: string) => {
    return await api.post("/auth/password/forgot", { email });
  },

  verifyOtpService: async (email: string, otp: string) => {
    return await api.post("/auth/password/otp", { email, otp });
  },

  resetPasswordService: async (
    email: string,
    otp: string,
    password: string,
    confirmPassword: string
  ) => {
    return await api.post("/auth/password/reset", {
      email,
      otp,
      password,
      confirmPassword,
    });
  },
};
