import { create } from "zustand";
import type { IAuthState } from "../interfaces/iAuthState";
import { authServices } from "../services/authService";

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: "",
  isAuthLoading: true,
  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },
  checkAuth: async () => {
    try {
      const res = await authServices.refreshToken();
      set({ accessToken: res.data.accessToken, isAuthLoading: false });
    } catch (error) {
      console.error(error);
      set({ accessToken: "", isAuthLoading: false });
    }
  },
  logOut: async () => {
    try {
      await authServices.logOutService();
      set({ accessToken: "", isAuthLoading: false })
    } catch (error) {
      console.log("Có lỗi trong quá trình đăng xuất!", error)
    }
  }
}));
