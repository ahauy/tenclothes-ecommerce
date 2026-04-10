import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ICheckoutInfo {
  // State
  fullName: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  note?: string;
  paymentMethod: string;
  // Action
  setField: (
    field: keyof Omit<ICheckoutInfo, "setField">,
    value: string
  ) => void;
  resetAddress: () => void;
}

export const useCheckoutInforStore = create<ICheckoutInfo>()(
  persist(
    (set) => ({
      fullName: "",
      email: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detailAddress: "",
      note: "",
      paymentMethod: "cod",
      setField: (field, value) => {
        set((state) => ({ ...state, [field]: value }));
      },
      resetAddress: () =>
        set({
          fullName: "",
          email: "",
          phone: "",
          province: "",
          district: "",
          ward: "",
          detailAddress: "",
          note: "",
          paymentMethod: "cod",
        }),
    }),
    {
      name: "checkout-info-store",
      partialize: (state) => ({
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        province: state.province,
        district: state.district,
        ward: state.ward,
        detailAddress: state.detailAddress,
        note: state.note,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);
