import { create } from "zustand";
import type { IAuthState, IUserProfile } from "../interfaces/iAuthState";
import { authServices } from "../services/authService";
import { userServices } from "../services/userService";
import { toast } from "sonner";

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: "",
  isAuthLoading: true,
  user: null,

  setAccessToken: (token: string) => {
    set({ accessToken: token });
  },

  setUser: (user: IUserProfile | null) => {
    set({ user });
  },

  checkAuth: async () => {
    try {
      const res = await authServices.refreshToken();
      const accessToken: string = res.data.accessToken;
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
      set({ accessToken: "", isAuthLoading: false, user: null });
    }
  },

  logOut: async () => {
    try {
      await authServices.logOutService();
      set({ accessToken: "", isAuthLoading: false, user: null });
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.log("Có lỗi trong quá trình đăng xuất!", error);
    }
  },
}));
