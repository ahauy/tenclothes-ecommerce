import { create } from "zustand";
import type { IAuthState, IUserProfile } from "../interfaces/iAuthState";
import { authServices } from "../services/authService";
import { userServices } from "../services/userService";
import { useCheckoutInforStore } from "./useCheckoutInforStore";
import { useCartStore } from "./useCartStore";
import { toast } from "sonner";

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: "",
  isAuthLoading: true,
  user: null,

  setAccessToken: (token: string) => {
    localStorage.setItem("access_token", token);
    set({ accessToken: token });
  },

  setUser: (user: IUserProfile | null) => {
    set({ user });
  },

  checkAuth: async () => {
    try {
      const res = await authServices.refreshToken();
      const accessToken: string = res.data.accessToken;
      localStorage.setItem("access_token", accessToken);
      set({ accessToken, isAuthLoading: false });

      // Load profile ngay sau khi có token
      try {
        const profileRes = await userServices.getProfile(accessToken);
        set({ user: profileRes.data.data as IUserProfile });
      } catch {
        // Không block auth nếu getProfile lỗi
        set({ user: null });
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("access_token");
      set({ accessToken: "", isAuthLoading: false, user: null });
    }
  },

  logOut: async () => {
    try {
      await authServices.logOutService();
    } catch (error) {
      console.log("Có lỗi trong quá trình đăng xuất ở server!", error);
    }
    
    // Luôn dọn dẹp các thông tin ở client
    localStorage.removeItem("access_token");
    useCheckoutInforStore.getState().resetAddress();
    useCartStore.getState().clearCart();
    set({ accessToken: "", isAuthLoading: false, user: null });
    toast.success("Đăng xuất thành công!");
  },
}));

