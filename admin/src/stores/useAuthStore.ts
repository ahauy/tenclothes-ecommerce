import { create } from "zustand";
import type { IAdminAuthState, IAdminProfile } from "../interfaces/auth.interface";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export const useAuthStore = create<IAdminAuthState>((set) => ({
  accessToken: "",
  isAuthLoading: true,
  admin: null,

  setAccessToken: (token: string) => {
    localStorage.setItem("access_token", token);
    set({ accessToken: token });
  },

  setAdmin: (admin: IAdminProfile | null) => {
    set({ admin });
  },

  checkAuth: async () => {
    try {
      set({ isAuthLoading: true });
      const response = await authService.refreshToken();
      // Backend returns: { status, message, accessToken, data: user }
      localStorage.setItem("access_token", response.accessToken);
      set({ 
        accessToken: response.accessToken, 
        admin: response.data,
        isAuthLoading: false 
      });
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      localStorage.removeItem("access_token");
      set({ accessToken: "", admin: null, isAuthLoading: false });
    } finally {
      set({ isAuthLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      localStorage.removeItem("access_token");
      set({ accessToken: "", admin: null, isAuthLoading: false });
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
      localStorage.removeItem("access_token");
      // Vẫn xóa state local kể cả khi API lỗi
      set({ accessToken: "", admin: null, isAuthLoading: false });
    }
  },
}));
