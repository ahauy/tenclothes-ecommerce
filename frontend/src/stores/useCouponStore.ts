import { create } from "zustand";
import api from "../utils/axios";
import { useAuthStore } from "./useAuthStore";

export interface ICouponState {
  code: string;                // Mã user đã nhập
  appliedCode: string | null;  // Mã đã được validate thành công
  discountType: "fixed" | "percentage" | null;
  discountValue: number;
  discountAmount: number;      // Số tiền thực tế giảm
  finalAmount: number | null;
  isValidating: boolean;
  error: string | null;
  // Actions
  applyCoupon: (code: string, cartTotal: number, productIds: string[]) => Promise<void>;
  removeCoupon: () => void;
  setCode: (code: string) => void;
}

export const useCouponStore = create<ICouponState>((set) => ({
  code: "",
  appliedCode: null,
  discountType: null,
  discountValue: 0,
  discountAmount: 0,
  finalAmount: null,
  isValidating: false,
  error: null,

  setCode: (code) => set({ code, error: null }),

  applyCoupon: async (code, cartTotal, productIds) => {
    if (!code.trim()) {
      set({ error: "Vui lòng nhập mã giảm giá!" });
      return;
    }

    set({ isValidating: true, error: null });

    try {
      const token = useAuthStore.getState().accessToken;
      const response = await api.post(
        "/coupons/validate",
        { code: code.trim(), cartTotal, productIds },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.data.status) {
        const data = response.data.data;
        set({
          appliedCode: data.code,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountAmount: data.discountAmount,
          finalAmount: data.finalAmount,
          error: null,
          isValidating: false,
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Mã giảm giá không hợp lệ!";
      set({ error: msg, appliedCode: null, discountAmount: 0, finalAmount: null, isValidating: false });
    }
  },

  removeCoupon: () =>
    set({
      code: "",
      appliedCode: null,
      discountType: null,
      discountValue: 0,
      discountAmount: 0,
      finalAmount: null,
      error: null,
      isValidating: false,
    }),
}));
