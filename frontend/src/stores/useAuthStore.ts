import { create } from "zustand";
import type { IAuthState } from "../interfaces/iAuthState";
import { authServices } from "../services/authService";
import { toast } from "sonner";

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
      toast.success("Đăng xuất thành công!")
    } catch (error) {
      console.log("Có lỗi trong quá trình đăng xuất!", error)
    }
  }
}));
