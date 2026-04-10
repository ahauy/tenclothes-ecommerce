import { create } from "zustand";
import { persist } from 'zustand/middleware';

export interface ICartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  size: string;
  image: string;
  quantity: number;
}

export interface ShopState {
  // trạng thái của modal
  openModal: boolean;
  setOpenModal: (open: boolean) => void;

  // danh sách sản phẩm
  cartItems: ICartItem[];

  // các ACTION làm thay đổi state
  addToCart: (item: ICartItem) => void;
  removeFromCart: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<ShopState>()(
  persist(
    (set) => ({
      openModal: false,
      setOpenModal: (open) => set({ openModal: open }),

      // STATE GIỎ HÀNG
      cartItems: [],

      // ACTION: Thêm vào giỏ
      addToCart: (item) => set((state) => {
        // Tìm xem sản phẩm CÙNG SIZE đã có trong giỏ chưa
        const existingItemIndex = state.cartItems.findIndex(
          (i) => i.productId === item.productId && i.size === item.size
        );

        if (existingItemIndex !== -1) {
          // Nếu có rồi -> Tăng số lượng
          const newCart = [...state.cartItems];
          newCart[existingItemIndex].quantity += item.quantity;
          return { cartItems: newCart };
        } else {
          // Nếu chưa có -> Thêm mới
          return { cartItems: [...state.cartItems, item] };
        }
      }),

      // ACTION: Cập nhật số lượng
      updateQuantity: (productId, size, quantity) => set((state) => ({
        cartItems: state.cartItems.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: Math.max(1, quantity) } // Đảm bảo số lượng >= 1
            : item
        )
      })),

      // ACTION: Xóa khỏi giỏ
      removeFromCart: (productId, size) => set((state) => ({
        cartItems: state.cartItems.filter(
          (item) => !(item.productId === productId && item.size === size)
        )
      })),

      // ACTION: Xóa toàn bộ giỏ (Dùng sau khi thanh toán thành công)
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: 'cart-storage', // Tên key lưu trong LocalStorage
      // Chỉ lưu cartItems xuống local storage, không lưu openModal
      partialize: (state) => ({cartItems: state.cartItems}), 
    }
  )
);