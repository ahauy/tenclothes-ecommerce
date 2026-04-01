import { create } from "zustand";
import { products } from "../assets/assets"; // Nguồn dữ liệu tĩnh của bạn
import type { IShopState } from "../interfaces/iShopState";

export const useShopStore = create<IShopState>((set) => ({
  products: products,
  currency: "đ",
  delivery_fee: 10,
  openModal: false,
  
  setOpenModal: (isOpen: boolean) => set({ openModal: isOpen }),
}));